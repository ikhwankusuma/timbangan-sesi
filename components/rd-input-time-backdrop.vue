<template>
  <rd-backdrop class="rd-backdrop" :state="backdropState" @exit="emits('exit')">
    <div class="rd-backdrop-header">
      <span class="rd-backdrop-title rd-headline-3">Pilih waktu</span>
    </div>
    <div class="rd-backdrop-body">
      <span
        v-if="input.opening_hours"
        class="rd-backdrop-caption rd-caption-text"
      >
        {{ message }}
      </span>
      <div class="rd-backdrop-input-wrapper">
        <rd-input-text class="rd-backdrop-input" :input="hoursInput" />
        <rd-input-text class="rd-backdrop-input" :input="minutesInput" />
      </div>
      <div class="rd-backdrop-button-wrapper">
        <rd-input-button
          class="rd-backdrop-button"
          label="simpan"
          :disabled="disabled"
          @clicked="submit"
        />
      </div>
    </div>
  </rd-backdrop>
</template>

<script lang="ts" setup>
  import { ComputedRef } from "vue";
  import { InputOption, InputTimeOption } from "~~/interfaces/general";

  const emits = defineEmits(["exit"]);
  const props = defineProps<{
    input: InputTimeOption;
  }>();

  const backdropState = ref<"idle" | "hide">("idle");

  const hoursInput = ref<InputOption>({
    name: "hours",
    placeholder: "HH",
    model: "00",
    label: "Jam",
    type: "hour",
  });
  const minutesInput = ref<InputOption>({
    name: "minutes",
    placeholder: "MM",
    model: "00",
    label: "Menit",
    type: "minute",
  });

  const hours: ComputedRef<number> = computed(() =>
    parseInt(hoursInput.value.model)
  );
  const minutes: ComputedRef<number> = computed(() =>
    parseInt(minutesInput.value.model)
  );

  const day: ComputedRef<number> = computed(
    () => props.input.date?.getDay() || new Date().getDay()
  );
  const operational: ComputedRef<
    { open: string; close: string } | "closed" | "opened"
  > = computed(() => props.input.opening_hours[day.value]);
  const message: ComputedRef<string> = computed(() => {
    let str: string = "";
    if (props.input.opening_hours) {
      str += "Restoran beroperasi ";
      if (operational.value === "opened") str += "24 jam pada hari ";
      else if (operational.value === "closed") str += "tutup pada hari ";
      else
        str += `dari pukul ${operational.value.open} sampai dengan ${operational.value.close} pada hari `;
      str += days[day.value];
    }
    return str;
  });
  const disabled: ComputedRef<boolean> = computed(() => {
    if (operational.value === "closed") return true;
    if (operational.value === "opened") return false;
    const date: number = new Date().setHours(hours.value, minutes.value, 0, 0);
    const open: number = new Date().setHours(
      parseInt(operational.value.open.split(":")[0]),
      parseInt(operational.value.open.split(":")[1]),
      0,
      0
    );
    const close: number = new Date().setHours(
      parseInt(operational.value.close.split(":")[0]),
      parseInt(operational.value.close.split(":")[1]),
      0,
      0
    );
    if (date < open) return true;
    if (date >= close) return true;
    return false;
  });

  const days: string[] = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];

  function exit(): void {
    backdropState.value = "hide";
  }

  function submit(): void {
    props.input.model = `${hoursInput.value.model}:${minutesInput.value.model}`;
    exit();
  }
</script>

<style lang="scss" scoped>
  .rd-backdrop {
    .rd-backdrop-header {
      position: relative;
      width: 100%;
      margin: 1rem 0;
      display: flex;
      .rd-backdrop-title {
        position: relative;
        width: 100%;
        height: 1rem;
        display: flex;
        flex-shrink: 0;
        align-items: center;
      }
    }
    .rd-backdrop-body {
      position: relative;
      left: -1rem;
      width: calc(100% + 2rem);
      display: flex;
      flex-direction: column;
      span.rd-backdrop-caption {
        position: relative;
        width: 100%;
        padding: 0 1rem;
        box-sizing: border-box;
      }
      .rd-backdrop-input-wrapper {
        position: relative;
        width: 100%;
        margin-top: 1rem;
        padding: 0 1rem;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        .rd-backdrop-input {
          width: calc(50% - 0.25rem);
        }
      }
      .rd-backdrop-button-wrapper {
        position: relative;
        width: 100%;
        margin-top: 2rem;
        padding: 0 1rem;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        .rd-backdrop-button {
          width: 100%;
        }
      }
    }
    @media only screen and (min-width: 1025px) {
      height: 100%;
      padding: 0 2rem;
      .rd-backdrop-body {
        left: -2rem;
        width: calc(100% + 4rem);
        height: 100%;
        .rd-backdrop-date-wrapper {
          padding: 0 2rem;
        }
        .rd-backdrop-button-wrapper {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 6rem;
          margin: 0;
          padding: 2rem 2rem 2rem 2rem;
          box-sizing: border-box;
          flex-shrink: 0;
          &::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 1px;
            background: var(--border-color);
          }
        }
      }
    }
  }
</style>
