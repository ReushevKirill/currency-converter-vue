import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import type {
  SupportedCurrencyCode,
  CurrencyApiResponse,
  RelevantExchangePairs,
} from '@/types/currency'

const API_URL = 'https://status.neuralgeneration.com/api/currency'
const CACHE_DURATION_MS = 5 * 60 * 1000 // 5 минут

const REQUIRED_PAIRS: (keyof RelevantExchangePairs)[] = [
  'usd-rub',
  'eur-rub',
  'rub-usd',
  'eur-usd',
  'rub-eur',
  'usd-eur',
]

export const useCurrencyStore = defineStore('currency', () => {
  const baseCurrency = ref<SupportedCurrencyCode>('RUB')
  const rates = ref<RelevantExchangePairs>({})
  const lastUpdated = ref<number | null>(null)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const isCacheValid = computed(() => {
    return lastUpdated.value !== null && Date.now() - lastUpdated.value < CACHE_DURATION_MS
  })

  // Геттер для получения курсов относительно выбранной базовой валюты
  const ratesRelativeToBase = computed(() => {
    const relativeRates: { [key in SupportedCurrencyCode]?: number } = {}
    const currentRates = rates.value

    if (Object.keys(currentRates).length < REQUIRED_PAIRS.length) {
      return relativeRates
    }

    // Добавляем курс 1 для самой базовой валюты
    relativeRates[baseCurrency.value] = 1

    // Вычисляем остальные курсы на основе сохраненных пар
    try {
      if (baseCurrency.value === 'RUB') {
        relativeRates['USD'] = currentRates['usd-rub']
        relativeRates['EUR'] = currentRates['eur-rub']
      } else if (baseCurrency.value === 'USD') {
        relativeRates['RUB'] = currentRates['rub-usd']
        relativeRates['EUR'] = currentRates['eur-usd']
      } else if (baseCurrency.value === 'EUR') {
        relativeRates['RUB'] = currentRates['rub-eur']
        relativeRates['USD'] = currentRates['usd-eur']
      }

      // Проверка, что все значения являются числами
      for (const key in relativeRates) {
        if (typeof relativeRates[key as SupportedCurrencyCode] !== 'number') {
          console.error(
            `Failed to calculate relative rate for ${key} from base ${baseCurrency.value}`,
          )
          throw new Error(`Calculation error for ${key}`)
        }
      }
    } catch (e) {
      console.error('Error calculating relative rates:', e)
      error.value = 'Ошибка расчета курсов.'
      return {}
    }

    return relativeRates
  })

  function setBaseCurrency(newCurrency: SupportedCurrencyCode) {
    if (['RUB', 'USD', 'EUR'].includes(newCurrency)) {
      baseCurrency.value = newCurrency
    } else {
      console.warn(`Pinia: Invalid base currency ${newCurrency}`)
    }
  }

  async function fetchRates() {
    if (isCacheValid.value && Object.keys(rates.value).length >= REQUIRED_PAIRS.length) {
      console.log('Pinia: Using cached rates.')
      return
    }

    loading.value = true
    error.value = null

    try {
      const response = await axios.get<CurrencyApiResponse>(API_URL)
      const apiData = response.data

      // Проверяем, что ответ - это объект
      if (typeof apiData !== 'object' || apiData === null) {
        throw new Error('Invalid API response: not an object')
      }

      const newRates: RelevantExchangePairs = {}
      let missingPairs = false

      // Извлекаем только нужные нам пары
      REQUIRED_PAIRS.forEach((pairKey) => {
        if (typeof apiData[pairKey] === 'number') {
          newRates[pairKey] = apiData[pairKey]
        } else {
          console.warn(`Required pair "${pairKey}" not found or not a number in API response.`)
          missingPairs = true // Отмечаем, что не все данные получены
        }
      })

      // Если не хватает ключевых пар, кидаем ошибку
      if (missingPairs) {
        throw new Error(
          `One or more required currency pairs (${REQUIRED_PAIRS.join(', ')}) were missing in the API response.`,
        )
      }

      rates.value = newRates // Обновляем стейт новыми парами
      lastUpdated.value = Date.now()
    } catch (err) {
      console.error('Pinia: Failed to fetch or process currency rates:', err)
      const message = err instanceof Error ? err.message : 'Unknown error fetching rates'
      error.value = `Ошибка загрузки курсов: ${message}`
    } finally {
      loading.value = false
    }
  }

  return {
    baseCurrency,
    rates,
    lastUpdated,
    loading,
    error,
    ratesRelativeToBase,
    isCacheValid,
    setBaseCurrency,
    fetchRates,
  }
})
