# strapi-project/Dockerfile
FROM node:18-alpine

# 针对 ARM64 (M4) 优化
RUN apk add --no-cache \
    build-base \
    gcc \
    autoconf \
    automake \
    zlib-dev \
    libpng-dev \
    vips-dev \
    git

WORKDIR /opt/app

# 如果已有 package.json，复制它
# 如果还没有，先跳过这一步
COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

ENV NODE_ENV=development

EXPOSE 1337

CMD ["npm", "run", "develop"]
