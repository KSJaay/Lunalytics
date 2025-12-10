package statistics

import (
	"log"

	"github.com/shirou/gopsutil/v4/host"
)

type HostInfo struct {
	Hostname string `json:"hostname"`
	OS       string `json:"os"`
	Distro   string `json:"distro"`
	Release  string `json:"release"`
	Platform string `json:"platform"`
	Arch     string `json:"arch"`
	Uptime   uint64 `json:"uptime"`
	BootTime uint64 `json:"boot_time"`
}

func GetHostInformation() HostInfo {
	var hostInfo HostInfo

	info, err := host.Info()

	if err != nil {
		log.Printf("Error getting host information: %v", err)
		return HostInfo{}
	}

	hostInfo = HostInfo{
		Hostname: info.Hostname,
		OS:       info.OS,
		Distro:   info.Platform,
		Release:  info.PlatformVersion,
		Platform: info.PlatformFamily,
		Arch:     info.KernelArch,
		Uptime:   info.Uptime,
		BootTime: info.BootTime,
	}

	return hostInfo
}
