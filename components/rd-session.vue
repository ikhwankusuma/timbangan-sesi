<template>
  <div class="rd-component">
    <div class="rd-session-details-container">
      <div class="rd-session-detail-container">
        <span class="rd-session-number rd-headline-5">{{ data.number }}</span>
        <span
          class="rd-session-status rd-headline-6"
          :class="`rd-session-status-${data.status}`"
          >{{ data.status }}</span
        >
      </div>
      <div class="rd-session-actions-container">
        <rd-input-button-small
          :icon="data.status === 'weighing' ? 'arrow-right' : 'eye'"
          @clicked="openPanel"
          :tooltip="data.status === 'weighing' ? 'Lanjutkan' : 'Lihat'"
        />
      </div>
    </div>
    <div class="rd-session-main-details-container">
      <div class="rd-session-detail-container rd-session-total">
        <span class="rd-session-placeholder rd-caption-text">Total berat</span>
        <span class="rd-session-value rd-headline-5">{{
          `${data.data?.reduce((a, b) => a + b.weight, 0) || 0} kg`
        }}</span>
      </div>
      <div class="rd-session-detail-container rd-session-count">
        <span class="rd-session-placeholder rd-caption-text">Penimbangan</span>
        <span class="rd-session-value rd-headline-5">{{
          `${data.data?.length || 0} kali`
        }}</span>
      </div>
      <div class="rd-session-detail-container rd-session-date">
        <span class="rd-session-placeholder rd-caption-text"
          >Waktu pertama</span
        >
        <span class="rd-session-value rd-headline-5">{{
          `${
            data.data?.[data.data?.length - 1]?.date
              ? dateHandler(new Date(data.data[data.data?.length - 1].date))
              : "-"
          }`
        }}</span>
      </div>
      <div class="rd-session-detail-container rd-session-date">
        <span class="rd-session-placeholder rd-caption-text"
          >Waktu terakhir</span
        >
        <span class="rd-session-value rd-headline-5">{{
          `${
            data.data?.[0]?.date
              ? dateHandler(new Date(data.data[0].date))
              : "-"
          }`
        }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Scale } from "~~/interfaces/scale";

  const props = defineProps<{
    data: Scale;
  }>();
  const emits = defineEmits(["open-panel"]);
  const { viewMode } = useMain();

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

  function openPanel(): void {
    emits("open-panel", {
      type: "session",
      data: props.data,
    });
  }
  function dateHandler(x: Date): string {
    const year: number = x.getFullYear();
    const month: number = x.getMonth();
    const date: number = x.getDate();
    const hours: number = x.getHours();
    const minutes: number = x.getMinutes();
    return viewMode.value === "desktop"
      ? `${date} ${months[month]} ${year} - ${hours
          .toString()
          .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
      : `${date.toString().padStart(2, "0")}-${(month + 1)
          .toString()
          .padStart(2, "0")}-${year} ${hours
          .toString()
          .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  }
</script>

<style lang="scss" scoped>
  .rd-component {
    position: relative;
    width: 100%;
    padding: 0.75rem;
    border: var(--border);
    border-radius: 0.75rem;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    .rd-session-details-container {
      z-index: 2;
      position: relative;
      width: 100%;
      height: 2rem;
      margin-bottom: 0.75rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .rd-session-detail-container {
        position: relative;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        span.rd-session-status {
          position: relative;
          height: 1rem;
          padding: 0 0.125rem;
          border-radius: 0.5rem;
          border: var(--border);
          border-color: var(--primary-color);
          color: var(--primary-color);
          display: flex;
          justify-content: center;
          align-items: center;
          &.rd-session-status-weighing {
            border-color: var(--warning-color);
            color: var(--warning-color);
          }
        }
      }
    }
    .rd-session-main-details-container {
      z-index: 1;
      position: relative;
      width: 100%;
      padding: 0.5rem;
      border-radius: 0.5rem;
      border: var(--border);
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .rd-session-detail-container {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        span.rd-session-placeholder {
          position: relative;
          margin-bottom: 0.125rem;
        }
        &.rd-session-date {
          width: 25%;
        }
        &.rd-session-count,
        &.rd-session-total {
          width: 25%;
        }
      }
    }
    @media only screen and (max-width: 1024px) {
      .rd-session-main-details-container {
        flex-wrap: wrap;
        .rd-session-detail-container {
          &.rd-session-count,
          &.rd-session-total {
            margin-bottom: 0.5rem;
          }
          &.rd-session-date,
          &.rd-session-count,
          &.rd-session-total {
            width: 50%;
          }
        }
      }
    }
  }
</style>
