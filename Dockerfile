FROM node:14
RUN yarn install && yarn build

FROM nginx

EXPOSE 80

RUN rm /etc/nginx/conf.d/default.conf
ADD default.conf /etc/nginx/conf.d/
COPY dist/ /usr/share/nginx/html/