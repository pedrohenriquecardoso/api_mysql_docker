# Introduction 📜

This is an API for study purposes, we're using Node.js with MySql as the database and docker to generate our containers and images. We're also using frameworks like Joi to validate data sets and a logger to get relevant information about our requests.

## Installation ☕️

1. Clone the repository.

    ```sh
    git clone https://github.com/pedrohenriquecardoso/api_mysql_docker.git
    ```
2. Navigate to the project directory.

    ```sh
    cd api_mysql_docker
    ```
    
3. Use npm install to install all necessary frameworks and libraries.

    ```sh
    npm i
    ```
4. Run the application.

    ```sh
    npm run dev
    ```

5. Now we need to build our Docker container.


### Building and running Docker application

When you're ready, start your application by running:

    docker compose up --build

Your application will be available at http://localhost:3000.

### References

* [Docker's Node.js guide](https://docs.docker.com/language/nodejs/)