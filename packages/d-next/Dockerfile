FROM node:20.0.0

ENV APP_NAME d-next

RUN apt-get update -qqy && \
    apt-get install -y ttf-wqy-microhei && \
    apt-get install -y ttf-wqy-zenhei && \
    apt-get install -y libxss1 && \
    apt-get install -y libxtst6 

WORKDIR /d-next
COPY . /d-next
RUN yarn install
# RUN yarn install && \
    # yarn build && \
    # if [ -n "${APP_VERSION}" ]; then yarn install --production; fi

EXPOSE 7002
CMD yarn run dev