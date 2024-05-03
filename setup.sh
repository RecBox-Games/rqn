#!/bin/bash

set -e

base="/home/requin"
dest="$base/rqn"
script=$(readlink -f "$0")
# Absolute path this script is in
abs_path=$(dirname "$script")

# .id data
read -p "Enter the number of the box this is in the alpha batch (e.g. 01):" box_number
read -p "Enter the hardware number of the box (e.g. 00456):" hardware_number
read -p "Enter the Pokemon (pokemon.com/us/pokedex should match hardware number):" pokemon
echo -e "$box_number\n" > $base/.id
echo -e "$hardware_number\n" >> $base/.id
echo -e "$pokemon\n" >> $base/.id

# lost permissions
chmod +x $dest/cp_server
chmod +x $dest/configure.sh
chmod +x $dest/ota.sh
chmod +x $dest/rqn-start.sh

# add requin to sudoers no password
echo "requin ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# save local ip address into a file
ip addr | grep 192.168 | sed 's/^[^0-9]*\([0-9\.]*\).*/\1/' > $dest/localip

# change our package sources to a source that actually has standard packages
cp $dest/debian11_sources.list /etc/apt/sources.list
apt update

#install node and web server packages
apt install -y nodejs
apt install -y npm
cd $dest/webcp
npm install express
npm install net
npm install socketio
npm install socket.io

# install necessary python packages
apt install -y python3-pip
pip3 install pynput
pip3 install python-uinput
pip3 install cffi

# get rid of the window manager
apt remove -y gdm3
apt install -y lightdm
systemctl disable lightdm.service

# install tools
apt install -y curl git
apt install -y qrencode 
apt install -y xdotool
apt install -y tmux

# set permissions on /dev/uinput
chmod 666 /dev/uinput

# set github as known host
ssh-keyscan github.com > $base/.ssh/known_hosts

# create directory to put service logs in
if ! [ -d "$base/logs" ]; then
    mkdir $base/logs
    chgrp requin $base/logs
    chown requin $base/logs
fi

if ! [ -d "$base/rqnio" ]; then
    mkdir $base/rqnio
    chgrp requin $base/rqnio
    chown requin $base/rqnio
fi

# make audio work
echo 'options snd-hda-intel dmic_detect=0' > /etc/modprobe.d/alsa-base.conf

# have rqn software run on startup
apt install -y mingetty
if ! [ -d "/etc/systemd/system/getty@tty1.service.d" ]; then
    mkdir /etc/systemd/system/getty@tty1.service.d
fi
cp $dest/override.conf /etc/systemd/system/getty@tty1.service.d/
systemctl enable getty@tty1.service
cp $dest/.xinitrc $base/
cp $dest/.bashrc $base/
# setup boot splash screen

source  $abs_path/splash_setup.sh

# done with setup
echo "Done."
sleep 3

# reboot the system
/sbin/reboot

