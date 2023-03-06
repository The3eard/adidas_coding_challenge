# Adidas Coding Challenge, March 2023

## Approach

- I used node 18 LTS current version
- The development environment has been Arch Linux for all tests with node, docker and kubernetes and VS Code as editor.
- The endpoint tests and their documentation have been carried out with Postman (collection is attached in the root of the project).
- As you can expect, I have developed three independent services.
- Connections are protected user-facing and between microservices
- To simplify the application, the HTTPS protocol has not been used, although mTLS should ideally be used for connections.
- I have used nodemon and concurrently dependencies to run the application easily, as well as jsonserver as a persistent database.
- I use nodemon and concurrently to run it
- You have a CI/CD diagram is attached in the root of the project.
- Due to lack of time, I have not done unit tests.

---

## Run application

- ### Locally with node.js
  - Yon need nodejs and npm to run the application.
  - I use nodemon and concurrently to run it
  - Run `npm run custom_install` to install all the dependencies.
  - Run `npm start` to run all microservices.
  - You can run `npm install` and `npm start` on each microservice to run them independently.
- ### On Docker
  - You need Docker to run the application.
  - Inside the three microservices folders you have a `docker_readme.md` file with the instructions to build and run the image on Docker.
- ### On a Kubernetes cluster
  - You need kubectl, k8s or similar to run the application.
  - Run `kubectl create -f .\kube.yaml` on the root of the project to build and deploy the cluster with the three services.

---

### Challenge developed by Adolfo Fuentes in March 2023
