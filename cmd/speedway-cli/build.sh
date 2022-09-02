#!/usr/bin/env bash
set -e

echo "Speedway CLI 🏎  Building..."
go build -o bin/speedway
echo "Done!"

echo "Speedway CLI 🏎  Installing..."
mv bin/speedway /usr/local/bin/speedway
rm -rf bin
echo "Done!"
