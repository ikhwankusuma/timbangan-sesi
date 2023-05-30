<template>
  <rd-panel
    class="rd-panel"
    label="Pengaturan program"
    :state="panelState"
    @exit="emits('exit')"
  >
    <div class="rd-panel-input-wrapper">
      <rd-input-text class="rd-panel-input" :input="thresholdInput" />
    </div>
    <div class="rd-panel-input-wrapper">
      <rd-input-text class="rd-panel-input" :input="nameInput" />
    </div>
    <div class="rd-panel-input-wrapper">
      <rd-input-text class="rd-panel-input" :input="phoneInput" />
    </div>
    <div class="rd-panel-input-wrapper">
      <rd-input-text class="rd-panel-input" :input="emailInput" />
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
  import { Material, MaterialBody } from "~~/interfaces/material";
  import { Config, InputOption } from "~~/interfaces/general";

  const props = defineProps<{
    state: "idle" | "hide";
    data?: Material;
  }>();
  const emits = defineEmits(["exit", "open-panel"]);
  const { config, updateConfig } = useMain();
  const { threshold: currentThreshold, setThreshold } = useScale();

  const panelState = ref<"idle" | "hide">("idle");
  const panelLoading = ref<boolean>(true);

  const loading = ref<boolean>(false);

  const thresholdInput = ref<InputOption>({
    name: "threshold",
    model: "",
    label: "Batas minimum",
    placeholder: "",
    type: "number",
    disabled: false,
  });
  const nameInput = ref<InputOption>({
    name: "name",
    model: "",
    label: "Nama",
    placeholder: "",
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
  const emailInput = ref<InputOption>({
    name: "email",
    model: "",
    label: "Email",
    placeholder: "",
    type: "email",
    disabled: false,
  });
  const addressInput = ref<InputOption>({
    name: "address",
    model: "",
    label: "Alamat",
    placeholder: "",
    disabled: false,
  });

  const threshold: ComputedRef<string> = computed(
    () => thresholdInput.value.model
  );
  const name: ComputedRef<string> = computed(() => nameInput.value.model);
  const phone: ComputedRef<string> = computed(() => phoneInput.value.model);
  const email: ComputedRef<string> = computed(() => emailInput.value.model);
  const address: ComputedRef<string> = computed(() => addressInput.value.model);

  async function submit(): Promise<void> {
    loading.value = true;

    setThreshold({ threshold: parseInt(threshold.value.split(".").join("")) });
    const payload: Config = {
      status: config.value.status,
      name: name.value,
      phone: phone.value,
      email: email.value,
      address: address.value,
    };

    await updateConfig(payload);

    panelState.value = "hide";

    loading.value = false;
  }

  watch(
    () => props.state,
    (val) => {
      panelState.value = val;
    }
  );

  onMounted(() => {
    if (config.value) {
      thresholdInput.value.model = currentThreshold.value.toString();
      nameInput.value.model = config.value.name;
      if (config.value.phone) phoneInput.value.model = config.value.phone;
      if (config.value.email) emailInput.value.model = config.value.email;
      if (config.value.address) addressInput.value.model = config.value.address;
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
