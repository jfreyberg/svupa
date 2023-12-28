FROM node:21-alpine3.18


WORKDIR /app
RUN echo "fs.inotify.max_user_watches=524288" >> /etc/sysctl.conf

COPY ./svelte.config.js ./
COPY ./tailwind.config.cjs ./
COPY ./vite.config.js ./
COPY ./package*.json ./

RUN npm install -g npm@10.2.5
RUN npm install
RUN npm update

USER root
COPY ./ ./

EXPOSE 3000

ENV HOST=0.0.0.0

CMD npm run dev