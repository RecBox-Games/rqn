#!/bin/bash

base="/home/requin"
rqn="$base/rqn"
sshdir="$base/.ssh"

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
