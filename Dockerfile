FROM node:16

WORKDIR /opt/app
COPY . .
RUN npm install
EXPOSE 8091
CMD node server.js