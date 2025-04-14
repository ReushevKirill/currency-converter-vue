<template>
  <div class="home-view">
    <ExchangeRates />
  </div>
</template>

<script setup lang="ts">
import ExchangeRates from '@/components/ExchangeRates/index.vue'
</script>

<style scoped>
.home-view {
  max-width: 600px;
  margin: 0 auto;
}
</style>
