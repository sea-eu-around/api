FROM node:dubnium AS dist
COPY package.json yarn.lock ./

RUN yarn install

COPY . ./

RUN yarn build

FROM node:dubnium AS node_modules
COPY package.json yarn.lock ./

RUN yarn install --prod

FROM node:dubnium

ARG PORT=$PORT

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY --from=dist dist /usr/src/app/dist
COPY --from=node_modules node_modules /usr/src/app/node_modules
COPY --from=dist scripts /usr/src/app/scripts


COPY . /usr/src/app

EXPOSE $PORT

CMD yarn start:$NODE_ENV
