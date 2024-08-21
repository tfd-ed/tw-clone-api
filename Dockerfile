FROM node:18.20.3-slim
WORKDIR /app
ENV NODE_ENV dev
COPY package.json yarn.lock ./
RUN npm install -g nodemon
RUN yarn install
COPY . .

EXPOSE 4000
CMD [ "yarn", "dev"]