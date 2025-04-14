// Коды валют, которые мы поддерживаем
export type SupportedCurrencyCode = 'RUB' | 'USD' | 'EUR'

export type CurrencyApiResponse = {
  [pair: string]: number // "usd-rub": 86.2752
}

// Структура для хранения нужных нам пар курсов в сторе
export interface RelevantExchangePairs {
  'usd-rub'?: number
  'eur-rub'?: number
  'rub-usd'?: number
  'eur-usd'?: number
  'rub-eur'?: number
  'usd-eur'?: number
}

export interface CurrencyOption {
  code: SupportedCurrencyCode
  name: string
}

export interface CurrencyState {
  baseCurrency: SupportedCurrencyCode // Наша базовая валюта приложения
  rates: RelevantExchangePairs // Сохраненные пары курсов
  lastUpdated: number | null // Время последнего успешного обновления
  loading: boolean // Идет ли загрузка
  error: string | null // Сообщение об ошибке
}
