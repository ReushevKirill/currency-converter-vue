<template>
  <Panel header="Конвертер валют">
    <div class="converter-form">
      <div class="converter-row">
        <Select
          v-model="currency1"
          :options="availableCurrencies"
          optionLabel="name"
          optionValue="code"
          placeholder="Валюта 1"
          class="currency-dropdown"
          :disabled="loading"
        />
        <InputNumber
          :modelValue="amount1"
          @update:modelValue="handleAmount1Input"
          placeholder="Сумма"
          mode="decimal"
          :minFractionDigits="0"
          :maxFractionDigits="2"
          :min="0"
          class="amount-input"
          :disabled="loading"
          inputId="amount1"
          :invalid="!!error"
        />
      </div>

      <div class="swap-icon-container">
        <i class="pi pi-sync swap-icon" @click="swapCurrencies"></i>
      </div>

      <div class="converter-row">
        <Select
          v-model="currency2"
          :options="availableCurrencies"
          optionLabel="name"
          optionValue="code"
          placeholder="Валюта 2"
          class="currency-dropdown"
          :disabled="loading"
        />
        <InputNumber
          :modelValue="amount2"
          @update:modelValue="handleAmount2Input"
          placeholder="Результат"
          mode="decimal"
          :minFractionDigits="0"
          :maxFractionDigits="2"
          :min="0"
          class="amount-input"
          :disabled="loading"
          inputId="amount2"
          :invalid="!!error"
        />
      </div>

      <Message v-if="error" severity="warn" :closable="false" class="error-message">
        {{ error }}
      </Message>

      <div v-if="!loading && conversionRate !== null && !error" class="rate-info">
        Текущий курс: 1 {{ currency1 }} = {{ conversionRate.toFixed(4) }} {{ currency2 }}
      </div>
      <div v-if="loading" class="rate-info">Загрузка курса...</div>
    </div>
  </Panel>
</template>

<script setup lang="ts">
import type { SupportedCurrencyCode } from '@/types/currency'
import { useConverter } from '@/composables/useConverter'

const availableCurrencies: { code: SupportedCurrencyCode; name: string }[] = [
  { code: 'RUB', name: 'RUB' },
  { code: 'USD', name: 'USD' },
  { code: 'EUR', name: 'EUR' },
]

const {
  amount1,
  amount2,
  currency1,
  currency2,
  conversionRate,
  error,
  loading,
  handleAmount1Input,
  handleAmount2Input,
} = useConverter('RUB', 'USD')

const swapCurrencies = () => {
  const tempCurrency = currency1.value
  const tempAmount = amount1.value

  currency1.value = currency2.value
  currency2.value = tempCurrency

  handleAmount2Input(tempAmount)
  handleAmount1Input(amount2.value)

  amount2.value = null
}
</script>

<style scoped>
.converter-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.converter-row {
  display: flex;
  gap: 1rem;
  align-items: stretch;
}

.currency-dropdown {
  flex-basis: 120px;
  flex-shrink: 0;
}

.amount-input {
  flex-grow: 1;
  width: 100%;
}

:deep(.amount-input .p-inputtext) {
  width: 100%;
}

.swap-icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: -0.5rem 0;
}

.swap-icon {
  font-size: 1.5rem;
  color: var(--p-primary-color);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}
.swap-icon:hover {
  background-color: color-mix(in srgb, var(--p-primary-color) 10%, transparent);
}

.error-message {
  margin-top: 0.5rem;
}

.rate-info {
  margin-top: 0.5rem;
  text-align: center;
  font-size: 0.9rem;
  color: var(--p-text-secondary-color);
}

:deep(.p-inputnumber-invalid .p-inputtext) {
  border-color: var(--p-red-500) !important;
}
</style>
