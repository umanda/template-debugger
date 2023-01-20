FROM node:16

RUN apt-get update && apt-get install -y apt-transport-https
RUN apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev libxi-dev libgl1-mesa-dev
RUN apt-get install -y python
ENV NODE_OPTIONS --max-old-space-size=4096

WORKDIR /app

COPY . .

RUN npm i

RUN npm run build

CMD ["npm", "run", "dev"]