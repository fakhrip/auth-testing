FROM node:lts-alpine as build
WORKDIR /app
COPY ./frontend/ ./
RUN npm ci --ignore-scripts --audit false --fund false && npm run build

FROM nginx:alpine

# For healthcheck
RUN apk add --no-cache curl

COPY --from=build /app/dist /usr/share/nginx/html
COPY ./frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]