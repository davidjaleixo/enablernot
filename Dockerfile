#KBZ @ vf-OS project
#Miguel Rodrigues miguel.rodrigues@knowledgebiz.pt
# Dockerfile for a node container

#nodejs
FROM node:9

#Maintainer
LABEL description="Notification Enabler" 
LABEL maintainer="miguel.rodrigues@knowledgebiz.pt"

LABEL vf-OS=true
LABEL vf-OS.icon=img/2.png
LABEL vf-OS.urlprefixReplace=true
LABEL vf-OS.frontendUri="/notificationenabler"
LABEL vf-OS.name=notificationenabler

# notification enabler directory
RUN mkdir -p /usr/src/ne
# this lets the working directory for every COPY RUN and CMD command
WORKDIR /usr/src/ne

# get the node package file
# wildcard used to ensure both package.json and package-lock.json are copied
COPY package*.json /usr/src/ne/
COPY bower.json /usr/src/ne/
COPY .bowerrc /usr/src/ne/

# install dependencies
RUN npm install -g bower
RUN npm install
RUN bower install --allow-root

COPY . .

# expose the notification enabler port
EXPOSE 5000

CMD [ "npm", "start" ]
