#### Run the following commands in the given order

1. mongosh < scripts/init.js
2. mongoimport --db=db --collection=users --file=data/users.json
3. npm install
4. npm start
5. mongoimport --db=db --collection=words --file=data/words.json