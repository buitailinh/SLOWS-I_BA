FROM node:16-alpine
RUN mkdir -p /home/blueonion
WORKDIR /home/user_managerment
COPY ./ /home/user_managerment

RUN npm cache clean --force \
  && npm install \
  && npm run build

CMD [ "npm","run","start:prod" ]
EXPOSE 8888
