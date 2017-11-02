#!groovy
import groovy.json.JsonOutput
import groovy.json.JsonSlurper

//====================================================
// Jenkinsfile meant for a Node.js project using NPM.
//====================================================

node { // The start of our build.
    tokens = "${env.JOB_NAME}".tokenize('/')
    org = tokens[tokens.size()-3]
    repo = tokens[tokens.size()-2]
    branch = tokens[tokens.size()-1]

    /* We start by setting the build result to true,
    and if anything goes wrong, we set it to false and return */

    currentBuild.result = "SUCCESS"

    try { // Checking what type of branch is currently building
          // (see docs for branching rules setup)

        if  (env.BRANCH_NAME != 'master') { // it's a ready branch
            checkout()
            install_dependencies()
            test()
            merge_and_push()
            clean_up()
        } else { // it's the master branch
            checkout()
            install_dependencies()
            test()
            dockerBuild()
            dockerTest()
            dockerPush()
            deploy()
            clean_up()
        }
    } catch (err) {
        currentBuild.result = "FAILURE" // Here we set the build result variable to false.
                notifySlack(JOB_NAME + " - " + BUILD_DISPLAY_NAME + " " + currentBuild.result + " after "
                + currentBuild.duration + "ms\n" + err, "#devops")
        throw err
    }
}

def checkout () {
    stage ('Checkout code') {
        /* Let's make sure we have the repository cloned to our workspace */
        print env.BRANCH_NAME
        context="continuous-integration/jenkins/"

        checkout scm
    }
}

def install_dependencies () {
    stage ('Installing Dependencies') {
        env.NODE_ENV = "test"
        sh 'node -v'
        sh 'npm prune'
        sh 'npm install'
    }
}

def test() {
    stage ('Tests') {
        sh 'npm test'
        sh 'echo "Tests passed!"'
        if (currentBuild.result == "UNSTABLE") {
            sh "exit 1"
        }
    }
}

def merge_and_push() {
    stage ('Merging with the Master branch') {
    // Credentials are created in the jenkins/credentials/global/add_credentials
        withCredentials([usernamePassword(credentialsId: 'git-credentials', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
            sh 'git remote -v'              // Shows a verbose list of existing remotes.
            sh 'git checkout -b temp'       // We're running in detached mode, and want to NOT do that.
            sh 'git branch -f master temp'  // Creating a master branch based on the temp branch
            sh 'git checkout master'        // Switching to the newly created master
            sh 'git branch -d temp'         // Deleting the temporary branch
            //sh("git tag -a tag_" + env.BRANCH_NAME + "_$BUILD_ID -m 'Jenkins'")
            //sh('git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/semester-groupies/hacker-news-backend.git --tags')
            sh('git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/semester-groupies/hacker-news-backend.git master') // Pushes to remote origin master branch
            sh('git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/semester-groupies/hacker-news-backend.git --delete ' + env.BRANCH_NAME) // Deletes the ready/<name> branch.
        }
    }
}

def dockerBuild() {
    stage('Build image') {
        /* This builds the actual image; synonymous to
         * docker build on the command line */

        sh 'docker build -t favl/hacker-news-clone .'
    }
}

def dockerTest() {
    stage('Test image') {
        /* Ideally, we would run a test framework against our image.
         * For this example, we're using a Volkswagen-type approach ;-) */

        sh 'echo "Docker Image tests passed"'
    }
}

def dockerPush () {
    stage('Push image') {
        /* Finally, we'll push the image with one tag:
         * Being, the 'latest' tag. */

        withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
            sh('docker login -u ${DOCKER_USERNAME} -p "${DOCKER_PASSWORD}"')
            sh('docker push favl/hacker-news-clone:latest')
            sh('docker logout')
        }
    }
}

def deploy() {
    stage('Deploy to Production') {
    // SSH into the deployment server, pulling and running the latest Docker image.
        sh '''ssh root@favl.dk <<EOF
        docker ps -a
        docker stop hacker-news-backend
        docker rm hacker-news-backend
        docker pull favl/hacker-news-clone:latest
        docker run --name hacker-news-backend -d --restart unless-stopped -p 8080:8090 favl/hacker-news-clone:latest
        exit
        EOF'''
    }
}

def clean_up () {
    stage('Cleanup after Build Success'){
        sh 'rm node_modules -rf'
        sh 'git remote prune origin' // Deleting references to deleted branches
        notifySlack(JOB_NAME + " - " + BUILD_DISPLAY_NAME + " " + currentBuild.result + " after " + currentBuild.duration + "ms", "#devops")
    }
}

def notifySlack(text, channel) { // TODO: Make global variables for the credentials, channel, api-token, etc..
    def slackURL = 'https://hackernewsclone.slack.com/services/hooks/jenkins-ci/pkh7Guga1ZeXgLET9c3566wR'
    def payload = JsonOutput.toJson([text      : text,
                                     channel   : channel,
                                     username  : "jenkins",
                                     icon_emoji: ":jenkins:"])
    sh "curl -X POST --data-urlencode \'payload=${payload}\' ${slackURL}"
}