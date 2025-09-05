<template>
  <div class="layout">
    <header class="header">Nuxt2 Todo</header>
    <main>
      <nuxt />
    </main>
    <footer class="footer">&copy;Built with Nuxt.js</footer>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #fafafa;
}

.header {
  padding: 12px 24px;
  border-bottom: 1px solid #eee;
  font-weight: 600;
}

main {
  flex: 1;
}

.footer {
  padding: 12px 24px;
  border-top: 1px solid #eee;
  text-align: center;
  color: #999;
  font-size: 12px;
}
</style>
