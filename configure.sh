#!/bin/bash

################################################################################
############################## STOP AND READ THIS ##############################
################################################################################
### You must not install software in this script. Any apt packages (or any   ###
### other packages just to be safe) need to be installed in install.sh which ###
### is run synchronously by loader::Connector                                ###
################################################################################

base="/home/requin"
rqn="$base/rqn"
sshdir="$base/.ssh"

echo "Checking node modules"


# backwards compatibility for /home/requin/ipc games
mkdir /dev/shm/rqnio
rm -rf /home/requin/ipc
ln -s /dev/shm/rqnio /home/requin/ipc

# npm install if we need to
if [[ ! -d "$rqn/webcp/node_modules" ]]; then
    cd $rqn/webcp
    echo "Cleaning npm cache"
    npm cache clean --force    
    echo "Installing node modules"    
    npm install
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


# power button override
if [[ ! -f /etc/acpi/events/powerbtn_override ]]; then
    echo "enabling acpid"
    sudo systemctl enable acpid
    echo "copying power button override scripts and config"
    sudo cp $rqn/logind.conf /etc/systemd/
    sudo cp $rqn/powerbtn_override /etc/acpi/events/
    sudo cp $rqn/powerbtn_handler.sh /etc/acpi/
    cp $rqn/toggle_ip_qr.sh $base/
    echo "restarting acpid"
    sudo systemctl restart acpid
    # NOTE: rebooting in configure.sh is dangerous and bad but I'm doing it anyway
    sudo reboot
fi

echo "Done configuring"
