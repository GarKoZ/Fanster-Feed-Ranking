FROM registry.thinknet.co.th/sredev/nodejs:boron

COPY . /usr/src/app

RUN yarn install
    # && chmod -R 777 usr/src/app/logs \



CMD ["node"]