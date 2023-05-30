<template>
  <rd-panel
    class="rd-panel"
    :label="data.number"
    :state="panelState"
    :loading="panelLoading"
    @exit="emits('exit')"
  >
    <div v-if="!panelLoading" class="rd-panel-weighing-container">
      <div v-if="scale.status === 'weighing'" class="rd-panel-weighing-header">
        <rd-input-option
          class="rd-panel-weighing-source-input"
          :input="materialInput"
        />
        <rd-input-select
          class="rd-panel-weighing-source-input"
          :input="sourceInput"
        />
        <rd-input-button-small
          icon="plus"
          class="rd-panel-weighing-source-add"
          tooltip="tambah sumber"
          @clicked="openPanel({ type: 'source-add' })"
        />
      </div>
      <div v-else class="rd-panel-weighing-header">
        <div class="rd-panel-weighing-detail" style="width: 50%">
          <span class="rd-panel-weighing-placeholder rd-caption-text">{{
            scale.customer ? "Customer" : "Supplier"
          }}</span>
          <span class="rd-panel-weighing-value rd-headline-5">{{
            scale.customer ? scale.customer.name : scale.supplier?.name
          }}</span>
        </div>
        <div class="rd-panel-weighing-detail" style="width: 50%">
          <span class="rd-panel-weighing-placeholder rd-caption-text"
            >Penimbangan</span
          >
          <span class="rd-panel-weighing-value rd-headline-5">{{
            `${scale.data?.length || 0} kali`
          }}</span>
        </div>
      </div>
      <div class="rd-panel-weighing-body">
        <div class="rd-panel-weighing-value-container">
          <span class="rd-panel-weighing-value rd-headline-1">{{
            scale.status === "weighing"
              ? weight
              : (
                  scale?.data?.reduce((a, b) => a + b.weight, 0) || 0
                ).toLocaleString("de-DE")
          }}</span>
          <span class="rd-panel-weighing-placeholder rd-headline-5"
            >kilogram</span
          >
        </div>
        <rd-input-button-small
          v-if="scale.status === 'weighing'"
          icon="save"
          class="rd-panel-weighing-source-add"
          tooltip="simpan manual"
          type="primary"
          :loading="loading"
          :disabled="weight <= threshold || !source || !material"
          @clicked="submit"
          style="display: none;"
        />
        <rd-input-button-small
          v-else
          icon="printer"
          class="rd-panel-weighing-source-add"
          tooltip="cetak"
          type="primary"
          @clicked="printHandler"
        />
      </div>
    </div>
    <div v-if="!panelLoading" class="rd-panel-data-container">
      <div
        v-for="(data, i) in scale?.data || []"
        :key="data._id"
        class="rd-panel-data"
      >
        <div class="rd-panel-data-header">
          <div class="rd-panel-data-detail">
            <span
              class="rd-panel-data-value rd-headline-5"
              :style="`color: ${getColor(data.source._id)}`"
              >{{ `#${scale.data?.length - i}` }}</span
            >
            <span class="rd-panel-data-placeholer rd-caption-text">{{
              dateHandler(new Date(data.date))
            }}</span>
          </div>
          <div class="rd-panel-data-detail">
            <span
              class="rd-panel-data-value rd-headline-5"
              :style="`color: ${getColor(data.source._id)}`"
              >{{ data.source.name }}</span
            >
            <span class="rd-panel-data-placeholer rd-caption-text">{{
              data.material.name
            }}</span>
          </div>
        </div>
        <div class="rd-panel-data-body">
          <div class="rd-panel-data-value-container">
            <span class="rd-panel-data-value rd-headline-1">{{
              data.weight
            }}</span>
            <span class="rd-panel-data-placeholder rd-headline-5"
              >kilogram</span
            >
          </div>
          <rd-input-button-small
            v-if="scale.status === 'weighing'"
            icon="close"
            class="rd-panel-data-source-delete"
            tooltip="hapus data"
            @clicked="remove(data._id)"
          />
        </div>
      </div>
    </div>
    <div v-if="scale?.status === 'weighing'" class="rd-panel-footer">
      <rd-input-button
        class="rd-panel-button"
        :label="'selesai'"
        :disabled="!scale?.data?.length"
        :loading="finishLoading"
        @clicked="finish"
      />
    </div>
  </rd-panel>
</template>

<script lang="ts" setup>
  import { ComputedRef } from "vue";
  import { InputOption } from "~~/interfaces/general";
  import { Scale, ScaleDataBody } from "~~/interfaces/scale";
  import { Source } from "~~/interfaces/source";

  const props = defineProps<{
    state: "idle" | "hide";
    data: Scale;
  }>();
  const emits = defineEmits(["exit", "open-panel", "change-page"]);
  const { socketWeigh } = useSocket();
  const { sources, getSources } = useSource();
  const { materials, getMaterials } = useMaterial();
  const { threshold, addScaleData, removeScaleData, finishScale } = useScale();

  const panelState = ref<"idle" | "hide">("idle");
  const panelLoading = ref<boolean>(true);
  const ready = ref<boolean>(true);
  const stable = ref<boolean>(false);
  const loading = ref<boolean>(false);
  const finishLoading = ref<boolean>(false);

  const scale = ref<Scale>(null);

  const materialInput = ref<InputOption>({
    name: "material",
    model: "",
    placeholder: "Material",
    options: [],
  });
  const sourceInput = ref<InputOption>({
    name: "source",
    model: "",
    placeholder: "Sumber",
    options: [],
  });

  const weight = ref<number>(0);

  const source: ComputedRef<string> = computed(() => sourceInput.value.value);
  const material: ComputedRef<string> = computed(
    () => materialInput.value.value || materialInput.value.model
  );

  const months: string[] = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  function openPanel({ type, data }: { type: string; data?: any }) {
    emits("open-panel", {
      state: "show",
      type,
      data,
    });
  }

  function getColor(_id: string): string {
    let str: string = "#000";

    const source: Source = sources.value.find((a) => a._id === _id);
    if (source) {
      str = source.color;
    }

    return str;
  }

  async function submit(): Promise<void> {
    if (!loading.value) {
      loading.value = true;
      const material_id: string = materialInput.value.value;
      const payload: ScaleDataBody = {
        material_id,
        material_name: material.value,
        source_id: source.value,
        weight: weight.value,
      };
      ready.value = false;
      scale.value = await addScaleData({
        _id: props.data._id,
        data: payload,
      });
      loading.value = false;
    }
  }

  async function finish(): Promise<void> {
    if (!finishLoading.value) {
      finishLoading.value = true;
      scale.value = await finishScale({
        _id: props.data._id,
      });
      finishLoading.value = false;
      socketWeigh.value.emit("leave");
    }
  }

  async function remove(_id: string): Promise<void> {
    if (!panelLoading.value) {
      panelLoading.value = true;
      scale.value = await removeScaleData({
        scale_id: props.data._id,
        data_id: _id,
      });
      panelLoading.value = false;
      socketWeigh.value.emit("leave");
    }
  }

  function dateHandler(x: Date): string {
    const year: number = x.getFullYear();
    const month: number = x.getMonth();
    const date: number = x.getDate();
    const hours: number = x.getHours();
    const minutes: number = x.getMinutes();
    return `${date} ${months[month]} ${year} - ${hours
      .toString()
      .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  }
  function printHandler(): void {
    localStorage.setItem("scale-data", JSON.stringify(scale.value));
    panelState.value = "hide";
    emits("change-page", "/print");
  }

  watch(
    () => sources.value,
    (val) => {
      if (val?.length) {
        sourceInput.value.options = val.map((a) => ({
          name: a.type === "truck" ? a.license : a.name,
          value: a._id,
        }));
      }
    },
    { deep: true, immediate: true }
  );
  watch(
    () => materials.value,
    (val) => {
      if (val?.length) {
        materialInput.value.options = val.map((a) => ({
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
  watch(
    () => stable.value,
    (val) => {
      if (
        val &&
        weight.value >= threshold.value &&
        ready.value &&
        material.value &&
        source.value
      )
        submit();
    }
  );

  onMounted(async () => {
    scale.value = JSON.parse(JSON.stringify(props.data)) as Scale;
    await getSources();
    await getMaterials();
    if (props.data.status === "weighing") {
      socketWeigh.value.emit("start");
      socketWeigh.value.on("update", (payload) => {
        weight.value = payload.weight;
        stable.value = payload.stable;
        if (!ready.value && payload.weight <= threshold.value)
          ready.value = true;
      });
    }
    setTimeout(() => {
      panelLoading.value = false;
    }, 500);
  });

  onBeforeUnmount(() => {
    socketWeigh.value.emit("leave");
  });
</script>

<style lang="scss" scoped>
  .rd-panel {
    .rd-panel-weighing-container {
      position: relative;
      width: 100%;
      padding: 0.75rem;
      border-radius: 0.75rem;
      margin-bottom: 0.75rem;
      border: var(--border);
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      .rd-panel-weighing-header {
        z-index: 2;
        position: relative;
        width: 100%;
        height: 2rem;
        margin-bottom: 0.75rem;
        display: flex;
        justify-content: space-between;
        .rd-panel-weighing-source-input {
          width: calc((100% - 3.5rem) / 2);
        }
        .rd-panel-weighing-detail {
          position: relative;
          width: 20%;
          display: flex;
          flex-direction: column;
          span.rd-panel-weighing-placeholder {
            position: relative;
            margin-bottom: 0.125rem;
          }
        }
      }
      .rd-panel-weighing-body {
        z-index: 1;
        position: relative;
        width: 100%;
        height: 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .rd-panel-weighing-value-container {
          position: relative;
          display: flex;
          align-items: flex-end;
          span.rd-panel-weighing-value {
            position: relative;
            line-height: 1;
          }
          span.rd-panel-weighing-placeholder {
            position: relative;
            line-height: 1;
            margin: 0 0 0.125rem 0.25rem;
            opacity: 0.5;
          }
        }
      }
    }
    .rd-panel-data-container {
      z-index: 1;
      position: relative;
      width: 100%;
      display: flex;
      flex-direction: column;
      .rd-panel-data {
        position: relative;
        width: 100%;
        padding: 0.75rem;
        margin-bottom: 0.75rem;
        border-radius: 0.75rem;
        border: var(--border);
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        .rd-panel-data-header {
          z-index: 2;
          position: relative;
          width: 100%;
          height: 2rem;
          margin-bottom: 0.75rem;
          display: flex;
          justify-content: space-between;
          .rd-panel-data-detail {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            span.rd-panel-data-value {
              position: relative;
              text-align: left;
            }
            span.rd-panel-data-placeholder {
              position: relative;
              text-align: left;
              margin-top: 0.125rem;
            }
            &:nth-child(2n) {
              align-items: flex-end;
              span.rd-panel-data-value {
                text-align: right;
              }
              span.rd-panel-data-placeholder {
                text-align: right;
              }
            }
          }
          .rd-panel-data-source-input {
            width: calc((100% - 3.5rem) / 2);
          }
        }
        .rd-panel-data-body {
          z-index: 1;
          position: relative;
          width: 100%;
          height: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .rd-panel-data-value-container {
            position: relative;
            display: flex;
            align-items: flex-end;
            span.rd-panel-data-value {
              position: relative;
              line-height: 1;
            }
            span.rd-panel-data-placeholder {
              position: relative;
              line-height: 1;
              margin: 0 0 0.125rem 0.25rem;
              opacity: 0.5;
            }
          }
        }
        &:last-child {
          margin-bottom: 7rem;
        }
      }
    }
    .rd-panel-footer {
      z-index: 2;
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
