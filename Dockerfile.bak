FROM public.ecr.aws/bitnami/node:latest

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --omit=dev

# Install MySQL client library
RUN apt-get update && apt-get install -y default-libmysqlclient-dev

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "server.js" ]