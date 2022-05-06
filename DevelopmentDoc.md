# Vocab Booster
> By Erik, Ishaan, Yam

## Introduction
Vocab Booster is a cross platform application that allows the users to maintain a collection of words and phrases, along with classification data such as their synonyms, types, meaning, sentences, etc. Additionally, users have the ability to optionally tag their words with certain identifiers to allow for enhanced memorization and improved searching. Users can also analyze their collection by visualizing the content added every week and classify those visualizations by the type of the word.

## Architecture Diagram
<img width="369" alt="image" src="https://user-images.githubusercontent.com/7733516/167052497-87bc9ef7-0a47-4853-ac31-a057bcf397ad.png">

## Design Patterns

1. **Modularity** - In software engineering, modularity refers to the extent to which a software/Web application may be divided into smaller modules. Modularity is successful because developers use prewritten code, which saves resources. Overall, modularity provides greater software development manageability. We have broken down our backend system into four projects, namely `words`, `auth`, `core` and `tests`. The **core** project houses code common to both the API projects such as services, middlewares, model classes, request/response classes etc. The **words** and **auth** projects only consist of the controller classes, derive much of their business logic from the **core** project and use it as their project dependency. Similarly, the **test** project, which is reponsible for testing the service methods also uses **core** as its project dependency. 
<img width="328" alt="image" src="https://user-images.githubusercontent.com/7733516/167054708-8037a268-385e-483b-929a-578a83bc668d.png">


2.  **Singelton Design Pattern** - Singleton pattern is a software design pattern that restricts the instantiation of a class to one "single" instance. Singleton prevents other objects from instantiating their own copies of the Singleton object, ensuring that all objects access the single instance. Our project instantiates a single instance of the **ServiceFactory** class which in turn only instantiates the indivial services once in its constructor and saves them in the local memory for access by any other classes.

<img width="561" alt="image" src="https://user-images.githubusercontent.com/7733516/167054861-edd8a6c6-8288-46c5-a48e-c01714de9458.png">

<img width="646" alt="image" src="https://user-images.githubusercontent.com/7733516/167054930-08471147-d156-405b-817d-808c6ff222a7.png">

3. **Data Repository Pattern** - This pattern provides an abstraction of data, so that your application can work with a simple abstraction that has an interface approximating that of a collection. Adding, removing, updating, and selecting items from this collection is done through a series of straightforward methods, without the need to deal with database concerns like connections, commands, cursors, or readers. Using this pattern can help achieve loose coupling and can keep domain objects persistence ignorant. In our backend projects, we implement a data repository pattern to abstract out the database operations into a separate class. This allows us to mock the repository classes and test the services in isolation.

<img width="911" alt="image" src="https://user-images.githubusercontent.com/7733516/167055253-db207998-6ff1-458a-bb6e-5c5c38da8b60.png">


## Sources (For Definitions of design patterns)
1. [Stack Overflow](http://stackoverflow.com)
2. [Dev IQ](deviq.com)

