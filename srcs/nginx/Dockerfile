FROM alpine:3.18

RUN	apk update && apk upgrade && apk add --no-cache nginx

COPY ./default.conf /etc/nginx/nginx.conf

COPY ./ssl/nginx-selfsigned.crt /etc/nginx/certs/
COPY ./ssl/nginx-selfsigned.key /etc/nginx/certs/

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]