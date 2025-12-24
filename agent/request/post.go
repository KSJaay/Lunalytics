package request

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
)

func PostJSON(url string, data any, apiKey string) {
	jsonData, err := json.Marshal(data)

	if err != nil {
		log.Printf("Error marshaling JSON: %v", err)
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))

	if err != nil {
		log.Printf("Error creating request: %v", err)
		return
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", apiKey)

	client := &http.Client{}
	resp, err := client.Do(req)

	if err != nil {
		log.Printf("Error posting JSON to %s: %v", url, err)
		return
	}

	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		log.Printf("Non-OK HTTP status: %s", resp.Status)
	}
}
