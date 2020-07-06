#!/bin/bash

./startFabric.sh
cd javascript
npm install
node enrollAdmin.js
node registerUser.js
node server.js
