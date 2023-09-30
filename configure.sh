#!/bin/bash

base="/home/requin"
rqn="$base/rqn"

# npm install if we need to
if [[ ! -d "$rqn/webcp/node_modules" ]]; then
    cd /home/requin/rqn/webcp
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
    sudo apt install -y openssh-server sshpass
    if [[ ! -d /home/requin/.ssh ]]; then
        mkdir /home/requin/.ssh
    fi
    if [[ ! -f /home/requin/.ssh/known_hosts ]]; then
        touch /home/requin/.ssh/known_hosts
    elif [[ ! -f /home/requin/.ssh/known_hosts.backup ]]; then
        cp /home/requin/.ssh/known_hosts /home/requin/.ssh/known_hosts.backup
    fi
    echo "old known_hosts:  $(cat /home/requin/.ssh/known_hosts)"
    cp /home/requin/.ssh/known_hosts /home/requin/rqn/known_hosts 
    echo "new known_hosts:  $(cat /home/requin/.ssh/known_hosts)"
    sudo systemctl stop ssh
    sudo systemctl mask ssh
fi
