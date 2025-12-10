package statistics

import (
	"io"
	"os"
	"path/filepath"
	"runtime"
	"slices"
	"strconv"
	"strings"

	"github.com/shirou/gopsutil/v4/net"
)

type NetInfo struct {
	Iface     string   `json:"iface"`
	IfaceName string   `json:"ifaceName"`
	Default   bool     `json:"default"`
	OperState string   `json:"operstate"`
	Type      string   `json:"type"`
	Speed     int      `json:"speed"`
	BytesSent uint64   `json:"bytes_sent"`
	BytesRecv uint64   `json:"bytes_recv"`
	Addrs     []string `json:"addrs"`
	MAC       string   `json:"mac"`
}

func getLinuxNetType(iface string) string {
	if strings.HasPrefix(iface, "wl") || strings.HasPrefix(iface, "wlan") {
		return "wireless"
	}
	if strings.HasPrefix(iface, "lo") {
		return "loopback"
	}
	return "wired"
}

func getLinuxNetSpeed(iface string) int {
	path := filepath.Join("/sys/class/net", iface, "speed")
	f, err := os.Open(path)
	if err != nil {
		return 0
	}
	defer f.Close()
	data, err := io.ReadAll(f)
	if err != nil {
		return 0
	}
	speed, err := strconv.Atoi(strings.TrimSpace(string(data)))
	if err != nil {
		return 0
	}
	return speed
}

func GetNetworkInformation() []NetInfo {
	interfaces, err := net.Interfaces()
	if err != nil {
		return []NetInfo{}
	}

	var netInfos []NetInfo
	ioCounters, _ := net.IOCounters(true)
	ioMap := make(map[string]net.IOCountersStat)

	for _, io := range ioCounters {
		ioMap[io.Name] = io
	}

	defaultIface := ""

	for _, ni := range interfaces {
		isLoopback := slices.Contains(ni.Flags, "loopback")
		if !isLoopback && len(ni.Addrs) > 0 {
			defaultIface = ni.Name
			break
		}
	}

	for _, ni := range interfaces {
		var addrs []string
		for _, a := range ni.Addrs {
			addrs = append(addrs, a.Addr)
		}

		netType := "wired"
		speed := 0
		if runtime.GOOS == "linux" {
			netType = getLinuxNetType(ni.Name)
			speed = getLinuxNetSpeed(ni.Name)
		} else {
			if slices.Contains(ni.Flags, "loopback") {
				netType = "loopback"
			}
		}

		operState := "down"
		if slices.Contains(ni.Flags, "up") {
			operState = "up"
		}

		netInfo := NetInfo{
			Iface:     ni.Name,
			IfaceName: ni.Name,
			Default:   ni.Name == defaultIface,
			OperState: operState,
			Type:      netType,
			Speed:     speed,
			Addrs:     addrs,
			MAC:       ni.HardwareAddr,
		}

		if io, exists := ioMap[ni.Name]; exists {
			netInfo.BytesSent = io.BytesSent
			netInfo.BytesRecv = io.BytesRecv
		}

		if netInfo.Type == "loopback" {
			continue
		}

		netInfos = append(netInfos, netInfo)
	}

	return netInfos

}
