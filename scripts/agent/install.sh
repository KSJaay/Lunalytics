#!/bin/bash

set -e

AGENT_NAME="lunalytics_agent"
serverUrl="{{ serverUrl }}"
serverId="{{ serverId }}"
apiKey="{{ apiKey }}"

if [[ "$(uname -s | tr '[:upper:]' '[:lower:]')" == "linux" ]]; then
    if ! command -v wget >/dev/null 2>&1 && ! command -v curl >/dev/null 2>&1; then
        echo "Neither wget nor curl found. Installing wget..."
        if command -v apt-get >/dev/null 2>&1; then
            sudo apt-get update && sudo apt-get install -y wget
        elif command -v dnf >/dev/null 2>&1; then
            sudo dnf install -y wget
        elif command -v yum >/dev/null 2>&1; then
            sudo yum install -y wget
        else
            echo "No supported package manager found. Please install wget or curl manually." >&2
            exit 1
        fi
    fi
    if command -v wget >/dev/null 2>&1; then
        DL="wget -qO-"
    else
        DL="curl -sL"
    fi
else
    echo "This installer currently supports only Linux-based systems." >&2
    exit 1
fi

OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)
case $ARCH in
    x86_64|amd64) ARCH=amd64 ;;
    aarch64|arm64) ARCH=arm64 ;;
    *) echo "Unsupported architecture: $ARCH"; exit 1 ;;
esac

LATEST_TAG=$($DL "https://api.github.com/repos/ksjaay/lunalytics/releases/latest" | grep 'tag_name' | cut -d '"' -f4)
if [ -z "$LATEST_TAG" ]; then
    echo "Could not fetch latest release tag." >&2
    exit 1
fi

AGENT_URL="https://github.com/ksjaay/lunalytics/releases/download/$LATEST_TAG/${AGENT_NAME}_${OS}_${ARCH}"
INSTALL_DIR="/usr/local/lunalytics"

if [ ! -d "$INSTALL_DIR" ]; then
    sudo mkdir -p "$INSTALL_DIR"
fi

echo "Downloading $AGENT_NAME from $AGENT_URL ..."
$DL "$AGENT_URL" > "$AGENT_NAME"
sudo mv "$AGENT_NAME" "$INSTALL_DIR/$AGENT_NAME"
sudo chmod +x "$INSTALL_DIR/$AGENT_NAME"

echo "$AGENT_NAME installed to $INSTALL_DIR/$AGENT_NAME"

SERVICE_FILE="/etc/systemd/system/$AGENT_NAME.service"

sudo bash -c "cat > $SERVICE_FILE" <<EOF
[Unit]
Description=Lunalytics Agent
After=network.target

[Service]
Type=simple 
ExecStart=$INSTALL_DIR/$AGENT_NAME --url "${serverUrl}" --serverId "${serverId}" --apiKey "${apiKey}"
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable $AGENT_NAME
sudo systemctl restart $AGENT_NAME

echo "$AGENT_NAME service started and enabled to run on boot."
