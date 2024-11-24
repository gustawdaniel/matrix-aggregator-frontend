FROM node:22-alpine

WORKDIR /opt/app

# Enable Corepack and use pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY ./package.json ./pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

COPY ./ .

# Build the project
RUN pnpm build