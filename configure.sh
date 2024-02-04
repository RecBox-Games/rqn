#!/bin/bash

base="/home/requin"
rqn="$base/rqn"
sshdir="$base/.ssh"
alsa_base_file="/etc/modprobe.d/alsa-base.conf"
alsa_options_dmic="options snd-hda-intel dmic_detect=0"

# set audio if necessary
if [[ ! -f "$alsa_base_file" ]]; then
    # File does not exist, create it and add the line
    sudo bash -c "echo '$alsa_options_dmic' > '$alsa_base_file'"
    echo "File did not exist - created and added the line."
    /sbin/reboot
elif ! grep -qFx -- "$alsa_options_dmic" "$alsa_base_file"; then
    # File exists but does not contain the line, add the line
    sudo bash -c "echo '$alsa_options_dmic' >> '$alsa_base_file'"
    echo "File existed but line was not found - added the line."
    /sbin/reboot
fi

# npm install if we need to
if [[ ! -d "$rqn/webcp/node_modules" ]]; then
    cd $rqn/webcp
    npm install
fi

# set hostname for old boxes
if [[ ! -f "$base/no_hostname" && "$(hostname)" != "recboxgamenite" && "$(hostname)" != "recboxbuilder" ]]; then
    sudo hostname recboxgamenite
    echo recboxgamenite | sudo tee /etc/hostname
    sudo sed -i 's/debian/recboxgamenite/g' /etc/hosts
fi

# configure ssh daemon if it isn't configured already
if ! command -v sshpass >/dev/null; then
    echo "installing ssh things"
    sudo apt install -y openssh-server sshpass
fi

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

# install apt-pacakges required for commands
QRENCODE="qrencode"

# Check if the package is installed
dpkg -l | grep -qw $QRENCODE

# Check the exit status of the previous command
# If the package is not installed, the exit status will be non-zero
if [ $? -ne 0 ]; then
    echo "Package $PACKAGE_NAME is not installed. Installing now."
    sudo apt-get update
    sudo apt-get install -y $QRENCODE
else
    echo "Package $PACKAGE_NAME is already installed."
fi
