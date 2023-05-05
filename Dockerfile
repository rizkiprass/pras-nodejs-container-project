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

# Bundle app source
COPY . .

# Install mysql module
RUN npm install mysql

# Set environment variables for database connection
ENV DB_HOST pras-ecs-rds.cztg5toglj5t.us-west-2.rds.amazonaws.com
ENV DB_USER admin
ENV DB_PASSWORD FruFpmUGhxpXCHmBFjq3
ENV DB_NAME pras-ecs-rds

EXPOSE 8080
CMD [ "node", "server.js" ]
