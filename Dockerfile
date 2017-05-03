FROM node:7.9.0

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Install app dependencies
COPY package.json /app/
RUN npm install

# Bundle app source
COPY . /app

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE $PORT
CMD ["npm", "start"]

