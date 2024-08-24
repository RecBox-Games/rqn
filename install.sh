#!/bin/bash

echo "Checking necessary apt packages"

# software tools
if ! command -v sshpass >/dev/null; then
    echo "installing ssh things"
    sudo apt install -y openssh-server sshpass
fi
if ! command -v qrencode >/dev/null; then
    echo "installing qrencode"
    sudo apt install -y qrencode
fi
if ! command -v xdotool >/dev/null; then
    echo "installing xdotool"
    sudo apt install -y xdotool
fi
if ! command -v pqiv >/dev/null; then
    echo "installing pqiv"
    sudo apt install -y pqiv
fi
if ! command -v wmctrl >/dev/null; then
    echo "installing wmctrl"
    sudo apt install -y wmctrl
fi
if ! command -v acpid >/dev/null; then
    echo "installing acpid"
    sudo apt install -y acpid
fi
if ! command -v tmux >/dev/null; then
    echo "installing tmux"
    sudo apt install -y tmux
fi

echo "Checking necessary pip packages"

# gamepad.py pip/python dependencies
if ! pip3 list | grep pynput > /dev/null; then
    echo "pynput is not installed. Installing..."
    pip3 install pynput
fi
if ! pip3 list | grep python-uinput > /dev/null; then
    echo "python-uinput is not installed. Installing..."
    pip3 install python-uinput
fi
if ! pip3 list | grep cffi > /dev/null; then
    echo "cffi for python is not installed. Installing..."
    pip3 install cffi
fi

echo "Done installing"
