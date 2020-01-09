FROM node:10-jessie as BUILDER

RUN apt update && apt install -y gettext-base
COPY ./src /home/frontend/src
COPY *.json /home/frontend/
WORKDIR /home/frontend
RUN npm install

ARG BACKEND
ARG KEYCLOACK
ARG KEYCLOACK_CLIENT_ID

ENV BACKEND ${BACKEND}
ENV KEYCLOACK ${KEYCLOACK}
ENV KEYCLOACK_CLIENT_ID ${KEYCLOACK_CLIENT_ID}

RUN envsubst '$$BACKEND $$KEYCLOACK $$KEYCLOACK_CLIENT_ID' < ./src/environments/environment.prod.ts > ./src/environments/environment.prod.ts
RUN ["cat","/home/frontend/src/environments/environment.prod.ts"]
RUN ./node_modules/.bin/ng build --prod

FROM nginx:1.15.12
COPY --from=BUILDER /home/frontend/dist/trt22-frontend /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf
EXPOSE 80