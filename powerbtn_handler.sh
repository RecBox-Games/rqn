#!/bin/bash


DEBOUNCE_FILE="/tmp/powerbtn_debounce"
DEBOUNCE_TIME=2
CURRENT_TIME=$(date +%s)


if [ -f "$DEBOUNCE_FILE" ]; then
    LAST_TIME=$(cat $DEBOUNCE_FILE)
    DIFF_TIME=$((CURRENT_TIME - LAST_TIME))
    if [ "$DIFF_TIME" -lt "$DEBOUNCE_TIME" ]; then
	exit 0
    fi
fi


rm $DEBOUNCE_FILE
echo $CURRENT_TIME > $DEBOUNCE_FILE

# toggle qr image overlay
sudo -u requin /home/requin/toggle_ip_qr.sh > /home/requin/logs/qr_ip.out 2>&1

