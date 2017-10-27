# Hacker News Backend
This is the backend for our Hacker News Clone project.

---

1. ### www.favl.dk
We have two droplets running on Digital Ocean for this project. One droplet reserved for Jenkins Build Automation tool, and the other for the Hacker News Clone (divided into the two parts; front-end & back-end). As for the minimal viable product for this assignment, we have one Docker Container running on port :8080 (representing the back-end), and one on the port :80 (representing the front-end).

2. ### Continuous Delivery Technology
We've chosen to work with the Jenkins Build Automation tool for this project. The Jenkins Server is running on www.vygg.dk:8080 (a droplet on Digital Ocean). We've created two build jobs for this project:
  1. Freestyle job for Hacker-News-Frontend
  2. Freestyle job for Hacker-News-Backend
  
Both jobs are configured to listen for new pushes to their respective repositories through a GitHub Webhook plugin. At a later point we will create a pipeline job for Jenkins, enabling it to do much more cool stuff!

3. ### How-to:
For each repository we initially started off by adding a GitHub Webhook to them:
  1. Go to your repository to add a Webhook.
  2. Choose / Click on the Repo settings.
  3. Choose Webhooks, and click on the "add webhook" button.
  4. In the "payload URL" add your URL to the Jenkins Server, like so: http://<jenkins_ip_address>:8080/github-webhook/
  5. In our case we chose application/json for payload type.
  6. Choose the "any push event" for triggering the webhook.
  7. Tick the "active" box, and click the "add" button.
  8. It is possible to test the payload has been delivered, or click redeliver to test again.
  
---
Dockerfile:
We would like to create a Docker Image at the end of each of our builds, so that we're able to automatically deploy any changes to our droplet. To build the image:
  1. Create a Dockerfile in the root of the repo (call it `Dockerfile`).
  2. Type in the necessary code, e.g., (see actual file in the repo)
    1. what working directory are you going to use?
    2. what files does it need to copy?
    3. anything else it needs to do?
    4. what port is it going to use?

Then to actually build the image, type:
`docker build -t <just_a_tag_of_app> .`

To push that image to your Docker Hub Repo (you have to a registered user):
`docker login` then type in your username and password as prompted.
`docker tag <just_a_tag_of_app> <username_on_dockerhub>/<actual_app_name>:latest` To prepare your push..
`docker push <username_on_dockerhub>/<actual_app_name>` to push to your repo.

To test everything went well, you can now do a `docker pull <username_on_dockerhub>/<actual_app_name>` and OK if it starts to download.

---
Deploy file:
We're using this deploy file to contain script instructions for Jenkins on how to deploy to our droplet (Jenkins --> "Production Server").
  1. Create a deploy file in the root of the repo (call it `deploy`).
  2. Write what you need to be done in order to deploy, e.g., 
    1. ssh in to the production server, and pull the latest changes from the github repo.
    2. build the docker image
    3. upload that image to dockerhub, and then
    4. use that image to restart the current container.

---
To create the build jobs:
  1. Click "new item"
  2. Write a name for the build job and choose a job type (we chose a freestyle job for both our builds).
  3. Add your source code management (link to GitHub Repo), and add your jenkins credentials (not relevant at this time, but will be later).
  4. Specify what branch you wish your SCM to build - in our case just the \*/master branch.
  5. As previously mentioned, we have setup a GitHub Webhook, so we need to set the build trigger to connect to this.
  6. Set up the build to execute a shell script, and enter:
    1. `npm install` and on the next line
    2. `./deploy`
    This will tell Jenkins to look to our deploy script for instructions regarding the deployment (only upon successful build ofcourse).
  7. Add a Build Environment variable to use for logging in to docker during the script execution.
  8. Hit the "apply" and "save", and your build job is ready.

---
To run project with nodemon:
  in your terminal type "npm run devstart"

---
Neo4J Database resides at: http://favl.dk:8474/
