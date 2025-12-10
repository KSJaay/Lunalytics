package statistics

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"sync"
	"time"

	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
)

type DockerContainerInfo struct {
	NetRx    uint64   `json:"net_rx"`
	NetTx    uint64   `json:"net_tx"`
	ID       string   `json:"id"`
	Name     string   `json:"name"`
	Image    string   `json:"image"`
	Status   string   `json:"status"`
	State    string   `json:"state"`
	Created  string   `json:"created"`
	Started  string   `json:"started"`
	Ports    []string `json:"ports"`
	CPUUsage float64  `json:"cpu_usage"`
	MemUsage uint64   `json:"mem_usage"`
	MemLimit uint64   `json:"mem_limit"`
	MemPerc  float64  `json:"mem_percent"`
}

func GetDockerContainers() []DockerContainerInfo {
	cli, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	if err != nil {
		return []DockerContainerInfo{}
	}

	containers, err := cli.ContainerList(context.Background(), container.ListOptions{All: true})
	if err != nil {
		return []DockerContainerInfo{}
	}

	var wg sync.WaitGroup
	statsChan := make(chan DockerContainerInfo, len(containers))

	for _, c := range containers {
		wg.Add(1)
		go func(c container.Summary) {
			defer wg.Done()

			name := ""
			if len(c.Names) > 0 {
				name = strings.TrimPrefix(c.Names[0], "/")
			}
			info := DockerContainerInfo{
				ID:      c.ID,
				Name:    name,
				Image:   c.Image,
				Status:  c.Status,
				State:   c.State,
				Created: time.Unix(c.Created, 0).Format(time.RFC3339),
			}

			var ports []string
			for _, p := range c.Ports {
				ports = append(ports, fmt.Sprintf("%d:%d/%s", p.PublicPort, p.PrivatePort, p.Type))
			}
			info.Ports = ports

			inspect, err := cli.ContainerInspect(context.Background(), c.ID)
			if err == nil {
				startedAtTime, parseErr := time.Parse(time.RFC3339Nano, inspect.State.StartedAt)
				if parseErr == nil && !startedAtTime.IsZero() {
					info.Started = startedAtTime.Format(time.RFC3339)
				} else {
					info.Started = "N/A"
				}
			} else {
				info.Started = "N/A"
			}

			// Runs two samples and calculates CPU usage based on the difference
			if c.State == "running" {
				var s1, s2 container.StatsResponse
				var err1, err2 error

				stats1, err := cli.ContainerStatsOneShot(context.Background(), c.ID)
				if err == nil {
					defer stats1.Body.Close()
					err1 = json.NewDecoder(stats1.Body).Decode(&s1)
				} else {
					err1 = err
				}

				// Sleep for 500ms before taking the second sample
				time.Sleep(500 * time.Millisecond)

				stats2, err := cli.ContainerStatsOneShot(context.Background(), c.ID)
				if err == nil {
					defer stats2.Body.Close()
					err2 = json.NewDecoder(stats2.Body).Decode(&s2)
				} else {
					err2 = err
				}

				cpuPercent := 0.0
				if err1 == nil && err2 == nil {
					cpuDelta := float64(s2.CPUStats.CPUUsage.TotalUsage) - float64(s1.CPUStats.CPUUsage.TotalUsage)
					systemDelta := float64(s2.CPUStats.SystemUsage) - float64(s1.CPUStats.SystemUsage)
					numCPUs := float64(s2.CPUStats.OnlineCPUs)
					if numCPUs == 0 {
						numCPUs = float64(len(s2.CPUStats.CPUUsage.PercpuUsage))
					}
					if systemDelta > 0 && cpuDelta > 0 && numCPUs > 0 {
						cpuPercent = (cpuDelta / systemDelta) * numCPUs * 100.0
					}

					var rx, tx uint64
					for _, v := range s2.Networks {
						rx += v.RxBytes
						tx += v.TxBytes
					}
					info.NetRx = rx
					info.NetTx = tx
				}
				info.CPUUsage = cpuPercent

				memUsage := s2.MemoryStats.Usage
				memLimit := s2.MemoryStats.Limit
				memPercent := 0.0
				if memLimit > 0 {
					memPercent = float64(memUsage) / float64(memLimit) * 100
				}
				info.MemUsage = memUsage
				info.MemLimit = memLimit
				info.MemPerc = memPercent
			} else {
				info.CPUUsage = 0
				info.MemUsage = 0
				info.MemLimit = 0
				info.MemPerc = 0
				info.NetRx = 0
				info.NetTx = 0
			}

			statsChan <- info
		}(c)
	}

	wg.Wait()
	close(statsChan)

	containersInfo := make([]DockerContainerInfo, 0, len(containers))
	for s := range statsChan {
		containersInfo = append(containersInfo, s)
	}

	return containersInfo
}
