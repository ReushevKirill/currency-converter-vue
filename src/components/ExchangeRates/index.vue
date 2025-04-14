<template>
  <Panel header="Курсы валют">
    <template v-if="!currencyStore.error && Object.keys(ratesToDisplay).length > 0">
      <p class="base-currency-info">
        Курсы относительно базовой валюты: <strong>{{ baseCurrency }}</strong>
      </p>
      <ul class="rate-list">
        <li v-for="(rate, currency) in ratesToDisplay" :key="currency" class="rate-item">
          1 {{ currency }} = {{ formatRate(rate) }} {{ baseCurrency }}
        </li>
      </ul>
      <p v-if="lastUpdated" class="last-updated">
        Данные обновлены: {{ new Date(lastUpdated).toLocaleString() }}
      </p>
    </template>

    <template v-else-if="!currencyStore.loading && !currencyStore.error">
      <p>Не удалось загрузить или рассчитать курсы.</p>
    </template>
  </Panel>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCurrencyStore } from '@/stores/currencyStore'
import type { SupportedCurrencyCode } from '@/types/currency'
import { storeToRefs } from 'pinia'

const currencyStore = useCurrencyStore()
const { ratesRelativeToBase, baseCurrency, lastUpdated } = storeToRefs(currencyStore)

// Фильтруем курсы, чтобы не показывать "1 RUB = 1 RUB"
const ratesToDisplay = computed(() => {
  const filteredRates: { [key in SupportedCurrencyCode]?: number } = {}
  for (const currency in ratesRelativeToBase.value) {
    const typedCurrency = currency as SupportedCurrencyCode
    // Исключаем базовую валюту из списка отображения
    if (typedCurrency !== baseCurrency.value) {
      filteredRates[typedCurrency] = ratesRelativeToBase.value[typedCurrency]
    }
  }
  return filteredRates
})

const formatRate = (rate: number | undefined, count: number = 4): string => {
  if (typeof rate !== 'number') return 'N/A'
  return rate.toFixed(count)
}
</script>

<style scoped>
.base-currency-info {
  margin-bottom: 1rem;
  font-size: 1.1rem;
  text-align: center;
}

.rate-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.rate-item {
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid var(--p-surface-border, #eee);
  font-size: 1rem;
  display: flex;
  justify-content: space-between;
}

.rate-item:last-child {
  border-bottom: none;
}

.last-updated {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.85rem;
  color: var(--p-text-secondary-color, #6c757d);
}
</style>
