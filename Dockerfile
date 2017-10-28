# Building image from:
FROM node:boron

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json .
# For npm@5 or later, copy package-lock.json as well
# COPY package.json package-lock.json ./

RUN npm install

# Bundle app source
COPY . .

# Your app binds to port 8080 so you'll use the EXPOSE instruction to have it mapped by the docker daemon:
EXPOSE 8090

CMD [ "npm", "start" ]
