// Currency conversion utilities

export const convertCurrency = (amountInEUR, fromCurrency, toCurrency, exchangeRates) => {
  console.log('=== Simple Currency Conversion ===');
  console.log('Amount in EUR:', amountInEUR);
  console.log('Target currency:', toCurrency);
  console.log('Exchange rates:', exchangeRates);
  
  if (!amountInEUR || !exchangeRates) {
    console.log('Returning original amount:', amountInEUR);
    return amountInEUR;
  }

  // If target currency is EUR, return as is
  if (toCurrency === 'EUR') {
    console.log('Target is EUR, returning original amount:', amountInEUR);
    return amountInEUR;
  }

  // Get the rate for target currency (all rates are EUR-based)
  const rates = exchangeRates.rates || exchangeRates;
  const rate = rates[toCurrency] || 1;
  
  // Simple multiplication: EUR amount * rate = target currency amount
  const convertedAmount = amountInEUR * rate;
  
  console.log(`Converting ${amountInEUR} EUR to ${toCurrency}: ${amountInEUR} * ${rate} = ${convertedAmount}`);
  console.log('=== End Simple Currency Conversion ===');
  
  return convertedAmount;
};

export const formatCurrency = (amount, currency) => {
  if (!amount && amount !== 0) return '0.00';
  
  const currencyInfo = supportedCurrencies.find(c => c.code === currency);
  const symbol = currencyInfo?.symbol || currency;
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // Fallback formatting if currency is not supported by Intl
    return `${symbol}${Number(amount).toFixed(2)}`;
  }
};

// Supported currencies from Frankfurter API
export const supportedCurrencies = [
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },

  // { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  // { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  // { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
  // { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  // { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪' },
  // { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴' },
  // { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  // { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
  // { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰' },
  // { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿' },
  // { code: 'MXN', name: 'Mexican Peso', symbol: '$', flag: '🇲🇽' },
  // { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
  // { code: 'RUB', name: 'Russian Ruble', symbol: '₽', flag: '🇷🇺' },
  // { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', flag: '🇵🇱' },
  // { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', flag: '🇨🇿' },
  // { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', flag: '🇭🇺' },
  // { code: 'BGN', name: 'Bulgarian Lev', symbol: 'лв', flag: '🇧🇬' },
  // { code: 'RON', name: 'Romanian Leu', symbol: 'lei', flag: '🇷🇴' },
  // { code: 'DKK', name: 'Danish Krone', symbol: 'kr', flag: '🇩🇰' },
  // { code: 'ISK', name: 'Icelandic Krona', symbol: 'kr', flag: '🇮🇸' },
  // { code: 'PHP', name: 'Philippine Peso', symbol: '₱', flag: '🇵🇭' },
  // { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾' },
  // { code: 'THB', name: 'Thai Baht', symbol: '฿', flag: '🇹🇭' },
  // { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩' },
  // { code: 'ILS', name: 'Israeli Shekel', symbol: '₪', flag: '🇮🇱' },
];

// export const supportedLanguages = [
//   { code: 'en', name: 'English', flag: '🇺🇸' },
//   { code: 'es', name: 'Español', flag: '🇪🇸' },
//   { code: 'fr', name: 'Français', flag: '🇫🇷' },
//   { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
//   { code: 'it', name: 'Italiano', flag: '🇮🇹' },
//   { code: 'pt', name: 'Português', flag: '🇵🇹' },
//   { code: 'zh', name: '中文', flag: '🇨🇳' },
//   { code: 'ja', name: '日本語', flag: '🇯🇵' },
//   { code: 'ko', name: '한국어', flag: '🇰🇷' },
//   { code: 'ar', name: 'العربية', flag: '🇸🇦' },
//   { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
//   { code: 'ru', name: 'Русский', flag: '🇷🇺' },
// ];

export const supportedLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸' }, // USA
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },  // Turkish (TRY)
  { code: 'pt', name: 'Português', flag: '🇪🇺' }, // Portuguese (EU)
  { code: 'ja', name: 'Japanese 日本語', flag: '🇯🇵' },  // Japanese (JPY)
  { code: 'ko', name: 'Korean 한국어', flag: '🇰🇷' },  // Korean (KRW)
];