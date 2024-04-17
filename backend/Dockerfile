FROM node:lts-alpine as build
WORKDIR /app
COPY ./backend/ ./
RUN npm ci --ignore-scripts --audit false --fund false && npm run build

FROM node:lts-alpine
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist/ .
COPY --from=build /app/.env .

# Because https://github.com/krallin/tini/issues/8
RUN apk add --no-cache tini

# For healthcheck
RUN apk add --no-cache curl

WORKDIR /app

ENTRYPOINT ["/sbin/tini", "--"]
CMD npx dotenv-flow -- node ./dist/main