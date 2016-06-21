#!/bin/bash
# Usage ./sunxi-media-create.sh /dev/sdx hwpack rootfs

# modified version of
# https://github.com/linux-sunxi/sunxi-bsp/blob/master/scripts/sunxi-media-create.sh

hwpack_update_only=0

BOOT_SIZE=64
ROOT_SIZE=6000

TEMP="${TMPDIR:-/tmp}/.sunxi-media-create.$$"
HWPACKDIR="$TEMP/hwpack"
ROOTFSDIR="$TEMP/rootfs"
MNTBOOT="$TEMP/mnt_boot"
MNTROOT="$TEMP/mnt_root"

cleanup() {
	local x=
	# umount card
	for x in $MNTBOOT $MNTROOT; do
		x=$(readlink -f "$x")
		if grep -q " $x " /proc/mounts; then
			umount "$x" || exit 1
		fi
	done

	# and delete temporal files
	rm -rf --one-file-system "$TEMP"
}

die() {
	echo "$*" >&2
	cleanup
	exit 1
}

title() {
	echo
	echo "==="
	echo "=== $* ==="
	echo "==="
}

checkSyntax () {
	if [ $# -lt 3 ]; then
		echo "Usage: $0 [device] [hwpack] [rootfs]"
                echo "Write norootfs for [rootfs] if you want to only update" 
                echo "u-boot, script.bin, the kernel and modules"
		exit 1
	fi

	[ -b "$1" ] || die "$1: Invalid device"
	[ -s "$2" ] || die "$2: Hardware pack not found"

        if [ "$3" = norootfs ]; then
		hwpack_update_only=1;
	elif [ ! -s "$3" ]; then
		die "$3: rootfs file not found"
        fi
}

umountSD () {
	local partlist=$(grep "^$1" /proc/mounts | cut -d' ' -f1)
	[ -z "$partlist" ] || umount $partlist
}

partitionSD () {
	local dev="$1" subdevice=
	local x=
  local ext4=
	case "$dev" in
	*/mmcblk*|*/loop*)
		subdevice="${1}p"
		;;
	*)
		subdevice="$1"
		;;
	esac

	title "Partitioning $dev"
	dd if=/dev/zero of="$dev" bs=1M count=1 ||
		die "$dev: failed to zero the first MB"

	x=$(expr $BOOT_SIZE \* 2048)
	ext4=$(expr $ROOT_SIZE \* 2048)

	sfdisk --in-order -L -uS "$dev" <<-EOT
	2048,$x,c
	,$ext4,L
	,,c
	EOT

	[ $? -eq 0 ] ||
		die "$dev: failed to repartition media"

	sleep 1
	sfdisk -L -R "$dev" ||
		die "$dev: failed to reload media"

	title "Format Partition 1 to VFAT"
	mkfs.vfat -I ${subdevice}1 ||
		die "${subdevice}1: failed to format partition"

	title "Format Partition 2 to EXT4"
	mkfs.ext4  ${subdevice}2 ||
		die "${subdevice}2: failed to format partition"
}

extract() {
	local f=$(readlink -f "$1")
	title "Extracting $3"

	mkdir -p "$2"
	cd "$2"
	case "$f" in
	*.tar.bz2|*.tbz2)
		tar xjpf "$f"
		;;
	*.tar.gz|*.tgz)
		tar xzpf "$f"
		;;
	*.7z|*.lzma)
		7z x "$f"
		;;
	*.tar.xz)
		tar xJpf "$f"
		;;
	*)
		die "$f: unknown file extension"
		;;
	esac
	cd - > /dev/null
}

copyUbootSpl ()
{
	dd if=$2 bs=1024 of=$1 seek=8
}

copyUboot ()
{
	dd if=$2 bs=1024 of=$1 seek=40
}

mountPartitions ()
{
	local dev="$1" subdevice=
	case "$dev" in
	*/mmcblk*|*/loop*)
		subdevice="${1}p"
		;;
	*)
		subdevice="$1"
		;;
	esac

	mkdir -p "$MNTROOT" "$MNTBOOT" ||
		die "Failed to create SD card mount points"

	mount ${subdevice}1 "$MNTBOOT" ||
		die "Failed to mount VFAT partition (SD)"

	mount ${subdevice}2 "$MNTROOT" ||
		die "Failed to mount EXT4 partition (SD)"
}

copyData ()
{
	local d= x=
	local rootfs_copied=

	echo "Copy VFAT partition files to SD Card"
	cp $HWPACKDIR/kernel/uImage $MNTBOOT ||
		die "Failed to copy VFAT partition data to SD Card"
	cp $HWPACKDIR/kernel/*.bin $MNTBOOT/script.bin ||
		die "Failed to copy VFAT partition data to SD Card"
	if [ -s $HWPACKDIR/kernel/*.scr ]; then
		cp $HWPACKDIR/kernel/*.scr $MNTBOOT/boot.scr ||
			die "Failed to copy VFAT partition data to SD Card"
	fi

        if [ ${hwpack_update_only} -eq 0 ]; then
		title "Copy rootfs partition files to SD Card"
		for x in '' \
			'binary/boot/filesystem.dir' 'binary'; do

			d="$ROOTFSDIR${x:+/$x}"

			if [ -d "$d/sbin" ]; then
				rootfs_copied=1
				cp -a "$d"/* "$MNTROOT" ||
					die "Failed to copy rootfs partition data to SD Card"
				break
			fi
		done

		[ -n "$rootfs_copied" ] || die "Unsupported rootfs"
        fi

	title "Copy hwpack rootfs files"
	# Fedora uses a softlink for lib.  Adjust, if needed.
	if [ -L $MNTROOT/lib ]; then
		# Find where it points.  For Fedora, we expect usr/lib.
		DEST=`/bin/ls -l $MNTROOT/lib | sed -e 's,.* ,,'`
		if [ "$DEST" = "usr/lib" ]; then
			d="$HWPACKDIR/rootfs"
			if [ -d "$d/lib" ]; then
				mkdir -p "$d/usr/lib/"
				mv "$d/lib"/* "$d/usr/lib/"
				rmdir "$d/lib"
			fi
		fi
	fi
        cp -a $HWPACKDIR/rootfs/* $MNTROOT/ ||
		die "Failed to copy rootfs hwpack files to SD Card"
}

# "main"
checkSyntax $1 $2 $3
umountSD $1
if [ ${hwpack_update_only} -eq 0 ]; then
    partitionSD $1 
fi

extract $2 $HWPACKDIR/ "HW Pack"
if [ ${hwpack_update_only} -eq 0 ]; then
    extract $3 $ROOTFSDIR/ "RootFS"
fi

title "Copy U-Boot/SPL to SD Card"
copyUbootSpl $1 $HWPACKDIR/bootloader/sunxi-spl.bin
copyUboot $1 $HWPACKDIR/bootloader/u-boot.img
mountPartitions $1
copyData
cleanup

echo "Done."