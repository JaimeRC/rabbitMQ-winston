FROM node:10-alpine
EXPOSE 8080

# Create app directory
RUN mkdir -p /src
WORKDIR /src

# Install app dependencies
COPY . .
RUN npm install

CMD [ "npm", "run", "start" ]
#CMD [ "npm", "run", "debug" ]