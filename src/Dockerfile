FROM node:16-alpine
ENV NODE_ENV="development"
WORKDIR /
COPY package.json .
ARG CACHEBUST=1
ADD . .
RUN ls -a
RUN npm install
RUN npm install tsc sequelize-cli -g
RUN npm run build
COPY . .
COPY ./config/config.js ./config/config.js
RUN ls -a
EXPOSE 3000
CMD ["npm", "start"]