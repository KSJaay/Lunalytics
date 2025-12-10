package gpu

type GPUInfo struct {
	Name        string
	VRAM        uint64  // bytes
	MemUsed     uint64  // bytes
	Usage       float64 // percent
	Driver      string
	Vendor      string
	DeviceID    string
	Details     string
	Temperature float64 // Celsius
	PowerDraw   float64 // Watts
	PowerLimit  float64 // Watts
}
