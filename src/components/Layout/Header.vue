<template>
  <header class="header">
    <Nav />
    <CurrencySelector />
  </header>
</template>

<script setup lang="ts">
import Nav from '@/components/Layout/Nav/index.vue'
import CurrencySelector from '@/components/Currency/Selector.vue'
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
}
</style>
