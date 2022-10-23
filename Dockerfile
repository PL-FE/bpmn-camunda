FROM node:14
COPY ./ /app
WORKDIR /app
RUN yarn install && yarn build

FROM nginx
RUN mkdir /app
COPY --from=0 /app/dist /app
COPY default.conf /etc/nginx/nginx.conf