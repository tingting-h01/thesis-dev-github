<template>
  <!-- 这里的 router-view 就是个占位符 -->
  <!-- 如果网址是 /login，这里就显示 Login.vue -->
  <!-- 如果网址是 /，这里就显示 ProductList.vue -->
  <router-view></router-view>
</template>

<script setup>
// 这里不需要引入 ProductList 或 Login 了
// 因为路由会自动帮我们需要的时候引入
</script>

<style>
/* 保持你原本的样式，或者留空 */
</style>