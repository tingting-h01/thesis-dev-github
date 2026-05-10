// file: strapi-project/config/server.ts

export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  webhooks: {
    populateRelations: false,
  },
  // ✅ 你的 CORS 配置部分保持不变
  middleware: {
    settings: {
      cors: {
        enabled: true,
        origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
        credentials: true,
      },
    },
  },
});