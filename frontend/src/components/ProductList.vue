<template>
  <div class="products-container">
    <div class="header-controls">
      <h1 class="page-title">Products Management</h1>
      
      <div v-if="isLoggedIn" class="user-status-container">
        <span class="user-status">Admin Active</span>
        <button class="btn-text" @click="handleLogout">Log out</button>
      </div>
      <div v-else>
        <button class="btn-primary" @click="$router.push('/login')">Log in</button>
      </div>
    </div>

    <div v-if="isLoggedIn" class="publish-section">
      <h3 class="section-title">New Entry</h3>
      
      <div class="form-container">
        <div class="form-row three-col">
          <input v-model="newProduct.name" placeholder="Product name" class="minimal-input" />
          <input v-model="newProduct.price" type="number" step="0.01" placeholder="Price (€)" class="minimal-input" />
          <input v-model="newProduct.stock" type="number" placeholder="Stock Qty" class="minimal-input" />
        </div>

        <div class="form-row two-col">
          <div class="input-wrapper">
            <label class="input-label">Trigger Date</label>
            <input v-model="newProduct.attention.triggerDate" type="date" class="minimal-input" />
          </div>
          
          <div class="input-wrapper">
            <label class="input-label">Notification Type</label>
            <select v-model="newProduct.attention.type" class="minimal-input">
              <option value="email_notification">Email Notification</option>
              <option value="sms_notification">SMS Notification</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="input-wrapper">
            <label class="input-label">Priority</label>
            <select v-model="newProduct.attention.priority" class="minimal-input">
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <div class="form-row">
  <div class="input-wrapper">
    <label class="input-label">Reminder Message</label>
    <input v-model="newProduct.attention.message" 
           placeholder="e.g. Check seasonal stock levels" 
           class="minimal-input" />
  </div>
</div>

        <div class="form-row">
          <textarea v-model="rawDescription" placeholder="Product description..." class="minimal-textarea"></textarea>
        </div>

        <div class="form-actions">
         <button type="button" @click="checkData">Print data in Console</button>
          <button @click="publishProduct" :disabled="publishing" class="btn-black">
            {{ publishing ? 'Processing...' : 'Publish Product' }}
          </button>
        </div>
      </div>
    </div>

    <div class="divider"></div>
    
    <p v-if="loading" class="status-text">Loading...</p>
    <p v-if="error" class="error-text">Error: {{ error }}</p>
    
    <div v-if="!loading && products.length > 0" class="products-grid">
      <div v-for="product in products" :key="product.id" class="product-card">
        
        <div class="card-header">
          <h3 class="product-name">{{ product.name }}</h3>
          <button 
            v-if="isLoggedIn" 
            @click="deleteProduct(product.documentId || product.id)" 
            class="btn-delete-minimal"
          >
            Delete
          </button>
        </div>

        <div class="product-meta">
          <span class="price">€ {{ product.price }}</span>
          <span class="stock" :class="{ 'out-of-stock': product.stock === 0 }">
            {{ product.stock > 0 ? `Stock: ${product.stock}` : 'Out of Stock' }}
          </span>
        </div>
        
        <p v-if="product.description && product.description[0]?.children[0]?.text" class="product-desc">
            {{ product.description[0].children[0].text }}
        </p>
        <p v-else class="product-desc-placeholder">No description provided.</p>

       <div v-if="product.attention" class="product-attention">
  <strong>
    {{ product.attention.type?.replace('_', ' ') || 'General Notification' }}
  </strong> 
  <span v-if="product.attention.triggerDate">on {{ product.attention.triggerDate }}</span>
  
  <p v-if="product.attention.message" class="attention-msg">
    "{{ product.attention.message }}"
  </p>

  <p v-if="product.attention.priority" class="attention-msg">
    Priority: {{ product.attention.priority }}
  </p>
  
</div>

      </div>
    </div>
    
    <p v-if="!loading && products.length === 0" class="status-text">
      No products available.
    </p>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const products = ref([])
const loading = ref(false)
const error = ref(null)
const isLoggedIn = ref(false)
const publishing = ref(false)

//
const rawDescription = ref('') 
const newProduct = reactive({ 
  name: '', 
  price: '',
  stock: '', 
  attention: { 
    type: 'email_notification',
    triggerDate: '',
    message: '', 
    priority: 'high', // < -- Validating
    status: 'pending'
  }
})

const checkData = () => {
  // 重点是这一句：深拷贝或者直接打印，为了看到纯净的数据
  console.log(' Current Reactive Object:', newProduct) 
}

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:1338';

function checkLogin() {
  const token = localStorage.getItem('jwt');
  isLoggedIn.value = !!token;
}

function handleLogout() {
  localStorage.removeItem('jwt');
  localStorage.removeItem('user');
  isLoggedIn.value = false;
}

async function fetchProducts() {
  loading.value = true
  try {
    const response = await axios.get(`${apiUrl}/api/products`, {
      params: { populate: '*' } // 获取所有关联字段（包含组件）
    });
    products.value = response.data.data;
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

async function publishProduct() {
  
  if (!newProduct.name || !newProduct.price || !newProduct.stock) {
    alert("Please fill in name, price and stock");
    return;
  }

  publishing.value = true;
  try {
    const myToken = localStorage.getItem('jwt');
    if (!myToken) { 
        alert("Session expired"); 
        router.push('/login'); 
        return; 
    }

    // 3. payload
    const payload = {
      data: {
        name: newProduct.name,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock), 
        attention: { 
            type: newProduct.attention.type,
            triggerDate: newProduct.attention.triggerDate,
            message: newProduct.attention.message, 
            priority: newProduct.attention.priority,
            status: 'pending'
        },
        // 构建 Strapi Blocks 结构
        description: rawDescription.value ? [
          {
            type: "paragraph",
            children: [{ type: "text", text: rawDescription.value }]
          }
        ] : []
      }
    };

    await axios.post(`${apiUrl}/api/products`, payload,
      { headers: { Authorization: `Bearer ${myToken}` } }
    );
    
    
    newProduct.name = '';
    newProduct.price = '';
    newProduct.stock = '';
    newProduct.attention.type = 'email_notification';
    newProduct.attention.triggerDate = '';
    newProduct.attention.message = '';
    newProduct.attention.priority = 'high';
    newProduct.attention.status = 'pending';
    rawDescription.value = '';
    
    fetchProducts();
  } catch (err) {
    console.error(err);
    alert("Failed: " + (err.response?.status === 403 ? "Permission Denied" : err.message));
  } finally {
    publishing.value = false;
  }
}

async function deleteProduct(id) {
  if (!confirm('Permanently delete this item?')) return;

  try {
    const myToken = localStorage.getItem('jwt');
    if (!myToken) return;

    await axios.delete(`${apiUrl}/api/products/${id}`, {
      headers: { Authorization: `Bearer ${myToken}` }
    });
    
    fetchProducts();
  } catch (err) {
    console.error(err);
    alert("Error: " + err.message);
  }
}

onMounted(() => {
  checkLogin();
  fetchProducts();
});
</script>

<style scoped>
/* Base Setup */
.products-container {
  max-width: 900px;
  margin: 60px auto;
  padding: 0 20px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #1a1a1a;
}

/* Header */
.header-controls {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 40px;
}

.page-title {
  font-size: 24px;
  font-weight: 500;
  letter-spacing: -0.5px;
  margin: 0;
}

.user-status {
  font-size: 13px;
  color: #666;
  margin-right: 20px;
}

/* Buttons */
button { cursor: pointer; transition: all 0.2s ease; font-size: 13px; font-weight: 500; }

.btn-primary {
  background-color: #1a1a1a; color: #fff; border: 1px solid #1a1a1a;
  padding: 8px 24px; border-radius: 0;
}
.btn-primary:hover { background-color: #333; }

.btn-black {
  background-color: #1a1a1a; color: #fff; border: 1px solid #1a1a1a;
  padding: 10px 24px; border-radius: 0; width: 100%;
}
.btn-black:disabled { background-color: #999; border-color: #999; cursor: not-allowed; }

.btn-text {
  background: none; border: none; color: #666; padding: 0;
  text-decoration: underline; text-underline-offset: 4px;
}
.btn-text:hover { color: #000; }

.btn-delete-minimal {
  background: none; border: none; color: #999; font-size: 12px; padding: 4px 0;
}
.btn-delete-minimal:hover { color: #d93025; text-decoration: underline; }

/* Publish Form - Updated Layout */
.publish-section { margin-bottom: 40px; background: #fafafa; padding: 20px; border: 1px solid #eee; }
.section-title { font-size: 14px; font-weight: 600; margin-bottom: 16px; color: #333; text-transform: uppercase; letter-spacing: 0.5px; }

.form-container { display: flex; flex-direction: column; gap: 15px; }

.form-row { display: grid; gap: 15px; }
.three-col { grid-template-columns: 2fr 1fr 1fr; }
.two-col { grid-template-columns: 1fr 1fr; }

.minimal-input, .minimal-textarea {
  width: 100%; padding: 10px; border: 1px solid #e0e0e0; background: #fff;
  font-size: 14px; color: #333; outline: none; box-sizing: border-box;
}
.minimal-input:focus, .minimal-textarea:focus { border-color: #000; }
.minimal-textarea { resize: vertical; min-height: 80px; }

.input-label { font-size: 11px; text-transform: uppercase; color: #888; display: block; margin-bottom: 4px; }

.divider { height: 1px; background-color: #f0f0f0; margin: 40px 0; }

/* Product Card - Updated */
.products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 30px; }
.product-card { border: 1px solid #f0f0f0; padding: 24px; background: #fff; display: flex; flex-direction: column; }

.card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
.product-name { margin: 0; font-size: 16px; font-weight: 600; color: #000; }

.product-meta { display: flex; justify-content: space-between; font-size: 14px; color: #666; margin-bottom: 12px; }
.price { color: #000; font-weight: 500; }
.stock.out-of-stock { color: #d93025; font-weight: 600; }

.product-desc { font-size: 13px; color: #444; line-height: 1.5; margin: 0 0 16px 0; flex-grow: 1; }
.product-desc-placeholder { font-size: 13px; color: #999; font-style: italic; margin-bottom: 16px; }

/* Attention Box */
.product-attention {
  font-size: 11px; color: #555; background-color: #f4f4f4; padding: 10px;
  border-left: 3px solid #000; margin-top: auto;
}

/* Utilities */
.status-text { color: #999; font-size: 14px; text-align: center; }
.error-text { color: #d93025; font-size: 14px; }

@media (max-width: 600px) {
  .three-col, .two-col { grid-template-columns: 1fr; }
}
</style>
