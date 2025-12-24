package statistics

import (
	"github.com/shirou/gopsutil/v4/cpu"
	"github.com/shirou/gopsutil/v4/load"
)

type ProcessesInfos struct {
	TotalProcesses int32         `json:"total_processes"`
	Processes      []ProcessInfo `json:"processes"`
}

type CPUInfo struct {
	ModelName    string         `json:"model_name"`
	Cores        int32          `json:"cores"`
	Threads      int32          `json:"threads"`
	Mhz          float64        `json:"mhz"`
	Cache        int32          `json:"cache"`
	AvgLoad      float64        `json:"avg_load"`
	PerCoreUsage []float64      `json:"per_core_usage"`
	Processes    ProcessesInfos `json:"processes"`
}

func GetCPUInformation() CPUInfo {
	var cpuInfos CPUInfo

	cores, err := cpu.Counts(false)

	if err == nil {
		cpuInfos.Cores = int32(cores)
	}

	threads, err := cpu.Counts(true)

	if err == nil {
		cpuInfos.Threads = int32(threads)
	}

	model, err := cpu.Info()

	if err == nil && len(model) > 0 {
		cpuInfos.ModelName = model[0].ModelName
		cpuInfos.Mhz = model[0].Mhz
		cpuInfos.Cache = model[0].CacheSize
	}

	percentages, err := cpu.Percent(0, true)
	if err == nil {
		cpuInfos.PerCoreUsage = percentages
	}

	avgLoads, err := load.Avg()
	if err == nil {
		cpuInfos.AvgLoad = avgLoads.Load1
	}



	return cpuInfos
}
