<template>
  <rd-panel
    class="rd-panel"
    label="Filter data"
    :state="panelState"
    @exit="emits('exit')"
  >
    <div class="rd-panel-input-wrapper">
      <rd-input-text class="rd-panel-input" :input="recordInput" />
    </div>
    <div class="rd-panel-input-wrapper">
      <rd-input-date
        class="rd-panel-input"
        style="width: calc(50% - 0.375rem)"
        :input="startDateInput"
      />
      <rd-input-date
        class="rd-panel-input"
        style="width: calc(50% - 0.375rem)"
        :input="endDateInput"
      />
    </div>
    <div class="rd-panel-footer">
      <rd-input-button
        class="rd-panel-button"
        :label="'terapkan'"
        :loading="loading"
        @clicked="submit"
      />
    </div>
  </rd-panel>
</template>

<script lang="ts" setup>
  import { ComputedRef } from "vue";
  import { InputOption } from "~~/interfaces/general";

  const props = defineProps<{
    state: "idle" | "hide";
  }>();
  const emits = defineEmits(["exit", "open-panel"]);
  const { query, getScales } = useScale();

  const panelState = ref<"idle" | "hide">("idle");
  const panelLoading = ref<boolean>(true);

  const loading = ref<boolean>(false);

  const startDateInput = ref<InputOption>({
    name: "start_date",
    model: "",
    label: "Mulai",
    placeholder: "",
    disabled: false,
  });
  const endDateInput = ref<InputOption>({
    name: "end_date",
    model: "",
    label: "Sampai",
    placeholder: "",
    disabled: false,
  });
  const recordInput = ref<InputOption>({
    name: "record",
    model: "",
    label: "No. record",
    placeholder: "",
    disabled: false,
  });

  const record: ComputedRef<string> = computed(() => recordInput.value.model);
  const startDate: ComputedRef<string> = computed(
    () => startDateInput.value.value
  );
  const endDate: ComputedRef<string> = computed(() => endDateInput.value.value);

  async function submit(): Promise<void> {
    loading.value = true;

    query.value = {
      skip: 0,
      eol: false,
      record: record.value,
      start_date: startDate.value
        ? new Date(startDate.value).setHours(0, 0, 0, 0)
        : null,
      end_date: endDate.value
        ? new Date(endDate.value).setHours(23, 59, 59, 999)
        : null,
    };
    await getScales();

    panelState.value = "hide";
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
      gap: 0.75rem;
      .rd-panel-input {
        position: relative;
        width: 100%;
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
