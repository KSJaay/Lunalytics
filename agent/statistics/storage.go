package statistics

import (
	"github.com/shirou/gopsutil/v4/disk"
)

type DiskInfo struct {
	Device   string  `json:"device"`
	Total    uint64  `json:"total"`
	Used     uint64  `json:"used"`
	Free     uint64  `json:"free"`
	UsedPerc float64 `json:"used_percent"`
}

func GetDiskInformation() []DiskInfo {
	disks, err := disk.Partitions(false)

	if err != nil {
		return []DiskInfo{}
	}

	var diskInfos []DiskInfo

	uniqueDisks := make(map[string]*disk.UsageStat)
	for _, p := range disks {
		if usage, err := disk.Usage(p.Mountpoint); err == nil {
			if _, exists := uniqueDisks[p.Device]; !exists {
				uniqueDisks[p.Device] = usage
			}
		}
	}

	for dev, usage := range uniqueDisks {
		diskInfos = append(diskInfos, DiskInfo{
			Device:   dev,
			Total:    usage.Total,
			Used:     usage.Used,
			Free:     usage.Free,
			UsedPerc: usage.UsedPercent,
		})
	}

	return diskInfos
}
