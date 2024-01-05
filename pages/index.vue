<template>
  <section class="flex items-center justify-between mb-10">
    <h1 class="text-4xl font-extrabold">Summary</h1>
    <div>
      <USelectMenu :options="transactionViewOptions" v-model="selectedView" />
    </div>
  </section>

  <section
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10"
  >
    <Trend
      color="green"
      title="Income"
      :amount="income"
      :last-amount="3000"
      :loading="isLoading"
    />
    <Trend
      color="red"
      title="Expense"
      :amount="expense"
      :last-amount="5000"
      :loading="isLoading"
    />
    <Trend
      color="green"
      title="Investments"
      :amount="4000"
      :last-amount="3000"
      :loading="isLoading"
    />
    <Trend
      color="red"
      title="Saving"
      :amount="4000"
      :last-amount="4100"
      :loading="isLoading"
    />
  </section>

  <section class="flex justify-between mb-10">
    <div>
      <h2 class="text-2xl font-extrabold">Transactions</h2>
      <div class="text-gray-500 dark:text-gray-400">
        You have {{ incomeCount }} incomes and {{ expenseCount }} expenses this
        period
      </div>
    </div>
    <div>
      <UButton
        icon="i-heroicons-plus-circle"
        color="white"
        variant="solid"
        label="Add"
      />
    </div>
  </section>

  <section v-if="!isLoading">
    <div
      v-for="(transactionsOnDay, date) in transactionsGroupedByDate"
      :key="date"
      class="mb-10"
    >
      <DailyTransactionSummary :date="date" :transactions="transactionsOnDay" />
      <Transaction
        v-for="transaction in transactionsOnDay"
        :key="transaction.id"
        :transaction="transaction"
        @deleted="refreshTransactions()"
      />
    </div>
  </section>
  <section v-else>
    <USkeleton class="h-8 w-full mb-2" v-for="i in 4" :key="i" />
  </section>
</template>

<script setup>
import { transactionViewOptions } from "~/constants";

const selectedView = ref(transactionViewOptions[1]);
const transactions = ref([]);
const supabase = useSupabaseClient();
const isLoading = ref(false);

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
  isLoading.value = true;
  try {
    const { data } = await useAsyncData("transactions", async () => {
      const { data, error } = await supabase.from("transactions").select("*");
      if (error) return [];
      return data;
    });
    return data.value;
  } finally {
    isLoading.value = false;
  }
};

const refreshTransactions = async () => {
  transactions.value = await fetchTransactions();
};

await refreshTransactions();

// transactions.value = await fetchTransactions();

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
</script>
