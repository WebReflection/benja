# Raspberry Pi Papirus

In order to use Papirus you need to remotely log into your RPi and write the following:

```bash
# install dependencies
sudo pacman -Syu --needed --noconfirm python-imaging fuse bc git i2c-tools ttf-freefont ntp

# make python2 the default python executable
sudo ln -s /usr/bin/python2 /usr/bin/python

# use the Papirus installer, ignore apt-get warnings
curl -sSL https://goo.gl/i1Imel | sudo bash

# setup papirus
sudo papirus-setup

# enable SPI on boot
sudo sh -c 'echo "device_tree_param=spi=on" >> /boot/config.txt'

# retrieve current time on boot via network
sudo systemctl enable ntpd.service
```

After a **reboot** you can test that everything is OK by writing this on console:
```bash
sudo papirus-clock
```

In order to set a different display, don't forget to:
```bash
sudo papirus-set [1.44 | 1.9 | 2.0 | 2.6 | 2.7 ]
```

If something goes wrong, please refer to the [official repository](https://github.com/PiSupply/PaPiRus).

### How to test pixel-clock example
The [./index.html](./index.html) file can be used as replacement for the `~/app/index.html` default file you'll find in Benja OS.

The only extra setup you need to be aware of, is your current timezone.

```bash
# show all available time zones
timedatectl list-timezones

# setup current one
sudo timedatectl set-timezone Europe/London
```
This will ensure you'll have a proper timezone setup.