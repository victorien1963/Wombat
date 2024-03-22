FROM node:20.0.0

ENV APP_NAME dAIVince

RUN apt-get update -qqy && \
    apt-get install -y ttf-wqy-microhei && \
    apt-get install -y ttf-wqy-zenhei && \
    apt-get install -y libxss1 && \
    apt-get install -y libxtst6 

WORKDIR /d-web
COPY . /d-web
RUN yarn install && \
    yarn build && \
    if [ -n "${APP_VERSION}" ]; then yarn install --production; fi

EXPOSE 3000
CMD yarn startp