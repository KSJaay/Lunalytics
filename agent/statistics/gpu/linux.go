//go:build linux

package gpu

import (
	"bytes"
	"fmt"
	"os/exec"
	"regexp"
	"strconv"
	"strings"
)

func GetCurrentGPU() []GPUInfo {
	var gpus []GPUInfo

	out, err := exec.Command("lspci").Output()
	if err != nil {
		return []GPUInfo{}
	}
	lines := strings.Split(string(out), "\n")
	for _, line := range lines {
		if strings.Contains(line, "VGA compatible controller") || strings.Contains(line, "3D controller") || strings.Contains(line, "Display controller") {
			gpus = append(gpus, GPUInfo{Name: line, Details: line})
		}
	}

	nvidiaOut, err := exec.Command("nvidia-smi", "--query-gpu=name,memory.total,memory.used,utilization.gpu,driver_version,temperature.gpu,power.draw,power.limit", "--format=csv,noheader,nounits").Output()
	if err == nil {
		nvidiaLines := bytes.Split(nvidiaOut, []byte{'\n'})
		for i, nline := range nvidiaLines {
			fields := strings.Split(string(nline), ",")
			if len(fields) >= 8 {
				name := strings.TrimSpace(fields[0])
				vram, _ := strconv.ParseUint(strings.TrimSpace(fields[1]), 10, 64)
				memUsed, _ := strconv.ParseUint(strings.TrimSpace(fields[2]), 10, 64)
				usage, _ := strconv.ParseFloat(strings.TrimSpace(fields[3]), 64)
				driver := strings.TrimSpace(fields[4])
				temp, _ := strconv.ParseFloat(strings.TrimSpace(fields[5]), 64)
				powerDraw, _ := strconv.ParseFloat(strings.TrimSpace(fields[6]), 64)
				powerLimit, _ := strconv.ParseFloat(strings.TrimSpace(fields[7]), 64)
				details := ""
				if i < len(gpus) {
					details = gpus[i].Details
				}
				gpus[i] = GPUInfo{
					Name:        name,
					VRAM:        vram,
					Usage:       usage,
					Driver:      driver,
					Vendor:      "NVIDIA",
					Details:     details,
					MemUsed:     memUsed,
					Temperature: temp,
					PowerDraw:   powerDraw,
					PowerLimit:  powerLimit,
				}
			}
		}
	} else {
		radeontopOut, err := exec.Command("radeontop", "-d", "/dev/stdout", "-l", "1").Output()
		if err == nil {
			re := regexp.MustCompile(`gpu \( *([0-9.]+)%\)`)
			match := re.FindStringSubmatch(string(radeontopOut))
			if len(match) == 2 {
				usage, _ := strconv.ParseFloat(match[1], 64)
				for i := range gpus {
					if strings.Contains(strings.ToLower(gpus[i].Name), "amd") || strings.Contains(strings.ToLower(gpus[i].Name), "radeon") {
						gpus[i].Usage = usage
						gpus[i].Vendor = "AMD"
						gpus[i].Details += " | radeontop: " + match[0]
					}
				}
			}
		}

		intelOut, err := exec.Command("intel_gpu_top", "-J", "-s", "100", "-l", "1").Output()
		if err == nil {
			re := regexp.MustCompile(`"busy": *([0-9.]+)`)
			match := re.FindStringSubmatch(string(intelOut))
			if len(match) == 2 {
				usage, _ := strconv.ParseFloat(match[1], 64)
				for i := range gpus {
					if strings.Contains(strings.ToLower(gpus[i].Name), "intel") {
						gpus[i].Usage = usage
						gpus[i].Vendor = "Intel"
						gpus[i].Details += " | intel_gpu_top: " + match[0]
					}
				}
			}
		}
	}

	for i, gpu := range gpus {
		if gpu.VRAM == 0 {
			lshwOut, err := exec.Command("lshw", "-C", "display").Output()
			if err == nil {
				re := regexp.MustCompile(`size: ([0-9]+)MiB`)
				match := re.FindStringSubmatch(string(lshwOut))
				if len(match) == 2 {
					vram, _ := strconv.ParseUint(match[1], 10, 64)
					gpus[i].VRAM = vram * 1024 * 1024
				}
			}
		}

		if gpu.Vendor == "AMD" || gpu.Vendor == "Intel" {
			sensorsOut, err := exec.Command("sensors").Output()
			if err == nil {
				re := regexp.MustCompile(`temp[0-9]+:\s*\+([0-9.]+)`)
				match := re.FindStringSubmatch(string(sensorsOut))
				if len(match) == 2 {
					temp, _ := strconv.ParseFloat(match[1], 64)
					gpus[i].Temperature = temp
					gpus[i].Details += " | sensors: temp=" + match[1]
				}
				rePower := regexp.MustCompile(`power[0-9]+:\s*([0-9.]+)`)
				matchPower := rePower.FindStringSubmatch(string(sensorsOut))
				if len(matchPower) == 2 {
					power, _ := strconv.ParseFloat(matchPower[1], 64)
					gpus[i].PowerDraw = power
					gpus[i].Details += " | sensors: power=" + matchPower[1]
				}
			}

			for _, path := range []string{
				"/sys/class/drm/card0/device/hwmon/hwmon0/temp1_input",
				"/sys/class/drm/card0/device/hwmon/hwmon1/temp1_input",
				"/sys/class/drm/card0/device/hwmon/hwmon0/power1_input",
				"/sys/class/drm/card0/device/hwmon/hwmon1/power1_input",
			} {
				out, err := exec.Command("cat", path).Output()
				if err == nil {
					if strings.Contains(path, "temp") {
						val, _ := strconv.ParseFloat(strings.TrimSpace(string(out)), 64)
						gpus[i].Temperature = val / 1000.0 // millidegree to degree
						gpus[i].Details += " | sysfs: temp=" + fmt.Sprintf("%.1f", gpus[i].Temperature)
					} else if strings.Contains(path, "power") {
						val, _ := strconv.ParseFloat(strings.TrimSpace(string(out)), 64)
						gpus[i].PowerDraw = val / 1000000.0 // microwatt to watt
						gpus[i].Details += " | sysfs: power=" + fmt.Sprintf("%.2f", gpus[i].PowerDraw)
					}
				}
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
