#!/bin/bash

# Exit script on any error
set -e

# Function to display a prompt and read user input
function prompt_for_target() {
    echo "Available devices/emulators:"
    ionic capacitor run android --list

    echo ""
    echo "Enter the target device/emulator ID:"
    read target_device
}

# Build the app in development mode
echo "Building the Ionic app in development mode..."
ionic build --development

# Copy the build to the Android platform
echo "Copying the build to the Android platform..."
ionic capacitor copy android

# Sync the Android platform
echo "Syncing the Android platform..."
ionic capacitor sync android

# Prompt the user for a target device ID
prompt_for_target

# Run the app on the selected target with live reload and external server
echo "Running the app on target device '$target_device' with live reload..."
ionic capacitor run android -l --external --target "$target_device"
