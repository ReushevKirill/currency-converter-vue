<template>
  <div class="currency-selector">
    <label for="base-currency" class="selector-label p-mr-2">Основная валюта:</label>
    <Select
      v-model="selectedBaseCurrency"
      :options="availableCurrencies"
      optionLabel="name"
      optionValue="code"
      placeholder="Выберите валюту"
      inputId="base-currency"
      class="currency-dropdown"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import type { CurrencyOption } from '@/types/currency'
import { useCurrencyStore } from '@/stores/currencyStore'

const availableCurrencies: CurrencyOption[] = [
  { code: 'RUB', name: 'RUB' },
  { code: 'USD', name: 'USD' },
  { code: 'EUR', name: 'EUR' },
]

const currencyStore = useCurrencyStore()

const selectedBaseCurrency = ref(currencyStore.baseCurrency)

watch(selectedBaseCurrency, (newCurrencyCode) => {
  if (newCurrencyCode) {
    // Вызываем action из стора для обновления базовой валюты
    currencyStore.setBaseCurrency(newCurrencyCode)
  }
})
</script>

<style scoped>
.currency-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.selector-label {
  font-size: 0.9rem;
}

.currency-dropdown {
  min-width: 100px;
}

.p-mr-2 {
  margin-right: 0.5rem;
}
</style>
