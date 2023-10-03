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
    if [[ ! -d $sshdir ]]; then
        mkdir $sshdir
    fi
    if [[ ! -f $sshdir/known_hosts ]]; then
        touch $sshdir/known_hosts
    elif [[ ! -f $sshdir/known_hosts.backup ]]; then
        cp $sshdir/known_hosts $sshdir/known_hosts.backup
    fi
    echo "old known_hosts:  $(cat $sshdir/known_hosts)"
    cp sshdir/known_hosts $rqn/known_hosts 
    echo "new known_hosts:  $(cat $sshdir/known_hosts)"
    sudo systemctl stop ssh
    sudo systemctl mask ssh
elif [[ -z "$(cat $sshdir/known_hosts | grep Z9Y)" ]]; then 
    # double tap on known_hosts cus this shit is acting whack
    echo "case 2 for copying known hosts"
    cp sshdir/known_hosts $rqn/known_hosts 
fi
