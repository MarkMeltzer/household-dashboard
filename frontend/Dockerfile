FROM node:19.5 as builder

COPY . /code
WORKDIR /code

RUN npm install
RUN npm run build

FROM nginx

COPY --from=builder /code/build /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]