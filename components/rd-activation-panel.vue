<template>
  <rd-panel
    class="rd-panel"
    label="Aktivasi"
    :state="panelState"
    @exit="emits('exit')"
  >
    <div class="rd-panel-input-wrapper">
      <rd-input-text class="rd-panel-input" :input="keyInput" />
    </div>
    <div class="rd-panel-footer">
      <rd-input-button
        class="rd-panel-button"
        :label="'aktifkan'"
        :disabled="!key"
        :loading="loading"
        @clicked="submit"
      />
    </div>
  </rd-panel>
</template>

<script lang="ts" setup>
  import { ComputedRef } from "vue";
  import { Config, InputOption } from "~~/interfaces/general";

  const props = defineProps<{
    state: "idle" | "hide";
  }>();
  const emits = defineEmits(["exit", "open-panel"]);
  const { config, updateConfig } = useMain();

  const panelState = ref<"idle" | "hide">("idle");
  const panelLoading = ref<boolean>(true);

  const loading = ref<boolean>(false);

  const keyInput = ref<InputOption>({
    name: "key",
    model: "",
    label: "Serial key",
    placeholder: "",
    disabled: false,
  });

  const key: ComputedRef<string> = computed(() => keyInput.value.model);

  async function submit(): Promise<void> {
    loading.value = true;

    const payload: Config = {
      password: key.value,
    };
    const config: Config = await updateConfig(payload);
    if (config) panelState.value = "hide";

    loading.value = false;
  }

  watch(
    () => props.state,
    (val) => {
      panelState.value = val;
    }
  );
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
