FROM node:10-alpine

# Create app directory
RUN mkdir -p /src
WORKDIR /src

# Install app dependencies
COPY . .
RUN npm install

CMD [ "npm", "run", "start" ]
#CMD [ "npm", "run", "debug" ]
#CMD ["node", "--debug", "index.js"]