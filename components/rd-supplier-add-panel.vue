<template>
  <rd-panel
    class="rd-panel"
    :label="data?._id ? 'Ubah supplier' : 'Tambah supplier'"
    :state="panelState"
    @exit="emits('exit')"
  >
    <div class="rd-panel-input-wrapper">
      <rd-input-text class="rd-panel-input" :input="nameInput" />
    </div>
    <div class="rd-panel-input-wrapper">
      <rd-input-text class="rd-panel-input" :input="emailInput" />
    </div>
    <div class="rd-panel-input-wrapper">
      <rd-input-text class="rd-panel-input" :input="phoneInput" />
    </div>
    <div class="rd-panel-input-wrapper">
      <rd-input-textarea class="rd-panel-input" :input="addressInput" />
    </div>
    <div class="rd-panel-footer">
      <rd-input-button
        class="rd-panel-button"
        :label="'simpan'"
        :disabled="!name"
        :loading="loading"
        @clicked="submit"
      />
    </div>
  </rd-panel>
</template>

<script lang="ts" setup>
  import { ComputedRef } from "vue";
  import { Supplier, SupplierBody } from "~~/interfaces/supplier";
  import { InputOption } from "~~/interfaces/general";

  const props = defineProps<{
    state: "idle" | "hide";
    data?: Supplier;
  }>();
  const emits = defineEmits(["exit", "open-panel"]);
  const { suppliers, getSuppliers, createSupplier, editSupplier } =
    useSupplier();

  const panelState = ref<"idle" | "hide">("idle");
  const panelLoading = ref<boolean>(true);

  const loading = ref<boolean>(false);

  const nameInput = ref<InputOption>({
    name: "name",
    model: "",
    label: "Nama",
    placeholder: "",
    disabled: false,
  });
  const emailInput = ref<InputOption>({
    name: "email",
    model: "",
    label: "Email",
    placeholder: "",
    type: "email",
    disabled: false,
  });
  const phoneInput = ref<InputOption>({
    name: "phone",
    model: "",
    label: "Telpon",
    placeholder: "",
    type: "tel",
    disabled: false,
  });
  const addressInput = ref<InputOption>({
    name: "address",
    model: "",
    label: "Alamat",
    placeholder: "",
    disabled: false,
  });

  const name: ComputedRef<string> = computed(() => nameInput.value.model);
  const email: ComputedRef<string> = computed(() => emailInput.value.model);
  const phone: ComputedRef<string> = computed(() => phoneInput.value.model);
  const address: ComputedRef<string> = computed(() => addressInput.value.model);

  async function submit(): Promise<void> {
    loading.value = true;

    const payload: SupplierBody = {
      name: name.value,
      email: email.value,
      phone: phone.value,
      address: address.value,
    };
    if (props.data?._id) {
      const supplier: Supplier = await editSupplier({
        _id: props.data._id,
        data: payload,
      });
      if (supplier) panelState.value = "hide";
    } else {
      const supplierId: string = await createSupplier(payload);
      if (supplierId) panelState.value = "hide";
    }

    loading.value = false;
  }

  watch(
    () => props.state,
    (val) => {
      panelState.value = val;
    }
  );

  onMounted(async () => {
    await getSuppliers();

    if (props.data?._id) {
      nameInput.value.model = props.data.name;
      if (props.data?.email) emailInput.value.model = props.data.email;
      if (props.data?.phone) phoneInput.value.model = props.data.phone;
      if (props.data?.address) addressInput.value.model = props.data.address;
    }

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
