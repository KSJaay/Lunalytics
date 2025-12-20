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

func getTopRAMProcesses(processes []ProcessInfo, n int) ProcessesInfos {
	var ramProcesses ProcessesInfos

	procs := append([]ProcessInfo(nil), processes...) 

	sort.Slice(procs, func(i, j int) bool {
		return procs[i].Memory > procs[j].Memory
	})

	ramProcesses.TotalProcesses = int32(len(procs))

	if len(procs) > n {
		ramProcesses.Processes = procs[:n]
	} else {
		ramProcesses.Processes = procs
	}

	return ramProcesses
}

func getTopCPUProcesses(processes []ProcessInfo, n int) ProcessesInfos {
	var cpuProcesses ProcessesInfos

	procs := append([]ProcessInfo(nil), processes...) 

	sort.Slice(procs, func(i, j int) bool {
		return procs[i].CPU > procs[j].CPU
	})

	cpuProcesses.TotalProcesses = int32(len(procs))

	if len(procs) > n {
		cpuProcesses.Processes = procs[:n]
	} else {
		cpuProcesses.Processes = procs
	}

	return cpuProcesses
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

	return getTopCPUProcesses(processes, n), getTopRAMProcesses(processes, n)
}
