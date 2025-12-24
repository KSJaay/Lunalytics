package gpu

type GPUInfo struct {
	Name        string  `json:"name"`
	VRAM        uint64  `json:"vram"`     // bytes
	MemUsed     uint64  `json:"mem_used"` // bytes
	Usage       float64 `json:"usage"`    // percent
	Driver      string  `json:"driver"`
	Vendor      string  `json:"vendor"`
	DeviceID    string  `json:"device_id"`
	Details     string  `json:"details"`
	Temperature float64 `json:"temperature"` // Celsius
	PowerDraw   float64 `json:"power_draw"`  // Watts
	PowerLimit  float64 `json:"power_limit"` // Watts
}
