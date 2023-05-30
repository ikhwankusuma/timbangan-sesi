<template>
  <div class="rd-container" ref="rdContainer">
    <div class="rd-page">
      <div class="rd-header">
        <span class="rd-session-name">{{ config?.name }}</span>
        <span class="rd-session-firm">{{ data?.number }}</span>
        <span class="rd-session-value">{{
          `${dateHandler(new Date(data?.start_date))} s/d ${dateHandler(new Date(data?.end_date))}`
        }}</span>
      </div>
      <div class="rd-body">
        <div
          class="rd-data-row"
          v-for="n in Math.ceil((data?.data?.length || 0) / 10)"
          :key="n"
        >
          <div
            class="rd-data-column"
            v-for="m in 10"
            :key="m"
            :style="!!data?.data?.[n * 10 - (11 - m)] ? '' : 'opacity: 0.5'"
          >
            <span v-if="data?.data?.[n * 10 - (11 - m)]" class="rd-data-value">{{
              data?.data?.[n * 10 - (11 - m)]?.weight
            }}</span>
            <!-- <span class="rd-data-time">{{
              data?.data?.[n * 25 - (26 - m)]
                ? timeHandler(new Date(data?.data?.[n * 25 - (26 - m)]?.date))
                : ""
            }}</span> -->
          </div>
        </div>
      </div>
      <div class="rd-footer">
        <div class="rd-session-detail">
          <span class="rd-session-placeholder">Total</span>
          <span class="rd-session-value" style="font-size: 14px">{{
            `${(
              data?.data?.reduce((a, b) => a + b.weight, 0) || 0
            ).toLocaleString("de-DE")} kg`
          }}</span>
        </div>
        <div class="rd-session-detail">
          <span class="rd-session-placeholder">Penimbangan</span>
          <span class="rd-session-value" style="font-size: 14px">{{
            `${(
              data?.data?.length || 0
            )} kali`
          }}</span>
        </div>
        <div class="rd-session-detail">
          <span class="rd-session-placeholder">{{
            data?.customer ? "Customer" : "Supplier"
          }}</span>
          <span class="rd-session-value">{{
            `${data?.customer?.name || data?.supplier?.name}`
          }}</span>
        </div>
        <div v-if="data?.note" class="rd-session-detail">
          <span class="rd-session-placeholder">Note</span>
          <span class="rd-session-value">{{
            data.note
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ComputedRef } from "vue";
  import { Scale } from "~~/interfaces/scale";
  import { Source } from "~~/interfaces/source";

  const emits = defineEmits(["change-page"]);

  const { viewMode, config } = useMain();
  const { sources, getSources } = useSource();

  const data = ref<Scale>(null);

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

  function dateHandler(x: Date): string {
    const year: number = x.getFullYear();
    const month: number = x.getMonth();
    const date: number = x.getDate();
    const hours: number = x.getHours();
    const minutes: number = x.getMinutes();
    return `${date.toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}/${year} ${hours
      .toString()
      .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  }
  function timeHandler(x: Date): string {
    const hours: number = x.getHours();
    const minutes: number = x.getMinutes();
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  }

  function getColor(_id: string): string {
    let str: string = "#000";

    const source: Source = sources.value?.find((a) => a._id === _id);
    if (source) {
      str = source.color;
    }

    return str;
  }

  const source_id: ComputedRef<string[]> = computed(() =>
    data.value?.data?.reduce((b, c): string[] => {
      if (b.includes(c.source?._id)) return b;
      return [...b, c.source?._id];
    }, [])
  );
  const source: ComputedRef<Source[]> = computed(
    () =>
      sources.value?.filter((a) => {
        return source_id.value?.includes(a._id) || false;
      }) || []
  );

  watch(
    () => source.value,
    (val) => {
      if (val?.length) {
        setTimeout(() => {
          window.print();
          localStorage.removeItem("scale-data");
          if (viewMode.value === "mobile") emits("change-page", "/");
        }, 1000);
      }
    }
  );

  onMounted(async () => {
    try {
      await getSources();
      const rawData: string = localStorage.getItem("scale-data");
      if (rawData) {
        data.value = JSON.parse(rawData) as Scale;
        data.value.data = data.value.data.reverse()
      } else throw new Error("NO_DATA");
    } catch (e) {
      emits("change-page", "/");
    }
  });
</script>

<style lang="scss" scoped>
  .rd-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow-y: auto;
    background: var(--background-depth-one-color);
    display: flex;
    justify-content: center;
    align-items: flex-start;
    *::-webkit-scrollbar {
      display: none;
    }
    .rd-page {
      position: relative;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      span {
        font-size: 12px;
        font-weight: 900;
        font-family: 'consolas', monospace;
      }
      .rd-header,
      .rd-footer {
        position: relative;
        width: 100%;
        padding: 0.5cm 0;
        box-sizing: border-box;
        display: flex;
        gap: 0.25cm;
        flex-shrink: 0;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        .rd-session-detail {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          span {
            text-align: left;
          }
          span.rd-session-firm {
            position: relative;
            margin-top: 0.125cm;
          }
          span.rd-session-placeholder {
            position: relative;
            margin-bottom: 0.125cm;
          }
        }
        .rd-session-sources {
          position: absolute;
          left: 50%;
          width: 50%;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          transform: translateX(-50%);
          .rd-session-source {
            position: relative;
            margin: 0 0.5rem;
          }
        }
      }
      .rd-body {
        position: relative;
        width: 100%;
        border-top: 1px solid #000;
        border-left: 1px solid #000;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        .rd-data-row {
          position: relative;
          width: 100%;
          display: flex;
          flex-shrink: 1;
          .rd-data-column {
            position: relative;
            width: 100%;
            border-right: 1px solid #000;
            border-bottom: 1px solid #000;
            padding: 0.125cm 0;
            box-sizing: border-box;
            display: flex;
            flex-shrink: 1;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            span {
              font-family: "consolas", monospace;
              text-align: center;
            }
          }
        }
      }
    }
  }
</style>
