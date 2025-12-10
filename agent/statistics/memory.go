package statistics

import (
	"bufio"
	"bytes"
	"fmt"
	"os/exec"
	"strings"

	"github.com/shirou/gopsutil/v4/mem"
)

type RAMModule struct {
	SlotNumber      string `json:"slot_number"`
	Size            string `json:"size"`
	MaxCapacity     string `json:"max_capacity"`
	FormFactor      string `json:"form_factor"`
	Type            string `json:"type"`
	Speed           string `json:"speed"`
	ConfiguredSpeed string `json:"configured_speed"`
	Manufacturer    string `json:"manufacturer"`
	PartNumber      string `json:"part_number"`
}

type MemoryInfo struct {
	Total     uint64         `json:"total"`
	Available uint64         `json:"available"`
	Used      uint64         `json:"used"`
	Cached    uint64         `json:"cached"`
	SwapTotal uint64         `json:"swap_total"`
	SwapUsed  uint64         `json:"swap_used"`
	SwapFree  uint64         `json:"swap_free"`
	UsedPerc  float64        `json:"used_percent"`
	Processes ProcessesInfos `json:"processes"`
	Modules   []RAMModule    `json:"modules"`
}

func GetRAMModules() ([]RAMModule, error) {
	out, err := exec.Command("sudo", "dmidecode", "-t", "memory").Output()
	if err != nil {
		return nil, fmt.Errorf("failed to run dmidecode: %w", err)
	}

	scanner := bufio.NewScanner(bytes.NewReader(out))

	var modules []RAMModule
	var current *RAMModule
	inMemoryDevice := false

	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())

		if strings.HasPrefix(line, "Memory Device") {
			if current != nil {
				modules = append(modules, *current)
			}
			current = &RAMModule{}
			inMemoryDevice = true
			continue
		}

		if !inMemoryDevice || current == nil {
			continue
		}

		if val, ok := strings.CutPrefix(line, "Size:"); ok {
			current.Size = strings.TrimSpace(val)
		}
		if val, ok := strings.CutPrefix(line, "Maximum Capacity:"); ok {
			current.MaxCapacity = strings.TrimSpace(val)
		}
		if val, ok := strings.CutPrefix(line, "Form Factor:"); ok {
			current.FormFactor = strings.TrimSpace(val)
		}
		if val, ok := strings.CutPrefix(line, "Type:"); ok && !strings.HasPrefix(line, "Type Detail") {
			current.Type = strings.TrimSpace(val)
		}
		if val, ok := strings.CutPrefix(line, "Speed:"); ok && !strings.Contains(line, "Configured") {
			current.Speed = strings.TrimSpace(val)
		}
		if val, ok := strings.CutPrefix(line, "Configured Memory Speed:"); ok {
			current.ConfiguredSpeed = strings.TrimSpace(val)
		}
		if val, ok := strings.CutPrefix(line, "Manufacturer:"); ok {
			current.Manufacturer = strings.TrimSpace(val)
		}
		if val, ok := strings.CutPrefix(line, "Part Number:"); ok {
			current.PartNumber = strings.TrimSpace(val)
		}
		if val, ok := strings.CutPrefix(line, "Locator:"); ok {
			current.SlotNumber = strings.TrimSpace(val)
		}
	}

	if current != nil {
		modules = append(modules, *current)
	}

	return modules, nil
}

func GetMemoryInformation() MemoryInfo {

	var memInfo MemoryInfo

	vm, err := mem.VirtualMemory()
	if err == nil {
		memInfo.Total = vm.Total
		memInfo.Available = vm.Available
		memInfo.Used = vm.Used
		memInfo.Cached = vm.Cached
		memInfo.SwapTotal = vm.SwapTotal
		memInfo.SwapUsed = vm.SwapTotal - vm.SwapFree
		memInfo.SwapFree = vm.SwapFree
		memInfo.UsedPerc = vm.UsedPercent
	}

	modules, err := GetRAMModules()
	if err == nil {
		memInfo.Modules = modules
	}

	return memInfo
}
