<template>
  <rd-panel
    class="rd-panel"
    label="Sesi baru"
    :state="panelState"
    @exit="emits('exit')"
  >
    <div class="rd-panel-input-wrapper">
      <rd-input-select class="rd-panel-input" :input="typeInput" />
    </div>
    <div class="rd-panel-input-wrapper">
      <rd-input-text class="rd-panel-input" :input="nameInput" />
    </div>
    <div class="rd-panel-input-wrapper">
      <rd-input-text class="rd-panel-input" :input="licenseInput" />
    </div>
    <div class="rd-panel-input-wrapper">
      <rd-input-select class="rd-panel-input" :input="customerInput" />
    </div>
    <div class="rd-panel-input-wrapper">
      <rd-input-select class="rd-panel-input" :input="supplierInput" />
    </div>
    <span class="rd-panel-label rd-headline-6">Warna label</span>
    <div class="rd-panel-color-wrapper">
      <div
        v-for="i in colors"
        @click="color = i"
        :style="`background-color: ${i}; border-color: ${i}`"
        :class="color === i ? 'rd-panel-color-active' : ''"
        :key="i"
        class="rd-panel-color"
      ></div>
    </div>
    <div class="rd-panel-footer">
      <rd-input-button
        class="rd-panel-button"
        :label="'simpan'"
        :disabled="!type || !name || !color"
        :loading="loading"
        @clicked="submit"
      />
    </div>
  </rd-panel>
</template>

<script lang="ts" setup>
  import { ComputedRef } from "vue";
  import { InputGeneric, InputOption } from "~~/interfaces/general";
  import { SourceBody } from "~~/interfaces/source";

  const props = defineProps<{
    state: "idle" | "hide";
  }>();
  const emits = defineEmits(["exit", "open-panel"]);
  const { customers, getCustomers } = useCustomer();
  const { suppliers, getSuppliers } = useSupplier();
  const { createSource } = useSource();

  const panelState = ref<"idle" | "hide">("idle");
  const loading = ref<boolean>(false);

  const typeInput = ref<InputGeneric<"truck" | "any">>({
    name: "type",
    model: "",
    label: "Tipe sumber",
    placeholder: "",
    options: [
      {
        name: "Kendaraan",
        value: "truck",
      },
      {
        name: "Lainya",
        value: "any",
      },
    ],
    disabled: false,
  });
  const nameInput = ref<InputOption>({
    name: "name",
    model: "",
    label: "Nama sumber",
    placeholder: "",
    disabled: false,
  });
  const licenseInput = ref<InputOption>({
    name: "",
    model: "",
    label: "Plat nomor",
    placeholder: "",
    disabled: true,
  });
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

  const color = ref<string>("");

  const name: ComputedRef<string> = computed(() => nameInput.value.model);
  const type: ComputedRef<"truck" | "any"> = computed(
    () => typeInput.value.value
  );
  const license: ComputedRef<string> = computed(() => licenseInput.value.model);
  const customer: ComputedRef<string> = computed(
    () => customerInput.value.value || customerInput.value.model
  );
  const supplier: ComputedRef<string> = computed(
    () => supplierInput.value.value || supplierInput.value.model
  );

  const colors: string[] = [
    "#0C0A3E",
    "#7B1E7A",
    "#B33F62",
    "#F9564F",
    "#2E86AB",
    "#00D9C0",
    "#A57548",
    "#482728",
    "#002500",
    "#5296A5",
    "#D30C7B",
    "#8D99AE",
    "#AFA060",
    "#3A2D32",
    "#00635D",
  ];

  async function submit(): Promise<void> {
    loading.value = true;

    const payload: SourceBody = {
      name: name.value,
      type: type.value,
      license: license.value,
      customer_id: customer.value,
      supplier_id: supplier.value,
      color: color.value,
    };

    const scaleId: string = await createSource(payload);

    loading.value = false;

    if (scaleId) panelState.value = "hide";
  }

  watch(
    () => props.state,
    (val) => {
      panelState.value = val;
    }
  );

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
    () => type.value,
    (val) => {
      if (val === "truck") {
        licenseInput.value.disabled = false;
      } else {
        licenseInput.value.disabled = true;
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

  onMounted(async () => {
    await getCustomers();
    await getSuppliers();
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
    span.rd-panel-label {
      position: relative;
      width: 100%;
      height: 1rem;
      opacity: 0.5;
      display: flex;
      align-items: center;
    }
    .rd-panel-color-wrapper {
      position: relative;
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      .rd-panel-color {
        cursor: pointer;
        position: relative;
        width: calc((100% - 4rem) / 8);
        height: 1.5rem;
        border-radius: 0.35rem;
        &.rd-panel-color-active::before {
          content: "";
          position: absolute;
          top: -4px;
          left: -4px;
          width: calc(100% + 8px);
          height: calc(100% + 8px);
          border-radius: 0.5rem;
          border: 2px solid;
          border-color: inherit;
          box-sizing: border-box;
        }
      }
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
