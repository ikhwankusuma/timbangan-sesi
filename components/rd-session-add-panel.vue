<template>
  <rd-panel
    class="rd-panel"
    label="Sesi baru"
    :state="panelState"
    @exit="emits('exit')"
  >
    <div class="rd-panel-input-wrapper">
      <rd-input-option class="rd-panel-input" :input="customerInput" />
    </div>
    <div class="rd-panel-input-wrapper">
      <rd-input-option class="rd-panel-input" :input="supplierInput" />
    </div>
    <div class="rd-panel-input-wrapper">
      <rd-input-textarea class="rd-panel-input" :input="noteInput" />
    </div>
    <div class="rd-panel-footer">
      <rd-input-button
        class="rd-panel-button"
        :label="'simpan'"
        :disabled="!customer && !supplier"
        :loading="loading"
        @clicked="submit"
      />
    </div>
  </rd-panel>
</template>

<script lang="ts" setup>
  import { ComputedRef } from "vue";
  import { InputOption } from "~~/interfaces/general";
  import { ScaleBody } from "~~/interfaces/scale";

  const props = defineProps<{
    state: "idle" | "hide";
  }>();
  const emits = defineEmits(["exit", "open-panel"]);
  const { socketWeigh } = useSocket();
  const { createScale } = useScale();
  const { customers, getCustomers } = useCustomer();
  const { suppliers, getSuppliers } = useSupplier();

  const panelState = ref<"idle" | "hide">("idle");
  const panelLoading = ref<boolean>(true);

  const loading = ref<boolean>(false);

  const customerInput = ref<InputOption>({
    name: "customer",
    model: "",
    label: "Customer",
    placeholder: "",
    options: [],
    disabled: false,
  });
  const supplierInput = ref<InputOption>({
    name: "supplier",
    model: "",
    label: "Supplier",
    placeholder: "",
    options: [],
    disabled: false,
  });
  const noteInput = ref<InputOption>({
    name: "note",
    model: "",
    label: "Note",
    placeholder: "",
    disabled: false,
  });

  const customer: ComputedRef<string> = computed(
    () => customerInput.value.value || customerInput.value.model
  );
  const supplier: ComputedRef<string> = computed(
    () => supplierInput.value.value || supplierInput.value.model
  );
  const note: ComputedRef<string> = computed(
    () => noteInput.value.model
  )

  async function submit(): Promise<void> {
    loading.value = true;

    const customer_id: string = customerInput.value.value || "";
    const customer_name: string = customerInput.value.model;
    const supplier_id: string = supplierInput.value.value || "";
    const supplier_name: string = supplierInput.value.model;

    const payload: ScaleBody = {
      customer_id,
      customer_name,
      supplier_id,
      supplier_name,
      note: note.value
    };

    const scaleId: string = await createScale(payload);

    loading.value = false;

    if (scaleId) panelState.value = "hide";
  }

  watch(
    () => customer.value,
    (val) => {
      if (val) {
        customerInput.value.disabled = false;
        supplierInput.value.disabled = true;
      } else if (!val && !supplier.value) {
        supplierInput.value.disabled = false;
        customerInput.value.disabled = false;
      }
    }
  );
  watch(
    () => supplier.value,
    (val) => {
      if (val) {
        customerInput.value.disabled = true;
        supplierInput.value.disabled = false;
      } else if (!val && !supplier.value) {
        supplierInput.value.disabled = false;
        customerInput.value.disabled = false;
      }
    }
  );

  watch(
    () => customers.value,
    (val) => {
      if (val?.length) {
        customerInput.value.options = val.map((a) => ({
          name: a.name,
          value: a._id,
        }));
      }
    },
    { deep: true, immediate: true }
  );
  watch(
    () => suppliers.value,
    (val) => {
      if (val?.length) {
        supplierInput.value.options = val.map((a) => ({
          name: a.name,
          value: a._id,
        }));
      }
    },
    { deep: true, immediate: true }
  );
  watch(
    () => props.state,
    (val) => {
      panelState.value = val;
    }
  );

  onMounted(async () => {
    await getCustomers();
    await getSuppliers();
    setTimeout(() => {
      panelLoading.value = false;
    }, 500);
  });
</script>

<style lang="scss" scoped>
  .rd-panel {
    .rd-panel-input-wrapper {
      position: relative;
      width: 100%;
      margin-bottom: 1rem;
      display: flex;
      flex-direction: column;
    }
    .rd-panel-footer {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 6rem;
      background: var(--background-depth-one-color);
      padding: 2rem;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
      .rd-panel-button {
        width: 100%;
      }
      &::after {
        content: "";
        position: absolute;
        bottom: 100%;
        left: 0;
        width: 100%;
        height: 1px;
        background: var(--border-color);
      }
    }
  }
</style>
