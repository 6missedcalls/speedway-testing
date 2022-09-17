#!/usr/bin/env bash
set -e

echo "Speedway CLI 🏎  Building..."
go build -o bin/speedway
echo "Done!"

echo "Speedway CLI 🏎  Moving Build..."
# do an OS check and move the binary to the correct location
if [[ "$OSTYPE" == "linux-gnu" ]]; then
    mv bin/speedway /usr/local/bin/speedway
elif [[ "$OSTYPE" == "darwin"* ]]; then
    mv bin/speedway /usr/local/bin/speedway
else
    echo "OS not supported"
    exit 1
fi
rm -rf bin
echo "Done!"
