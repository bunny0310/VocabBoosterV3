#!/bin/sh
mongo < scripts/init.js
mongoimport --db=db --collection=words --file=scripts/words.json
mongoimport --db=db --collection=users --file=scripts/users.json