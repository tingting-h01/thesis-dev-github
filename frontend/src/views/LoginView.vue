<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="title">Sign In</h2>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="identifier">Email Address</label>
          <input 
            id="identifier"
            type="text" 
            v-model="identifier" 
            placeholder="name@example.com" 
            autocomplete="email"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input 
            id="password"
            type="password" 
            v-model="password" 
            placeholder="••••••••" 
            autocomplete="current-password"
            required
          />
        </div>

        <button type="submit" :disabled="isLoading" class="submit-btn">
          {{ isLoading ? 'Processing...' : 'Log In' }}
        </button>
      </form>
      
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

const identifier = ref('');
const password = ref('');
const isLoading = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:1338';

    const response = await axios.post(`${apiUrl}/api/auth/local`, {
    identifier: identifier.value,
    password: password.value
    });

    const token = response.data.jwt;
    const user = response.data.user;

    localStorage.setItem('jwt', token);
    localStorage.setItem('user', JSON.stringify(user));

    router.push('/'); 

  } catch (error) {
    console.error('Login error:', error);
    
    if (error.response && error.response.status === 400) {
      errorMessage.value = 'Invalid email or password.';
    } else {
      errorMessage.value = 'Unable to connect to server.';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* Nordic Palette */
:root {
  --bg-color: #F7F9FC;
  --card-bg: #FFFFFF;
  --text-primary: #2C3E50;
  --text-secondary: #64748B;
  --border-color: #E2E8F0;
  --accent-color: #2D3748; /* Dark Slate */
  --accent-hover: #1A202C;
  --error-color: #E53E3E;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #F7F9FC; /* Light cool grey */
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.login-box {
  background: #FFFFFF;
  padding: 48px;
  border-radius: 6px;
  /* Minimal border, very subtle shadow */
  border: 1px solid #E2E8F0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 380px;
}

.title {
  margin: 0 0 32px 0;
  font-size: 24px;
  font-weight: 500;
  color: #2C3E50;
  text-align: center;
  letter-spacing: -0.5px;
}

.form-group {
  margin-bottom: 24px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #64748B; /* Muted grey for labels */
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

input {
  width: 100%;
  padding: 12px 14px;
  font-size: 15px;
  color: #2C3E50;
  background-color: #FAFAFA;
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  box-sizing: border-box;
  transition: all 0.2s ease;
  outline: none;
}

input:focus {
  background-color: #FFFFFF;
  border-color: #94A3B8;
  box-shadow: 0 0 0 2px rgba(148, 163, 184, 0.1);
}

input::placeholder {
  color: #CBD5E1;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background-color: #2D3748; /* Matte dark */
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  letter-spacing: 0.3px;
}

.submit-btn:hover:not(:disabled) {
  background-color: #1A202C;
}

.submit-btn:disabled {
  background-color: #94A3B8;
  cursor: not-allowed;
  opacity: 0.7;
}

.error-message {
  margin-top: 20px;
  font-size: 13px;
  color: #E53E3E;
  text-align: center;
  background-color: #FFF5F5;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #FED7D7;
}
</style>