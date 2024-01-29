#!/bin/bash

# Check if rclone is installed
if ! command -v rclone &> /dev/null
then
    echo "rclone could not be found"
    echo "Please install rclone and set it up with your Google Drive"
    exit 1
fi

# Set the working directory to the script's directory
cd "$(dirname "$0")"

# Backup Docker volume
VOLUME_NAME="tablecloth_db"
BACKUP_NAME="backup_$(date +%Y%m%d%H%M%S).tar.gz"

# Backup Docker volume
docker run --rm -v $VOLUME_NAME:/data -v $(pwd):/backup busybox tar czvf /backup/$BACKUP_NAME -C /data .

# Upload the backup to Google Drive
rclone copy $BACKUP_NAME gdrive:/tablecloth/backups

# Delete the backup from the local machine
# chmod 777 $BACKUP_NAME
# rm $BACKUP_NAME

# Keep only the last 7 backups on Google Drive
rclone delete --min-age 7d gdrive:/tablecloth/backups
rclone rmdirs gdrive:/tablecloth/backups --leave-root
