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

# npm install if we need to
if [[ ! -d "$rqn/webcp/node_modules" ]]; then
    echo "Installing node modules"
    cd $rqn/webcp
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

echo "Done configuring"
