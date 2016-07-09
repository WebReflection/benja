# B.E.N.J.A. Documentation
This page contains most basic information about BENJA and its usage.
Please note that every supported board might have slightly different setup,
hardware acceleration capabilities, or setup.



### How to create the B.E.N.J.A. environment
The easiest way to have a B.E.N.J.A. environment is to buy a preinstalled Micro SD card, accordingly with the hacker board you'd like to use.
The list of boards and relative ISO images or preinstalled SD cards is available via the [benja.io home page](https://benja.io/).

There are also other ways to obtain, test, and use a B.E.N.J.A. environment:

  * using an [ISO image already prepared](#how-to-burn-an-already-prepared-iso-image) for your target platform
  * installing [from the scratch](#how-to-install-benja-environment-from-the-scratch---arm) through repository scripts



#### How to burn an already prepared ISO image
You will need a Micro SD card, possibly Class 10, and with at least 8GB of space.
This procedure works on **Linux** and **MacOS**, but you can use **Windows** too as long as you have a software that can burn iso files into an SD card.

**Warning** your SD card will lose its data permanently.

Images are stored as `.zip` files so once you download one from the [benja.io home page](https://benja.io/),
using the **DOWNLOAD ISO** link under the right target board,
be sure you also extract its content somewhere on your Hard Drive.

Both **Linux** and **MacOS** have a simple way to burn images on SD cards, it's called [dd](https://en.wikipedia.org/wiki/Dd_(Unix)).

However, if you have any software capable of burning ISO images to CDs or DVDs, you might just use that to burn this image into your Micro SD card.

If not, be sure you find the right path for your card, once inserted.

```sh
$ lsblk
NAME        MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
sda           8:0    0  477G  0 disk 
├─sda1        8:1    0   60M  0 part /boot
├─sda2        8:2    0    8G  0 part [SWAP]
└─sda3        8:3    0  469G  0 part /
mmcblk0     179:0    0  7.4G  0 disk 
```

Please note the first on the list is the current Hard Drive and not the Micro SD you are looking for, which is `/dev/mmcblk0` in this case.

As alternative, you might try
```sh
$ sudo fdisk -l
Disk /dev/sda: 477 GiB, 512110190592 bytes, 1000215216 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: gpt
Disk identifier: 6C873FA6-408A-49A0-1DE3-F92AC32703C0

Device        Start        End   Sectors  Size Type
/dev/sda1      2048     124927    122880   60M EFI System
/dev/sda2    124928   16777215  16652288    8G Linux swap
/dev/sda3  16777216 1000214527 983437312  469G Linux filesystem


Disk /dev/mmcblk0: 7.4 GiB, 7948206080 bytes, 15523840 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0x00000000
```

On **MacOSX** you might need to open **Disks** software and click _(i)_, or find info, about the sd card.

Please note you are looking for a driver like `/dev/mmcblk0`, or better, something that is *NOT your Hard Drive*.

Once you've found the right path for your Micro SD card, you can write the following on a terminal:

```sh
$ sudo dd if=~/Downloads/benja-rpi2.iso of=/dev/mmcblk0 bs=8192
```

Accordingly with both your computer SD card slot and the Micro SD card speed,
it might take up to 5 minutes to burn the entire image.

Once finished, you can simply remove the card, plug into the board, and see if everything sorked as expected sinply booting it attached to a monitor, or TV, and possibly a network cable.

If after some second you'll see the following image, your B.E.N.J.A. environment is ready to rock!

![Benja OK Screen](/img/benja-ok.png)



#### How to install B.E.N.J.A. Environment from the scratch - ARM
Available for **Linux only**, this procedure is _NOT recommended_ if you're not familiar with an installation process.
However, if you'd like to help this project, making it compatible with new boards,
or you'd like to customize the installation in a convenient way for your needs,
all you need to do is to write the following in console:

```sh
$ curl -LO benja.io/os/install
$ bash install # to read how to use it

# to prepare, as example, odroid-c1 image
$ bash install odroid-c1 /dev/mmcblk0
```
Once the initial procedure is complete, the rest of the installation will continue from the board itself.

Feel free to plug the Micro SD card and boot it up using **root** as both user and password.

If you have already the board connected to an Internet connection, you can simply write `./install` and wait until it ends.

Once it reboots, you should have a fully updated B.E.N.J.A. environment installed.



#### How to install B.E.N.J.A. Environment from the scratch - i686 / x86_64
In case you'd like to install Benja OS on an i686 or x86_64 compatible hardware,
you need to start such machine via a recently burned [ArchLinux ISO](https://www.archlinux.org/download/).

Once you'll login, feel free to use `lsblk` to read where is your SD card, and write the following on console:
```sh
$ curl -LO benja.io/os/install
$ bash install # to read how to use it

# erase the SD card and install Benja OS
$ bash install /dev/mmcblk0
```
This is the very same procedure that has been used for the [Minnowboard Max](https://benja.io/#minnowboard-max) so,
in case of doubts, it's worth trying that iso out before starting a whole new process.



### How to Develop
Creating applications is as easy as writing the following from the `BENJA-APP` disk folder:
```sh
$ npm start
```
This is indeed exactly what gets executed once Benja OS starts.
If your computer works, the target board will work too!

But how about editing remotely so you don't have to keep removing and putting back the SD card?

As simple as writing:
```sh
$ ssh benja@192.168.1.17
password: benja
```

At this point you can use `nano ~/app/idnex.js` to edit that file or, if your IDE supports it, you can use [rmate](https://github.com/textmate/rmate#rmate) which is already available in Benja OS.

This gives you the ability to also test directly GPIO related operations through the board.



### How to reload the App
There are at least a couple of ways to do it: remotely and directly through the app.
The default app example uses a watcher on its main `index.js` file:

```js
// for debugging purpose, it might be handy to be able
// to reload the window simply via `touch ~/app/reload`
require('fs').watch('reload', () => app.quit());
```
Once logged in via `ssh` all you need to do is to write the following:
```sh
touch ~/app/reload
```
This will quit the app and thanks to BenjaOS configuration it will also restart it.
Alternatively you could put a simple script on the page such:
```html
<script>
// set double click handler and reload the page if triggered
document.documentElement.ondblclick = () => location.reload();
</script>
```
It could be any sort of event, or a combination of keys, a gesture, a button.
Bear in mind you could even `spawn` a `reboot` via _bash_ or shell, or even invoke a `shutdown -h now`: you have full control.



### How to reload last index.html
The preinstalled demo app uses [tiny-cdn](https://github.com/WebReflection/tiny-cdn) which might try to force caching.
If you are unable to see changes in your `index.html`, be sure you load a fresh new one each time.
```js
// index.js loads the index.html
// add the ?_ + random() bit
.loadURL('http://localhost:8080/?_=' + Math.random());
```


### How to load the app remotely
By default, BenjaOS redirects to port `8080` all calls to port `80`, making it simple to use from your browser the same `index.html`.
Write `http://192.168.1.7` on your browser, being sure the it is the one assigned to your board, and verify everything is OK.

However, if you plug the SD card into your laptop, you can simply run `npm start` on *BENJA-APP* folder and develop directly in there.
`Ctrl + Shift + I` to eventually bring up the console and debug like any other HTML page.



### How to not boot the App
If you'd like to play around with Arch Linux instead
of booting the app, you can either rename `~/app/package.json`
into `~/app/package.jsno` or `~/app/package.jsoff`,
or you could remove it or rename it differently, like `~/app/package.nope`.

This will inform Benja OS that it should just boot in the first available terminal, either on Weston or X11. 



### How to install App dependencies
If you remove the folder `~/app/node_modules`, Benja will install production dependencies automatically next time it starts.

This is handy if you have one project that might have dependencies that might conflict with those your computer architecture might encounter.

In general though, it is strongly suggested to use dependencies that are cross platform friendly,
and install those requiring builds and node-gyp as global module (also due the fact exacutables are not installed through a runtime mounted folder).



### How to include node modules
Due some limitation with current Electron paths, your application might need to include the [benja module](https://www.npmjs.com/package/benja) on top.
```js
// on top of index.js or index.html
// to have access to both local and global modules
require(process.cwd() + '/node_modules/benja').paths();
```
In alternative, you need to specify manually paths via:
```js
[].push.apply(
  require('module').globalPaths,
  [process.cwd() + '/node_modules']
  .concat(process.env.NODE_PATH.split(':').filter(p => 0 < p.length))
);
```



### How to Update Benja OS
Bening simply a specially configured Arch Linux OS,
all you need to update the system is the following:

```sh
# updates ArchLinux to the latest
sudo pacman -Syu

# update Electron and global modules to the latest
npm update -g
```


### Led and Papirus Video Demonstartion
This video shows some potential and the simplified workflow BenjaOS is capable of.
Following you can read used [Papirus instructions and demo page](https://github.com/WebReflection/benja/tree/gh-pages/examples/papirus).
<div class="video">
<iframe width="560" height="315" src="https://www.youtube.com/embed/POSrH_TWkfg" frameborder="0" allowfullscreen></iframe>
</div>



### Known Issues
In Weston based ISO images (RPi 2/3 + others) you might need to attach a mouse or a keyboard, or any other kind of input device, otherwise you won't be able to boot into BENJA-APP.
This might be fixed soon simply doing `sudo pacman -Syu` within the session, via `ssh`.

