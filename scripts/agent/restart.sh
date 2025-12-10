#!/bin/bash

set -e

AGENT_NAME="lunalytics_agent"

if ! systemctl list-units --type=service | grep -q "$AGENT_NAME"; then
    echo "Service $AGENT_NAME does not exist or is not running."
    exit 1
fi

echo "Restarting $AGENT_NAME service..."
sudo systemctl restart $AGENT_NAME
sudo systemctl status $AGENT_NAME --no-pager
