[![MEAN.JS Logo](http://meanjs.org/img/logo-small.png)](http://meanjs.org/)

This is a simple KPI Tools for AvatarDrive, powered by [MEAN.js](http://meanjs.org/) stack.

## Workflow

1. Batches run on AvatarDrive project to gather kpi data in /BACKUP/log/Avatar/yyyy-mm-dd.
2. A collector batch runs in KPI tools project to collect the kpi data, and insert them into mongoDB.
3. Users visit KPI tools web pages to view the KPI data.

## Current Enviroment

  * service currently runs batch02sk
  * use nodejs program *forever* to persists the server.js process. The Comannd is: PORT=20200 forever -w server.js
  * domain name is: kpi.bluetoother.trifort.jp
  * To develop, just fork this repsository, and commit use merge request.
  * To deploy, directly pull from this repository as root user in batch02sk.
