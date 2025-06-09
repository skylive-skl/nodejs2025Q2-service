FROM node:22-alpine AS core

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . /app/


FROM core AS development
# RUN npm run prisma:migrate:dev
CMD npm run prisma:migrate:prod && npm run start:dev

FROM core AS production
RUN npm run build
CMD ["npm", "run", "start:prod"]