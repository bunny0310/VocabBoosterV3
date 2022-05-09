# Vocab Booster
> By Erik, Ishaan, Yam

## Introduction
Vocab Booster is a cross platform application that allows the users to maintain a collection of words and phrases, along with classification data such as their synonyms, types, meaning, sentences, etc. Additionally, users have the ability to optionally tag their words with certain identifiers to allow for enhanced memorization and improved searching. Users can also analyze their collection by visualizing the content added every week and classify those visualizations by the type of the word.

## Architecture Diagram
<img width="369" alt="image" src="https://user-images.githubusercontent.com/7733516/167052497-87bc9ef7-0a47-4853-ac31-a057bcf397ad.png">

## Design Patterns & Best Code Practices

1. **Modularity** - In software engineering, modularity refers to the extent to which a software/Web application may be divided into smaller modules. Modularity is successful because developers use prewritten code, which saves resources. Overall, modularity provides greater software development manageability. We have broken down our backend system into four projects, namely `words`, `auth`, `core` and `tests`. The **core** project houses code common to both the API projects such as services, middlewares, model classes, request/response classes etc. The **words** and **auth** projects only consist of the controller classes, derive much of their business logic from the **core** project and use it as their project dependency. Similarly, the **test** project, which is reponsible for testing the service methods also uses **core** as its project dependency. 
<img width="328" alt="image" src="https://user-images.githubusercontent.com/7733516/167054708-8037a268-385e-483b-929a-578a83bc668d.png">


2.  **Singelton Design Pattern** - Singleton pattern is a software design pattern that restricts the instantiation of a class to one "single" instance. Singleton prevents other objects from instantiating their own copies of the Singleton object, ensuring that all objects access the single instance. Our project instantiates a single instance of the **ServiceFactory** class which in turn only instantiates the indivial services once in its constructor and saves them in the local memory for access by any other classes.

<img width="561" alt="image" src="https://user-images.githubusercontent.com/7733516/167054861-edd8a6c6-8288-46c5-a48e-c01714de9458.png">

<img width="646" alt="image" src="https://user-images.githubusercontent.com/7733516/167054930-08471147-d156-405b-817d-808c6ff222a7.png">

3. **Data Repository Pattern** - This pattern provides an abstraction of data, so that your application can work with a simple abstraction that has an interface approximating that of a collection. Adding, removing, updating, and selecting items from this collection is done through a series of straightforward methods, without the need to deal with database concerns like connections, commands, cursors, or readers. Using this pattern can help achieve loose coupling and can keep domain objects persistence ignorant. In our backend projects, we implement a data repository pattern to abstract out the database operations into a separate class. This allows us to mock the repository classes and test the services in isolation.

<img width="911" alt="image" src="https://user-images.githubusercontent.com/7733516/167055253-db207998-6ff1-458a-bb6e-5c5c38da8b60.png">

4. **The Mock Object Pattern** - The pattern isolates the class being tested from an entity it depends upon. In order to efficiently test the backend services, we outsourced the database related tasks to the repository classes which are accepted by the service classes as a constructor parameter. While unit testing the services, we mock the repository interfaces and supply them to the constructor while instantiating the test service objects.

<img width="798" alt="image" src="https://user-images.githubusercontent.com/7733516/167323441-ae3393f4-01d2-428f-b936-e6e69fe53770.png">

5. **Type Safety** - Each word has one or more types associated with it, such as adjective, noun, verb etc. In order to ensure type safety, we use enums to perform operations on the type property of a word, as opposed to free text(string data type). The types are stored as a list of numbers in the mongoDB collection.

<img width="320" alt="image" src="https://user-images.githubusercontent.com/7733516/167324367-ac9c40d1-0c2c-4c3d-a6c3-cdc67f596fea.png">

6. **Security (Bad Practice)** - Due to time constraints and other more important user stories, we didn't strengthen the security of our authentication system. The passwords are verbatim stored in the database without being encrypted using some hashing algorthim such as SHA256.

## Testing Plan and Experimental Evaluation
Like mentioned above, we wrote unit tests to test our backend services. These tests can be run either by running the command `dotnet test` from the `dotnet/tests` subdirectory or installing the extension **.NET Core Test Explorer** in VS Code. Additionally, our automation script runs these tests before deploying to the QA environment. We performed manual testing on the UI.

<img width="463" alt="image" src="https://user-images.githubusercontent.com/7733516/167325492-6825032b-926e-4486-8691-25ea1b4100b3.png">

## How to Run
1. **Local Build** - Follow the steps outlined in the README.md file. [Click here](https://github.com/bunny0310/VocabBoosterV3/blob/CS520/README.md) to access it.
2. **QA environment** - We wrote a Github Actions automation script that packages the two backend APIs and the UI into their individual Docker containers and deploys them to Heroku every time there's a push to the **CS520** branch in order to simulate a test environment. The QA environment uses MongoDB Atlas cloud store as the database layer. This database has already been populated with some test data. Additionally, the Dockerfiles used durin the build to QA runs the dotnet tests and halts the build in case any of the tests fail. Access the test version of the app [here](https://qa-vb-ui.herokuapp.com/) and log in using the following credentials:
  **Email** - hconboy@cs.umass.edu
  **Password** - heather123
  
## Sources (For Definitions of design patterns)
1. [Stack Overflow](http://stackoverflow.com)
2. [Dev IQ](deviq.com)
3. [PMI, Disciplined Agile](https://www.pmi.org/disciplined-agile/the-design-patterns-repository/the-mock-object-pattern)

