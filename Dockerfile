FROM sohel07/dynamic_collections:node12.16.1-alpine3.11-v1.0
WORKDIR /home/node/app
COPY --chown=node:node . .
USER node
EXPOSE 8080
CMD ["node", "startup/index.js"]