#!/bin/bash

set -e

base="/home/requin"
dest="$base/rqn"

# lost permissions
chmod +x $dest/control_pad_target.so
chmod +x $dest/cp_server
chmod +x $dest/codewords
chmod +x $dest/configure.sh
chmod +x $dest/launcher.sh
chmod +x $dest/ota.sh

# set the desktop background
#gsettings set org.gnome.desktop.background picture-uri file:///$dest/requin.png

# save local ip address into a file
ip addr | grep 192.168 | sed 's/^[^0-9]*\([0-9\.]*\).*/\1/' > $dest/localip

# change our package sources to a source that actually has standard packages
cp $dest/debian11_sources.list /etc/apt/sources.list
apt update

# install necessary packages for launcher.py
apt install -y python3-pip
pip3 install pygame

# get rid of the window manager
apt remove gdm3
apt install -y lightdm
systemctl disable lightdm.service

# install tools
apt install -y curl git

# set github as known host
ssh-keyscan github.com > $base/.ssh/known_hosts

# create directory to put service logs in
if ! [ -d "$base/logs" ]; then
    mkdir $base/logs
    chgrp requin $base/logs
fi

if ! [ -d "$base/rqnio" ]; then
    mkdir $base/rqnio
    chgrp requin $base/rqnio
    chown requin $base/rqnio
fi

# have rqn software run on startup
if ! [ -d "/etc/systemd/system/getty@tty1.service.d" ]; then
    mkdir /etc/systemd/system/getty@tty1.service.d
fi
cp $dest/override.conf /etc/systemd/system/
systemctl enable getty@tty1.service
cp $dest/.xinitrc $base/
cp $dest/.bashrc $base/

# done with setup
echo "Done."
sleep 3

# reboot the system
/sbin/reboot

