FROM guergeiro/pnpm:22-10

WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json ./

RUN pnpm install

COPY . .

RUN pnpm build

ENV PORT=3000

EXPOSE 3000

CMD [ "pnpm", "start" ]
