#!/bin/bash

# not part of updating, just to set hostname for old boxes
if [[ "$(hostname)" != "recboxgamenite" && "$(hostname)" != "recboxbuilder" ]]; then
    sudo hostname recboxgamenite
    sudo echo recboxgamenite > /etc/hostname
    sudo sed -i 's/debian/recboxgamenite/g'
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

cp $base/rqn/.xinitrc $base/
