<template>
  <rd-panel
    class="rd-panel"
    :label="data?._id ? 'Ubah material' : 'Tambah material'"
    :state="panelState"
    @exit="emits('exit')"
  >
    <div class="rd-panel-input-wrapper">
      <rd-input-text class="rd-panel-input" :input="nameInput" />
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
  import { InputOption } from "~~/interfaces/general";

  const props = defineProps<{
    state: "idle" | "hide";
    data?: Material;
  }>();
  const emits = defineEmits(["exit", "open-panel"]);
  const { materials, getMaterials, createMaterial, editMaterial } =
    useMaterial();

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

  const name: ComputedRef<string> = computed(() => nameInput.value.model);

  async function submit(): Promise<void> {
    loading.value = true;

    const payload: MaterialBody = {
      name: name.value,
    };
    if (props.data?._id) {
      const material: Material = await editMaterial({
        _id: props.data._id,
        data: payload,
      });
      if (material) panelState.value = "hide";
    } else {
      const materialId: string = await createMaterial(payload);
      if (materialId) panelState.value = "hide";
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
    await getMaterials();

    if (props.data?._id) {
      nameInput.value.model = props.data.name;
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
