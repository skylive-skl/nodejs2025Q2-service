FROM node:22-alpine AS core

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . /app/

RUN npm run prisma:generate


FROM core AS development
# RUN npm run prisma:migrate:dev
# RUN npm run prisma:generate
CMD npm run start:dev:migrate

FROM core AS production
RUN npm run build
CMD ["npm", "run", "start:prod"]