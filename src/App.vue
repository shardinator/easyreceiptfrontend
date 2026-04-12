<script setup>
import Home from './components/Home.vue'
</script>

<template>
  <div class="app">
    <header class="brand">
      <img
        src="/images/EasyReceipt_logo.png"
        alt="EasyReceipt"
        class="logo"
        width="997"
        height="264"
      />
    </header>
    <main class="main">
      <Home />
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: clamp(16px, 4vw, 32px) clamp(16px, 4vw, 48px) 48px;
}

.brand {
  margin-bottom: 28px;
}

.logo {
  display: block;
  max-width: min(92vw, 400px);
  width: 100%;
  height: auto;
}

.main {
  width: 100%;
  max-width: 720px;
}
</style>
