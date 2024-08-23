#!/bin/bash

## dependencies
# if ! dpkg -l pqiv 2>/dev/null | grep . -q; then
#     sudo apt install pqiv
# fi
# if ! dpkg -l xdotool 2>/dev/null | grep . -q; then
#     sudo apt install xdotool
# fi
# if ! dpkg -l wmctrl 2>/dev/null | grep . -q; then
#     sudo apt install wmctrl
# fi

export DISPLAY=:0

## kill current QR overlay if it already exists
if pgrep -f pqiv_qr >/dev/null; then
    pkill -f pqiv_qr
    exit
fi

## make the QR image from local IP
ip addr | grep 'inet ' | grep -vw lo | tail -1 | sed 's/.*inet \([^ \/]*\).*/http:\/\/\1:3000/' | \
    qrencode  -s 10  -m 1  --foreground=000000AA --background=FFFFFFBB  -o /home/requin/qr.png


## display it with an overlay
pqiv -c -i -T pqiv_qr /home/requin/qr.png &
# -c means tranparent background / no borders
# -i means do not display info text
# -T sets the title for the image


#######

#sleep 1

## make it stay on top of other windows
#wmctrl -i -r $winID -b add,above

