#!/bin/bash
echo reverse tunnel

GCP_VM='35.225.197.68'

## off ##
if [[ "$1" == "off" ]]; then
    # stop the ssh daemon
    sudo systemctl stop ssh
    sudo systemctl mask ssh
    # kill running tunnels
    pids="$(ps aux | grep sshpass | grep -v grep | sed 's/^[^ ]\+[ ]\+\([0-9]\+\).*/\1/')"
    for pid in $pids; do
        kill -9 $pid
    done
    exit    
elif [[ "$1" != "on" ]]; then
    echo "Must pass 'on' or 'off' to $0" >&2
    exit
fi

## on ##
if [[ ! $2 =~ ^[0-9]{3}$ ]]; then
    echo "'reverse-tunnel.sh on' needs a 3 digit port argument" >&2
    exit
fi

# start the ssh daemon
sudo systemctl unmask ssh
sudo systemctl start ssh

# launch reverse tunnel to fixed IP (with sandboxed user).
sshpass -p gamenite ssh -N -T -R 50$2:localhost:22 restricteduser@$GCP_VM &

