@echo off
REM Backup MySQL weather_app database to db/backup.sql
REM Update USER, PASSWORD, and DB as needed
SET USER=root
SET PASSWORD=yourpassword
SET DB=weather_app
SET BACKUP_FILE=db/backup.sql

mysqldump -u %USER% -p%PASSWORD% %DB% > %BACKUP_FILE%
echo Backup complete: %BACKUP_FILE%
