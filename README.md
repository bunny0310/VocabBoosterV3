## Vocab Booster
A cross platform application that allows users to keep track of their words and always be up to date on their vocabulary.

### Requirements
1. .NET Core
2. dotnet CLI
3. Mongo DB (running on port 27017)
4. NPM

### How to build locally

1. Open a terminal window and clone the repository using the command `git clone https://github.com/bunny0310/VocabBoosterV3.git VocabBooster`.
2. Cd into the project directory and check out the **CS520** branch using the command `git checkout CS520`.
3. Make sure that your local Mongo server is running on port 27017. Cd into the `database/scripts` subdirectory of the probject and run the **setup.sh** script to initialize the database. Use the command `sh setup.sh`.
4. In a seperate terminal window, fire up the words API on the port 5002. Ensure that the port number is not being used 
