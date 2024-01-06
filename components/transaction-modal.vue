<template>
  <UModal v-model="isModalOpen">
    <UCard>
      <template #header>Add Transaction</template>
      <UForm :state="state">
        <UFormGroup
          :required="true"
          label="Transaction type"
          name="type"
          class="mb-4"
        >
          <USelect
            v-model="state.type"
            placeholder="Select the transaction type"
            :options="transactionTypes"
          />
        </UFormGroup>

        <UFormGroup label="Amount" :required="true" name="amount" class="mb-4">
          <UInput
            v-model.number="state.amount"
            type="number"
            placeholder="Amount"
          />
        </UFormGroup>

        <UFormGroup
          label="Transaction date"
          :required="true"
          name="created_at"
          class="mb-4"
        >
          <UInput
            v-model="state.created_at"
            type="date"
            icon="i-heroicons-calendar-days-20-solid"
          />
        </UFormGroup>

        <UFormGroup
          label="Description"
          hint="Optional"
          name="description"
          class="mb-4"
        >
          <UInput v-model="state.description" placeholder="Description" />
        </UFormGroup>

        <UFormGroup
          :required="true"
          label="Category"
          name="Category"
          class="mb-4"
        >
          <USelect
            v-model="state.category"
            placeholder="Category"
            :options="categories"
          />
        </UFormGroup>

        <UButton type="submit" color="black" variant="solid" label="Save" />
      </UForm>
    </UCard>
  </UModal>
</template>

<script setup>
import { categories, transactionTypes } from "~/constants";
const props = defineProps({
  modelValue: Boolean,
});

const emit = defineEmits(["update:modelValue"]);

const state = ref({
  type: undefined,
  amount: 0,
  created_at: undefined,
  description: undefined,
  category: undefined,
});

const isModalOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>
