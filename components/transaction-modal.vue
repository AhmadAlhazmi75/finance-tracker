<template>
  <UModal v-model="isModalOpen">
    <UCard>
      <template #header>Add Transaction</template>
      <UForm :state="state" :schema="schema" ref="form" @submit.prevent="save">
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
          v-if="state.type === 'Expense'"
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

        <UButton
          :loading="isLoading"
          type="submit"
          color="black"
          variant="solid"
          label="Save"
        />
      </UForm>
    </UCard>
  </UModal>
</template>

<script setup>
import { categories, transactionTypes } from "~/constants";
import { z } from "zod";
const props = defineProps({
  modelValue: Boolean,
});

const emit = defineEmits(["update:modelValue", "saved"]);

// this is the global schema for all of the elements of the form
const defaultSchema = z.object({
  created_at: z.string(),
  description: z.string().optional(),
  amount: z.number().positive("Amount needs to be more than zero"),
});

//here to specify the type of the transaction
const incomeSchema = z.object({
  type: z.literal("Income"),
});

// this means that the category is required when the type is Expense
const expenseSchema = z.object({
  type: z.literal("Expense"),
  category: z.enum(categories),
});

const investmentSchema = z.object({
  type: z.literal("Investment"),
});

const savingSchema = z.object({
  type: z.literal("Saving"),
});

const schema = z.intersection(
  z.discriminatedUnion("type", [
    incomeSchema,
    expenseSchema,
    investmentSchema,
    savingSchema,
  ]),
  defaultSchema
);

const form = ref();
const isLoading = ref(false);
const supabase = useSupabaseClient();
const { toastError, toastSuccess } = useAppToast();

const save = async () => {
  if (form?.value?.errors?.length) return;

  //save using upsert and using try catch
  isLoading.value = true;
  try {
    const { error } = await supabase
      .from("transactions")
      .upsert({ ...state.value });

    if (!error) {
      toastSuccess({ title: "Transaction saved" });

      isModalOpen.value = false;
      emit("saved");
      return;
    }
    throw error;
  } catch (e) {
    toastError({
      title: "Transaction not saved",
      description: e.message,
    });
  } finally {
    isLoading.value = false;
  }
};

const initialState = {
  type: undefined,
  amount: 0,
  created_at: undefined,
  description: undefined,
  category: undefined,
};
const state = ref({ ...initialState });

const resetForm = () => {
  Object.assign(state.value, initialState);
  form.value.$el
    .querySelectorAll("input")
    .forEach((input) => (input.value = ""));
};

const isModalOpen = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (!value) resetForm();

    emit("update:modelValue", value);
  },
});
</script>
