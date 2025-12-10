package statistics

import (
	"log"
	"sort"

	"github.com/shirou/gopsutil/v4/process"
)

type ProcessInfo struct {
	PID       int32   `json:"pid"`
	Name      string  `json:"name"`
	CPU       float64 `json:"cpu"`
	Memory    float32 `json:"mem"`
	UsedBytes uint64  `json:"mem_bytes"`
}

func GetTopProcesses(n int) (ProcessesInfos, ProcessesInfos) {
	pids, err := process.Pids()
	if err != nil {
		log.Printf("Error getting process IDs: %v", err)
		return ProcessesInfos{}, ProcessesInfos{}
	}

	var processes []ProcessInfo

	for _, pid := range pids {
		proc, err := process.NewProcess(pid)
		if err != nil {
			continue
		}

		proccessInfo := &ProcessInfo{PID: pid}

		cpuPercent, err := proc.CPUPercent()
		if err == nil {
			proccessInfo.CPU = cpuPercent
		}

		memPercent, err := proc.MemoryPercent()
		if err == nil {
			proccessInfo.Memory = memPercent
		}

		memInfo, err := proc.MemoryInfo()
		if err == nil {
			proccessInfo.UsedBytes = memInfo.RSS
		}

		name, err := proc.Name()
		if err == nil {

			shortName := name
			if len(name) > 100 {
				shortName = name[:97] + "..."
			}

			proccessInfo.Name = shortName
		}

		processes = append(processes, *proccessInfo)
	}

	sort.Slice(processes, func(i, j int) bool {
		return processes[i].CPU > processes[j].CPU
	})

	totalProcesses := int32(len(processes))

	cpuProcInfo := ProcessesInfos{
		TotalProcesses: totalProcesses,
		Processes:      processes,
	}

	sort.Slice(processes, func(i, j int) bool {
		return processes[i].Memory > processes[j].Memory
	})

	memoryProcInfo := ProcessesInfos{
		TotalProcesses: totalProcesses,
		Processes:      processes,
	}

	if len(processes) > n {
		return ProcessesInfos{
				TotalProcesses: totalProcesses,
				Processes:      cpuProcInfo.Processes[:n],
			}, ProcessesInfos{
				TotalProcesses: totalProcesses,
				Processes:      memoryProcInfo.Processes[n:],
			}
	}

	return cpuProcInfo, memoryProcInfo
}
