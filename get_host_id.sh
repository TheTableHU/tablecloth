#!/bin/bash
# get_host_ip.sh

# Get the IP address of the host machine
HOST_IP=$(hostname)

# Check if the .env file exists
ENV_FILE=".env"
if [ -f "$ENV_FILE" ]; then
  # Update the existing BACKEND_HOST variable or append it
  if grep -q "BACKEND_HOST=" "$ENV_FILE"; then
    sed -i "s/^BACKEND_HOST=.*/BACKEND_HOST=http:\/\/$HOST_IP:8081/" "$ENV_FILE"
  else
    echo "BACKEND_HOST=http://$HOST_IP:8081" >> "$ENV_FILE"
  fi
else
  # Create a new .env file
  echo "BACKEND_HOST=http://$HOST_IP:8081" > "$ENV_FILE"
fi