FROM node:10-alpine

# Create app directory
RUN mkdir -p /src
WORKDIR /src

# Install app dependencies
COPY . /
RUN npm install

# Bundle app source

#CMD [ "npm", "run", "start" ]
CMD ["node", "--debug", "index.js"]