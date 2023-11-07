# Must be ran as root

echo "installing plymouth ..."
sudo apt-get install -y plymouth plymouth-themes

cp $abs_path/grub /etc/default/grub
tar -xf $abs_path/GameNiteSplash.tar -C $abs_path
rm -rf /usr/share/plymouth/themes/gamenite
mv $abs_path/GameNiteSplash /usr/share/plymouth/themes/gamenite
sudo plymouth-set-default-theme gamenite
rm -rf $abs_path/grub-shusher
git clone https://github.com/ccontavalli/grub-shusher.git $abs_path/grub-shusher
cd $abs_path/grub-shusher
make 
echo "copying grubx54.efi to /home/requin ..."
cp /boot/efi/EFI/debian/grubx64.efi /home/requin/grubx64.old
echo "running grub-kernel with grubx64.efi ..."
./grub-kernel /boot/efi/EFI/debian/grubx64.efi
cd ..
echo "updating grub ..."
sudo update-grub2
rm -rf grub-shusher
