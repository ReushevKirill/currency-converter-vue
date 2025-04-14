// src/composables/useConverter.ts
import { ref, watch, computed } from 'vue'
import type { Ref } from 'vue'
import { useCurrencyStore } from '@/stores/currencyStore'
import type { SupportedCurrencyCode, RelevantExchangePairs } from '@/types/currency'

interface UseConverterReturn {
  amount1: Ref<number | null>
  amount2: Ref<number | null>
  currency1: Ref<SupportedCurrencyCode>
  currency2: Ref<SupportedCurrencyCode>
  conversionRate: Ref<number | null>
  error: Ref<string | null>
  loading: Ref<boolean>
  handleAmount1Input: (value: number | null) => void
  handleAmount2Input: (value: number | null) => void
}

export function useConverter(
  initialCurrency1: SupportedCurrencyCode = 'RUB',
  initialCurrency2: SupportedCurrencyCode = 'USD',
): UseConverterReturn {
  const currencyStore = useCurrencyStore()

  const amount1 = ref<number | null>(null)
  const amount2 = ref<number | null>(null)
  const currency1 = ref<SupportedCurrencyCode>(initialCurrency1)
  const currency2 = ref<SupportedCurrencyCode>(initialCurrency2)

  const lastEdited = ref<'amount1' | 'amount2' | null>(null)
  const conversionError = ref<string | null>(null)

  const getConversionRate = (
    from: SupportedCurrencyCode,
    to: SupportedCurrencyCode,
    allRates: RelevantExchangePairs,
  ): number | null => {
    if (from === to) {
      return 1
    }
    const directPairKey = `${from.toLowerCase()}-${to.toLowerCase()}` as keyof RelevantExchangePairs
    if (typeof allRates[directPairKey] === 'number') {
      return allRates[directPairKey]
    }
    console.error(`Conversion rate for ${from} -> ${to} not found.`)
    return null
  }

  const conversionRate = computed(() => {
    if (
      currencyStore.loading ||
      currencyStore.error ||
      Object.keys(currencyStore.rates).length === 0
    ) {
      return null
    }
    return getConversionRate(currency1.value, currency2.value, currencyStore.rates)
  })

  // --- Новая функция для конвертации ---
  const convertAmount = (
    editedAmount: Ref<number | null>,
    sourceCurrency: Ref<SupportedCurrencyCode>,
    targetAmount: Ref<number | null>,
    targetCurrency: Ref<SupportedCurrencyCode>,
    isForward: boolean, // Флаг, указывающий прямое или обратное преобразование
  ) => {
    conversionError.value = null
    const rate = isForward
      ? conversionRate.value
      : getConversionRate(sourceCurrency.value, targetCurrency.value, currencyStore.rates)

    if (typeof editedAmount.value === 'number' && typeof rate === 'number' && rate > 0) {
      const result = editedAmount.value * rate
      targetAmount.value = parseFloat(result.toFixed(2))
    } else if (typeof editedAmount.value === 'number') {
      targetAmount.value = editedAmount.value === 0 ? 0 : null
      if (rate === null && editedAmount.value !== 0) {
        conversionError.value = `Нет курса для ${sourceCurrency.value} -> ${targetCurrency.value}`
      }
    } else {
      targetAmount.value = null
    }
  }

  watch([amount1, currency1, currency2], () => {
    if (lastEdited.value === 'amount1') {
      convertAmount(amount1, currency1, amount2, currency2, true)
      lastEdited.value = null
    }
  })

  watch([amount2, currency1, currency2], () => {
    if (lastEdited.value === 'amount2') {
      convertAmount(amount2, currency2, amount1, currency1, false)
      lastEdited.value = null
    }
  })

  const handleAmount1Input = (value: number | null) => {
    lastEdited.value = 'amount1'
    amount1.value = value
  }

  const handleAmount2Input = (value: number | null) => {
    lastEdited.value = 'amount2'
    amount2.value = value
  }

  watch([currency1, currency2], ([c1, c2]) => {
    if (c1 === c2) {
      if (lastEdited.value !== 'amount2' && typeof amount1.value === 'number') {
        handleAmount2Input(amount1.value)
      } else if (lastEdited.value !== 'amount1' && typeof amount2.value === 'number') {
        handleAmount1Input(amount2.value)
      }
    } else {
      if (lastEdited.value !== 'amount2') {
        const currentAmount1 = amount1.value
        handleAmount1Input(currentAmount1)
      } else if (lastEdited.value !== 'amount1') {
        const currentAmount2 = amount2.value
        handleAmount2Input(currentAmount2)
      }
    }
  })

  return {
    amount1,
    amount2,
    currency1,
    currency2,
    conversionRate,
    error: conversionError,
    loading: computed(() => currencyStore.loading),
    handleAmount1Input,
    handleAmount2Input,
  }
}
