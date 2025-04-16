FROM node:18-bookworm-slim as builder

ARG REACT_APP_NET_TYPE_ID
ARG REACT_APP_ZEPHYR_DIRECT_HOST

WORKDIR /var/www

ENV NODE_OPTIONS=--openssl-legacy-provider

RUN apt-get update && apt-get install -y --no-install-recommends git && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY package.json ./
COPY scripts/ ./scripts/

RUN git config --global url."https://".insteadOf git://

COPY client/ ./client/

RUN npm run setup

RUN npm run build:web

FROM nginx:stable-alpine

RUN apk add --upgrade apk-tools && apk --no-cache upgrade --available && apk add --no-cache nginx

COPY --from=builder /var/www/client/build /usr/share/nginx/html

RUN chmod 644 /usr/share/nginx/html/*.js && chmod 644 /usr/share/nginx/html/*.wasm

COPY .docker/nginx/default.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]