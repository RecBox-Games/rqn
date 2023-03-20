#!/bin/bash


# not part of updating, just npm install if we need to
if [[ ! -d "/home/requin/rqn/webcp/node_modules" ]]; then
    cd /home/requin/rqn/webcp
    npm install
fi

# not part of updating, just to set hostname for old boxes
if [[ "$(hostname)" != "recboxgamenite" && "$(hostname)" != "recboxbuilder" ]]; then
    sudo hostname recboxgamenite
    sudo $(echo recboxgamenite > /etc/hostname)
    sudo sed -i 's/debian/recboxgamenite/g' /etc/hosts
fi


base="/home/requin"

branch="production"

if [[ -f "$base/branch" ]]; then
    branch=$(cat $base/branch)
fi

cd $base/rqn
git fetch
git checkout $branch
git pull origin $branch

sudo cp -p $base/rqn/.xinitrc $base/
