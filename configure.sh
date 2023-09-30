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
    sudo systemctl stop ssh
    sudo systemctl mask ssh
    if [[ ! -d /home/requin/.ssh ]]; then
        mkdir /home/requin/.ssh
    fi
    if [[ ! -f /home/requin/.ssh/known_hosts ]]; then
        touch /home/requin/.ssh/known_hosts
    fi
    sudo echo '|1|qcYjThFg/Ej5MN8EAWLzByghg2o=|MIXMCsm7f9rr3rsDq7TO3BcVKPw= ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBPz9nu96BJqx2+07ydanIaxjGzZalb1qHjcMumZD5qSAPcqEaznx9NeBRRVVyqyhxu8+5h7lbE7n6MKGt3ywZ9Y=' >> /home/requin/.ssh/known_hosts
fi
