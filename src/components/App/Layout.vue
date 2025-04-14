<template>
  <div id="app-layout" class="app-container">
    <Header />
    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex-grow: 1;
  padding: 1.5rem 0;
}
</style>
