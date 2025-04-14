<template>
  <Loader v-if="currencyStore.loading"> Загрузка курсов... </Loader>
  <Error v-if="currencyStore.error">
    {{ currencyStore.error }}
  </Error>
  <RouterView v-if="!currencyStore.loading || currencyStore.isCacheValid" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useCurrencyStore } from '@/stores/currencyStore'
import Loader from '@/components/Loader/index.vue'
import Error from '@/components/Error/index.vue'

const currencyStore = useCurrencyStore()

// Запускаем загрузку курсов
onMounted(() => {
  currencyStore.fetchRates()
})
</script>
