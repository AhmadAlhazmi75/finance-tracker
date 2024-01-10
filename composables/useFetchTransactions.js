export const useFetchTransactions = (period) => {
  const transactions = ref([]);
  const pending = ref(false);
  const supabase = useSupabaseClient();

  const income = computed(() => {
    let sum = 0;
    for (const transaction of transactions.value) {
      if (transaction.type === "Income") {
        sum += transaction.amount;
      }
    }
    return sum;
  });

  const incomeCount = computed(() => {
    let count = 0;
    for (const transaction of transactions.value) {
      if (transaction.type === "Income") {
        count++;
      }
    }
    return count;
  });

  const expense = computed(() => {
    let sum = 0;
    for (const transaction of transactions.value) {
      if (transaction.type === "Expense") {
        sum += transaction.amount;
      }
    }
    return sum;
  });

  const expenseCount = computed(() => {
    let count = 0;
    for (const transaction of transactions.value) {
      if (transaction.type === "Expense") {
        count++;
      }
    }
    return count;
  });

  const fetchTransactions = async () => {
    pending.value = true;
    try {
      const { data } = await useAsyncData(
        `transactions-${period.value.from.toDateString()}-${period.value.to.toDateString()}`,
        async () => {
          const { data, error } = await supabase
            .from("transactions")
            .select()
            .gte("created_at", period.value.from.toISOString())
            .lte("created_at", period.value.to.toISOString())
            .order("created_at", { ascending: false });
          if (error) return [];
          return data;
        }
      );
      return data.value;
    } finally {
      pending.value = false;
    }
  };

  const refresh = async () => {
    transactions.value = await fetchTransactions();
  };

  watch(period, async () => {
    await refresh();
  });

  const transactionsGroupedByDate = computed(() => {
    let grouped = {};

    for (const transaction of transactions.value) {
      const date = new Date(transaction.created_at).toISOString().split("T")[0];
      //if at this date there is no transaction, an empty array will be created because there is no transactions at that date
      if (!grouped[date]) {
        grouped[date] = [];
      }
      //else take every transaction and push it to the array
      grouped[date].push(transaction);
    }

    return grouped;
  });

  return {
    transactions: {
      all: transactions,
      grouped: {
        byDate: transactionsGroupedByDate,
      },
      income,
      incomeCount,
      expense,
      expenseCount,
    },
    refresh,
    pending,
  };
};
