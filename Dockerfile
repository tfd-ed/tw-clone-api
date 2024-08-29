FROM --platform=linux/amd64 node:18.20.3-slim
WORKDIR /app
ENV NODE_ENV dev
COPY package.json yarn.lock ./
RUN npm install -g nodemon
RUN yarn install
COPY . .
RUN (cd frontend && npm install && echo "VUE_APP_ENV_SERVER=" >> .env && npm run build)

EXPOSE 4000
CMD [ "yarn", "dev"]