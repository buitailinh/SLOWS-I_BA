FROM node:16-alpine
LABEL author="huynq@vmodev.com"
RUN mkdir -p /home/blueonion
WORKDIR /home/user_managerment
COPY ./ /home/user_managerment

RUN npm cache clean --force \
  && npm install \
  && npm run build

CMD [ "npm","run","start:prod" ]
EXPOSE 8000
