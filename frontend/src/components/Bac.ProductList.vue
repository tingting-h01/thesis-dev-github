<template>
  <div class="products-container">
    <h1>📦 商品列表</h1>
    
    <!-- 加载状态 -->
    <p v-if="loading">加载中...</p>
    
    <!-- 错误提示 -->
    <p v-if="error" style="color: red;">
      ❌ 错误: {{ error }}
    </p>
    
    <!-- 产品列表 -->
    <div v-if="!loading && products.length > 0" class="products-grid">
      <div v-for="product in products" :key="product.id" class="product-card">
        <h3>{{ product.name }}</h3>
        <p>💰 价格: ¥{{ product.price }}</p>
        <p v-if="product.description">📝 {{ product.description }}</p>
      </div>
    </div>
    
    <!-- 无数据 -->
    <p v-if="!loading && products.length === 0">
      暂无商品
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const products = ref([])
const loading = ref(false)
const error = ref(null)

onMounted(async () => {
  loading.value = true
  try {
    // 这是关键的 API 调用
    const response = await axios.get('http://localhost:1337/api/products')
    
    console.log('API 响应:', response.data) // test
    
    products.value = response.data.data || []
    
  } catch (err) {
    console.error('API Error:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.products-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  background: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.product-card h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.product-card p {
  margin: 8px 0;
  color: #666;
}
</style>