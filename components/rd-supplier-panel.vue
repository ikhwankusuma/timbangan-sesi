<template>
  <rd-panel
    class="rd-panel"
    label="List supplier"
    :state="panelState"
    @exit="emits('exit')"
  >
    <div
      v-for="supplier in suppliers"
      :key="supplier._id"
      class="rd-panel-supplier"
    >
      <div class="rd-panel-supplier-details-container">
        <span class="rd-panel-supplier-name rd-headline-5">{{
          supplier.name
        }}</span>
        <span
          v-if="supplier.address || supplier.email || supplier.phone"
          class="rd-panel-supplier-description rd-caption-text"
          >{{ supplier.address || supplier.email || supplier.phone }}</span
        >
      </div>
      <rd-input-button-small
        icon="eye"
        tooltip="Lihat"
        @clicked="
          emits('open-panel', {
            type: 'supplier-add',
            state: 'show',
            data: supplier,
          })
        "
      />
    </div>
    <div class="rd-panel-footer">
      <rd-input-button
        label="Tambah supplier"
        type="secondary"
        class="rd-panel-button"
        @clicked="
          emits('open-panel', {
            type: 'supplier-add',
            state: 'show',
          })
        "
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
  const { suppliers, getSuppliers } = useSupplier();

  const panelState = ref<"idle" | "hide">("idle");
  const panelLoading = ref<boolean>(true);

  const loading = ref<boolean>(false);

  function clickHandler(action: string): void {
    emits("open-panel", {
      state: "show",
      type: action,
    });
  }

  watch(
    () => props.state,
    (val) => {
      panelState.value = val;
    }
  );

  onMounted(async () => {
    await getSuppliers();
    setTimeout(() => {
      panelLoading.value = false;
    }, 500);
  });
</script>

<style lang="scss" scoped>
  .rd-panel {
    .rd-panel-supplier {
      cursor: pointer;
      position: relative;
      width: 100%;
      padding: 0.5rem;
      border: var(--border);
      border-radius: 0.75rem;
      margin-bottom: 0.75rem;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .rd-panel-supplier-details-container {
        position: relative;
        height: 100%;
        margin-left: 0.5rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        span.rd-panel-supplier-description {
          position: relative;
          margin-top: 0.125rem;
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
