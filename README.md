# Tablecloth

A management system built for The Table Food Pantry at Harding University

- Inventory management
- Shopper registration
- Reports about demographics using The Table

## Building

*This image was built using a UNIX environment. Please use WSL2 if attempting to build the image on Windows*

### You will need the following files

- `.env`
- `backup.tar.gz` (or similar docker volume backup file)

### Steps

1. Clone the repo
   - `git clone https://github.com/calebstclair/tablecloth.git`
2. Install Docker (providing Debian link but any docker install will be fine)
   - <https://docs.docker.com/engine/install/debian/>
3. Copy over the necessary files to the root of the project(`tablecloth`)
   - [Cyberduck](https://cyberduck.io) is great if you are deploying to another server
4. Run: `cd tablecloth`
5. Run: `docker run --rm -v tablecloth_db:/data -v $(pwd):/backup busybox tar xzf /backup/backup.tar.gz -C /data`
6. Build the docker-compose image
   - Dev (Will auto-reload changes but is slower)
     - `docker-compose -f docker-compose.dev.yml up -d`
   - Prod (Use only with hosting server)
     - `docker-compose -f docker-compose.prod.yml up -d`
   - (If issues occur, attach `--build --no-cache` to the end the command)
7. Access at
   - Dev
     - localhost:8080
   - Prod
     - {Hostname}.local:8080

## Scripts

1. Install the needed dependencies
   - `sudo apt install rclone`
   - [Setting up rclone](https://rclone.org/docs/)
2. Give execute permissions to the script files
   - `chmod 777 startup.sh backup_volume.sh`
3. Add the following to the bottom of your crontab file (`crontab -e`)
   - `@reboot ~/tablecloth/scripts/startup.sh`
   - `0 0 */2 * * ~/tablecloth/scripts/backup_volume.sh`

## SQLWorkbench

Used for seeing and editing database entries (<https://dev.mysql.com/downloads/workbench/>)

- View the `.env` file for the credentials

## Stack

- Docker
- mySQL
- Express
- React
- Node
