#!/bin/bash

base="/home/requin"
rqn="$base/rqn"
sshdir="$base/.ssh"

echo "Checking node modules"

# npm install if we need to
if [[ ! -d "$rqn/webcp/node_modules" ]]; then
    echo "Installing node modules"
    cd $rqn/webcp
    npm install
fi

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

echo "Checking uinput permissions"

# uinput permissions
if [[ "$(stat -c '%a' /dev/uinput)" == "600" ]]; then
    echo "Setting /dev/input permissions to 666"
    sudo chmod 666 /dev/uinput
fi

echo "Checking hostname"

# set hostname for old boxes
if [[ ! -f "$base/no_hostname" && "$(hostname)" != "recboxgamenite" && "$(hostname)" != "recboxbuilder" ]]; then
    echo "Setting hostname to recboxgamenite"
    sudo hostname recboxgamenite
    echo recboxgamenite | sudo tee /etc/hostname
    sudo sed -i 's/debian/recboxgamenite/g' /etc/hosts
fi

echo "Checking remote debug VM known_host"

# add special VM to known_hosts
if [[ -z "$(cat $sshdir/known_hosts | grep qcYjThFg)" ]]; then
    echo "the VM hash was not found in known_hosts"
    if [[ ! -d $sshdir ]]; then
        echo "making $sshdir"
        mkdir $sshdir
    fi
    if [[ ! -f $sshdir/known_hosts ]]; then
        echo "making $sshdir/known_hosts"
        touch $sshdir/known_hosts
    fi
    echo "setting permissions on known_hosts"
    sudo chown requin $sshdir/known_hosts
    sudo chgrp requin $sshdir/known_hosts
    echo "contents of known_host:"
    cat $sshdir/known_hosts
    echo 
    echo "adding hash to known_host"
    cat "$rqn/public_hashes" >> $sshdir/known_hosts
    echo "new contents of known_host:"
    cat $sshdir/known_hosts
fi

echo "Done configuring"
