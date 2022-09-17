#!/usr/bin/env bash
set -e

echo "Speedway CLI 🏎  Building..."
go build -o bin/speedway
echo "Done!"

echo "Speedway CLI 🏎  Moving Build..."
sudo mv bin/speedway /usr/local/bin/
rm -rf bin
echo "Done!"
