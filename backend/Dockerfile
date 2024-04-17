FROM node:lts-alpine as build
WORKDIR /app
COPY ./backend/ ./
RUN npm ci --ignore-scripts --audit false --fund false && npm run build

FROM node:lts-alpine
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist/ ./dist
COPY --from=build /app/.env ./
COPY --from=build /app/package.json ./
COPY --from=build /app/package-lock.json ./

# Because https://github.com/krallin/tini/issues/8
RUN apk add --no-cache tini

# For healthcheck
RUN apk add --no-cache curl

ENTRYPOINT ["/sbin/tini", "--"]
CMD node ./dist/main