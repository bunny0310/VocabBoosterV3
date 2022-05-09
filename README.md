## Vocab Booster
A cross platform application that allows users to keep track of their words and always be up to date on their vocabulary.

### Requirements
1. .NET Core [Installation](https://dotnet.microsoft.com/en-us/download)
3. Mongo DB Server(running on port 27017) [Installation](https://www.mongodb.com/try/download/community)
4. Mongo DB database tools (Make sure to add the install directory to your system's PATH environment variable if you are using Windows) - [Installation](https://www.mongodb.com/docs/database-tools/installation/installation-windows/#installation)
5. NPM [Installation](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

### How to build locally

1. Open a terminal window and clone the repository using the command `git clone https://github.com/bunny0310/VocabBoosterV3.git VocabBooster`.
2. Cd into the project directory and check out the **CS520** branch using the command `git checkout CS520`.
3. Make sure that your local Mongo server is running on port 27017. Cd into the `database/refactor` subdirectory of the probject and run the following commands in the given order:
  i)`mongosh < scripts/init.js`
  ii) `mongoimport --db=db --collection=users --file=data/users.json`
  iii) `npm install`
  iv) `npm start`
  v) `mongoimport --db=db --collection=words --file=data/words.json`
  
4. In a seperate terminal window, fire up the words API on the port 5001. Ensure that the port number is not being used by any other application. Cd into `dotnet/words` and run the command `dotnet run --urls=http://localhost:5001/`.
5. Similarly, in a separate terminal window, fire up the auth API on the port 5002. Cd into `dotnet/auth` and run the command `dotnet run --urls=http://localhost:5002/`.
6. Run the React project in a seperate terminal window. Cd into `ui` and do `npm install` to install all the project dependencies followed by `npm start`.

You should be able to access the project at `http://localhost:3000` in your browser. Login using the test credentials.

**Email:** hconboy@cs.umass.edu
**Password:** test123
