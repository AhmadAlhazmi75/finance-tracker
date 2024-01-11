export const useCurrency = (amount) => {
  const formattedAmount = computed(() => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "EUR",
    }).format(isRef(amount) ? amount.value : amount);
  });

  const currency = ref(formattedAmount.value);

  watch(formattedAmount, (newVal) => {
    currency.value = newVal;
  });

  return {
    currency,
  };
};
