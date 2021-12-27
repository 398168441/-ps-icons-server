FROM node:12

ARG SERVER_DIR=/app/cps-svg-server
RUN mkdir -p ${SERVER_DIR}
WORKDIR ${SERVER_DIR}
COPY . ${SERVER_DIR}

CMD ["node", "./dist/index.js"]
