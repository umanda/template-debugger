FROM node:18-slim

RUN apt-get update && apt-get install -y apt-transport-https
RUN apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev libxi-dev libgl1-mesa-dev
RUN apt-get install -y python
ENV NODE_OPTIONS --max-old-space-size=4096

RUN npm i -g pnpm

WORKDIR /app

COPY . .

RUN pnpm i

RUN pnpm build

CMD ["pnpm", "start"]