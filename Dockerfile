FROM node:22-slim

ARG PORT=3000

ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

COPY . /app

RUN npm install
RUN npm run build

ENV NODE_ENV=production
ENV PORT=$PORT

EXPOSE $PORT

ENV HOSTNAME="0.0.0.0"
CMD ["npm", "start"]