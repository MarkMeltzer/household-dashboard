FROM node:19.5 as builder

ARG version
ARG backend_url

COPY . /code
WORKDIR /code

# Add backend url into config.json
RUN apt update && \
    apt install jq -y
# why args? see: https://jqlang.github.io/jq/manual/#Invokingjq
RUN jq --arg url "$backend_url" '."DATA_SERVER_URL"=$url' src/config.json > tmp.json && \
    mv tmp.json src/config.json
RUN jq --arg app_version "$version" '."VERSION"=$app_version' src/config.json > tmp.json && \
    mv tmp.json src/config.json

RUN npm install
RUN npm run build

FROM nginx

COPY ./docker_files/default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /code/build /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]