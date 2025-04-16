import { ref, watch, computed } from 'vue'
import type { Ref } from 'vue'
import { useCurrencyStore } from '@/stores/currencyStore'
import type { SupportedCurrencyCode, RelevantExchangePairs } from '@/types/currency'

interface UseConverterReturn {
  amount1: Ref<number | null>
  amount2: Ref<number | null>
  currency1: Ref<SupportedCurrencyCode>
  currency2: Ref<SupportedCurrencyCode>
  conversionRate: Ref<number | null> // Для отображения курса 1 -> 2
  error: Ref<string | null>
  loading: Ref<boolean>
  handleAmount1Input: (value: number | null) => void
  handleAmount2Input: (value: number | null) => void
  swapCurrencies: () => void
}

export function useConverter(
  initialCurrency1: SupportedCurrencyCode = 'RUB',
  initialCurrency2: SupportedCurrencyCode = 'USD',
): UseConverterReturn {
  const currencyStore = useCurrencyStore()

  // Состояние
  const amount1 = ref<number | null>(null)
  const amount2 = ref<number | null>(null)
  const currency1 = ref<SupportedCurrencyCode>(initialCurrency1)
  const currency2 = ref<SupportedCurrencyCode>(initialCurrency2)
  const lastEdited = ref<'amount1' | 'amount2' | null>(null)
  const conversionError = ref<string | null>(null)

  // Получение курса
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
    return null // Курс не найден
  }

  const calculateAndUpdateTarget = (
    sourceAmountRef: Ref<number | null>,
    sourceCurrencyRef: Ref<SupportedCurrencyCode>,
    targetCurrencyRef: Ref<SupportedCurrencyCode>,
    targetAmountRef: Ref<number | null>,
  ) => {
    conversionError.value = null
    const sourceAmount = sourceAmountRef.value
    const sourceCurrency = sourceCurrencyRef.value
    const targetCurrency = targetCurrencyRef.value

    // Если исходное значение не число или null, очищаем целевое
    if (typeof sourceAmount !== 'number') {
      targetAmountRef.value = null
      return
    }
    // Если исходное значение 0, целевое тоже 0
    if (sourceAmount === 0) {
      targetAmountRef.value = 0
      return
    }

    const rate = getConversionRate(sourceCurrency, targetCurrency, currencyStore.rates)

    if (rate !== null) {
      const result = sourceAmount * rate
      targetAmountRef.value = parseFloat(result.toFixed(2))
    } else {
      targetAmountRef.value = null
      conversionError.value = `Нет курса для ${sourceCurrency} -> ${targetCurrency}`
    }
  }

  // Следим за изменением amount1 И валют (чтобы пересчитать amount2)
  watch([amount1, currency1, currency2], () => {
    // Пересчитываем amount2 только если amount1 был изменен пользователем
    if (lastEdited.value === 'amount1') {
      calculateAndUpdateTarget(amount1, currency1, currency2, amount2)
    }
  })

  // Следим за изменением amount2 И валют (чтобы пересчитать amount1)
  watch([amount2, currency1, currency2], () => {
    // Пересчитываем amount1 только если amount2 был изменен пользователем
    if (lastEdited.value === 'amount2') {
      calculateAndUpdateTarget(amount2, currency2, currency1, amount1)
    }
  })

  watch([currency1, currency2], ([c1, c2], [oldC1, oldC2]) => {
    if (oldC1 === undefined || oldC2 === undefined) return

    // Если валюты стали одинаковыми
    if (c1 === c2) {
      // Копируем значение на основе того, что редактировали последним
      if (lastEdited.value === 'amount1' && typeof amount1.value === 'number') {
        amount2.value = amount1.value
      } else if (lastEdited.value === 'amount2' && typeof amount2.value === 'number') {
        amount1.value = amount2.value
      }
      return
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

  const swapCurrencies = () => {
    const tempCurrency = currency1.value
    const tempAmount = amount1.value

    currency1.value = currency2.value
    currency2.value = tempCurrency

    handleAmount2Input(tempAmount)
    handleAmount1Input(amount2.value)
  }

  const conversionRateDisplay = computed(() => {
    if (
      currencyStore.loading ||
      currencyStore.error ||
      Object.keys(currencyStore.rates).length === 0
    ) {
      return null
    }
    return getConversionRate(currency1.value, currency2.value, currencyStore.rates)
  })

  return {
    amount1,
    amount2,
    currency1,
    currency2,
    conversionRate: conversionRateDisplay,
    error: conversionError,
    loading: computed(() => currencyStore.loading),
    handleAmount1Input,
    handleAmount2Input,
    swapCurrencies,
  }
}
