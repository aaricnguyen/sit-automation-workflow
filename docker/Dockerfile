FROM node:12-alpine as build-stage

WORKDIR /usr/src/app
COPY ./ ./
RUN yarn

RUN yarn build

FROM nginx
USER root
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html
EXPOSE 80
ENTRYPOINT ["nginx","-g","daemon off;"]
