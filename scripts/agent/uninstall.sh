#!/bin/bash

set -e

AGENT_NAME="lunalytics_agent"
INSTALL_DIR="/usr/local/bin"
SERVICE_FILE="/etc/systemd/system/$AGENT_NAME.service"

if systemctl list-units --type=service | grep -q "$AGENT_NAME"; then
    echo "Stopping $AGENT_NAME service..."
    sudo systemctl stop $AGENT_NAME
    sudo systemctl disable $AGENT_NAME
fi

if [ -f "$INSTALL_DIR/$AGENT_NAME" ]; then
    echo "Removing $INSTALL_DIR/$AGENT_NAME ..."
    sudo rm -f "$INSTALL_DIR/$AGENT_NAME"
fi

if [ -f "$SERVICE_FILE" ]; then
    echo "Removing $SERVICE_FILE ..."
    sudo rm -f "$SERVICE_FILE"
    sudo systemctl daemon-reload
fi

echo "$AGENT_NAME has been uninstalled."
