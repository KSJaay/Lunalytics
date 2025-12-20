package main

import (
	"agent/request"
	"agent/statistics"
	"agent/statistics/gpu"
	"flag"
	"fmt"
	"log"
	"net/url"
	"os"
	"time"
)

type ProcessesInfo struct {
	CPU statistics.ProcessesInfos `json:"cpu"`
	RAM statistics.ProcessesInfos `json:"ram"`
}

type SystemInfo struct {
	Host    statistics.HostInfo              `json:"host"`
	CPU     statistics.CPUInfo               `json:"cpu"`
	Memory  statistics.MemoryInfo            `json:"memory"`
	Disks   []statistics.DiskInfo            `json:"disks"`
	Network []statistics.NetInfo             `json:"networks"`
	Docker  []statistics.DockerContainerInfo `json:"docker"`
	GPU     []gpu.GPUInfo                    `json:"gpu"`
}

func getStatistics() SystemInfo {
	var sysInfo SystemInfo

	sysInfo.Host = statistics.GetHostInformation()
	sysInfo.CPU = statistics.GetCPUInformation()
	sysInfo.Memory = statistics.GetMemoryInformation()
	sysInfo.Disks = statistics.GetDiskInformation()
	sysInfo.Network = statistics.GetNetworkInformation()

	cpuProcesses, memoryProcesses := statistics.GetTopProcesses(20)
	sysInfo.CPU.Processes = cpuProcesses
	sysInfo.Memory.Processes = memoryProcesses

	sysInfo.Docker = statistics.GetDockerContainers()

	sysInfo.GPU = gpu.GetCurrentGPU()

	return sysInfo
}

func main() {
	// Flags
	urlFlag := flag.String("url", "", "API endpoint URL")
	apiKey := flag.String("apiKey", "", "API key for Authorization header")
	interval := flag.Int("interval", 5, "Interval in seconds between statistics collection")
	serverId := flag.String("serverId", "", "Server ID to add as query parameter")
	flag.Parse()

	if *urlFlag == "" {
		fmt.Println("url flags are required.")
		os.Exit(1)
	}

	if *apiKey == "" {
		fmt.Println("apiKey flags are required.")
		os.Exit(1)
	}

	if *serverId == "" {
		fmt.Println("serverId flags are required.")
		os.Exit(1)
	}

	for {
		startTime := time.Now()
		sysInfo := getStatistics()

		// // Uncomment for testing to see the JSON output
		// if jsonData, err := json.MarshalIndent(sysInfo, "", "  "); err == nil {
		// 	fmt.Println(string(jsonData))

		// } else {
		// 	log.Fatal(err)
		// }

		// // Wait for enter before closing
		// fmt.Println("Press Enter to exit...")
		// fmt.Scanln()

		// return

		u, err := url.Parse(*urlFlag)

		if err != nil {
			log.Printf("Invalid URL: %v", err)
			time.Sleep(time.Duration(*interval) * time.Second)
			continue
		}

		q := u.Query()
		q.Set("serverId", *serverId)
		u.RawQuery = q.Encode()

		request.PostJSON(u.String(), sysInfo, *apiKey)

		elapsedTime := time.Since(startTime)
		log.Printf("System information collected and posted in %s\n", elapsedTime)

		time.Sleep(time.Duration(*interval) * time.Second)
	}
}
