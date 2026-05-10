# frontend/Dockerfile.dev
# 使用 Node.js 22
FROM node:22-alpine


WORKDIR /app

# 只复制依赖文件
COPY package.json package-lock.json* ./

# 清理安装
RUN npm cache clean --force && \
    npm install

# 复制源代码
COPY . .

ENV VITE_API_URL=http://localhost:1337

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
