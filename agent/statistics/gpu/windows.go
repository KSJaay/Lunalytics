//go:build windows

package gpu

import (
	"fmt"
	"os/exec"
	"strconv"
	"strings"

	"github.com/StackExchange/wmi"
)

type winVideoController struct {
	Name           string
	AdapterRAM     uint64
	DriverVersion  string
	PNPDeviceID    string
	VideoProcessor string
}

func GetCurrentGPU() []GPUInfo {
	var gpus []GPUInfo
	var controllers []winVideoController
	err := wmi.Query("SELECT Name, AdapterRAM, DriverVersion, PNPDeviceID, VideoProcessor FROM Win32_VideoController", &controllers)
	if err != nil {
		return []GPUInfo{{Details: fmt.Sprintf("WMI error: %v", err)}}
	}

	for _, c := range controllers {
		vendor := ""
		if c.PNPDeviceID != "" {
			if len(c.PNPDeviceID) > 8 {
				ven := c.PNPDeviceID[8:12]
				if ven == "10DE" {
					vendor = "NVIDIA"
				} else if ven == "1002" {
					vendor = "AMD"
				} else if ven == "8086" {
					vendor = "Intel"
				}
			}
		}
		gpu := GPUInfo{
			Name:     c.Name,
			VRAM:     c.AdapterRAM,
			Driver:   c.DriverVersion,
			Vendor:   vendor,
			DeviceID: c.PNPDeviceID,
			Details:  c.VideoProcessor,
		}

		if vendor == "NVIDIA" {
			out, err := exec.Command("nvidia-smi", "--query-gpu=name,memory.total,memory.used,utilization.gpu,driver_version,temperature.gpu,power.draw,power.limit", "--format=csv,noheader,nounits").Output()
			if err == nil {
				fields := strings.Split(strings.TrimSpace(string(out)), ",")
				if len(fields) >= 8 {
					gpu.Name = strings.TrimSpace(fields[0])
					gpu.VRAM, _ = strconv.ParseUint(strings.TrimSpace(fields[1]), 10, 64)
					gpu.MemUsed, _ = strconv.ParseUint(strings.TrimSpace(fields[2]), 10, 64)
					gpu.Usage, _ = strconv.ParseFloat(strings.TrimSpace(fields[3]), 64)
					gpu.Driver = strings.TrimSpace(fields[4])
					gpu.Temperature, _ = strconv.ParseFloat(strings.TrimSpace(fields[5]), 64)
					gpu.PowerDraw, _ = strconv.ParseFloat(strings.TrimSpace(fields[6]), 64)
					gpu.PowerLimit, _ = strconv.ParseFloat(strings.TrimSpace(fields[7]), 64)
					gpu.Details += " | nvidia-smi"
				}
			}
		}

		if vendor == "AMD" {
			gpu.Details += " | AMD vendor tools not implemented"
		}

		if vendor == "Intel" {
			gpu.Details += " | Intel vendor tools not implemented"
		}

		gpus = append(gpus, gpu)
	}

	var filteredGPUs []GPUInfo
	for _, g := range gpus {
		if g.VRAM > 0 {
			filteredGPUs = append(filteredGPUs, g)
		}
	}

	return filteredGPUs
}
