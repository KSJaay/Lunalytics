//go:build darwin

package gpu

import (
	"fmt"
	"os/exec"
	"regexp"
	"strconv"
	"strings"
)

func GetCurrentGPU() []GPUInfo {
	var gpus []GPUInfo

	out, err := exec.Command("system_profiler", "SPDisplaysDataType").Output()
	if err != nil {
		return []GPUInfo{{Details: fmt.Sprintf("system_profiler error: %v", err)}}
	}
	lines := strings.Split(string(out), "\n")
	var current GPUInfo
	for _, line := range lines {
		if strings.Contains(line, "Chipset Model:") {
			current.Name = strings.TrimSpace(strings.Split(line, ":")[1])
		}
		if strings.Contains(line, "VRAM (Total):") {
			vramStr := strings.TrimSpace(strings.Split(line, ":")[1])
			re := regexp.MustCompile(`([0-9]+) MB`)
			match := re.FindStringSubmatch(vramStr)
			if len(match) == 2 {
				vram, _ := strconv.ParseUint(match[1], 10, 64)
				current.VRAM = vram * 1024 * 1024
			}
		}
		if strings.Contains(line, "Vendor:") {
			current.Vendor = strings.TrimSpace(strings.Split(line, ":")[1])
		}
		if strings.Contains(line, "Device ID:") {
			current.DeviceID = strings.TrimSpace(strings.Split(line, ":")[1])
		}
		if strings.Contains(line, "Driver Version:") {
			current.Driver = strings.TrimSpace(strings.Split(line, ":")[1])
		}
		if strings.Contains(line, "Displays:") && current.Name != "" {
			gpus = append(gpus, current)
			current = GPUInfo{}
		}
	}
	if current.Name != "" {
		gpus = append(gpus, current)
	}

	for i := range gpus {
		tempOut, err := exec.Command("ioreg", "-r", "-c", "AppleGPUWrangler").Output()
		if err == nil {
			re := regexp.MustCompile(`"GPU_Temperature" = ([0-9.]+)`)
			match := re.FindStringSubmatch(string(tempOut))
			if len(match) == 2 {
				temp, _ := strconv.ParseFloat(match[1], 64)
				gpus[i].Temperature = temp
				gpus[i].Details += " | ioreg: temp=" + match[1]
			}
			rePower := regexp.MustCompile(`"GPU_Power" = ([0-9.]+)`)
			matchPower := rePower.FindStringSubmatch(string(tempOut))
			if len(matchPower) == 2 {
				power, _ := strconv.ParseFloat(matchPower[1], 64)
				gpus[i].PowerDraw = power
				gpus[i].Details += " | ioreg: power=" + matchPower[1]
			}
		}
	}

	var filteredGPUs []GPUInfo
	for _, g := range gpus {
		if g.VRAM > 0 {
			filteredGPUs = append(filteredGPUs, g)
		}
	}

	return filteredGPUs
}
