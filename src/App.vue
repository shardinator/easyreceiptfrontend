<template>
  <div class="page">
    <img
      src="/images/EasyReceipt_logo.png"
      alt="EasyReceipt"
      class="logo"
      width="997"
      height="264"
    />
  </div>
</template>

<style scoped>
.page {
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(16px, 4vw, 48px);
}

.logo {
  max-width: min(92vw, 720px);
  width: 100%;
  height: auto;
  display: block;
}
</style>
