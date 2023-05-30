<template>
  <rd-backdrop class="rd-backdrop" :state="backdropState" @exit="emits('exit')">
    <div class="rd-backdrop-header">
      <span class="rd-backdrop-title rd-headline-3">Pilih tanggal</span>
    </div>
    <div ref="rdBackdropBody" class="rd-backdrop-body">
      <div class="rd-backdrop-date-wrapper">
        <div class="rd-backdrop-date-controls-container">
          <div class="rd-backdrop-date-controls-indicator-wrapper">
            <div
              class="rd-backdrop-date-controls-indicator rd-backdrop-date-controls-indicator-prev"
            >
              <span
                class="rd-backdrop-date-controls-indicator-text rd-headline-5"
                >{{
                  monthHandler(
                    selectedMonth.month === 0
                      ? selectedMonth.year - 1
                      : selectedMonth.year,
                    selectedMonth.month === 0 ? 11 : selectedMonth.month - 1
                  )
                }}</span
              >
            </div>
            <div
              class="rd-backdrop-date-controls-indicator rd-backdrop-date-controls-indicator-prev"
            >
              <span
                class="rd-backdrop-date-controls-indicator-text rd-headline-5"
                >{{
                  monthHandler(selectedMonth.year, selectedMonth.month)
                }}</span
              >
            </div>
            <div
              class="rd-backdrop-date-controls-indicator rd-backdrop-date-controls-indicator-prev"
            >
              <span
                class="rd-backdrop-date-controls-indicator-text rd-headline-5"
                >{{
                  monthHandler(
                    selectedMonth.month === 11
                      ? selectedMonth.year + 1
                      : selectedMonth.year,
                    selectedMonth.month === 11 ? 0 : selectedMonth.month + 1
                  )
                }}</span
              >
            </div>
          </div>
          <div class="rd-backdrop-date-controls">
            <rd-input-button-small
              class="rd-panel-button"
              :icon="'chevron-left'"
              style="
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
                transform-origin: center right;
              "
              @clicked="changeMonth('left')"
            />
            <rd-input-button-small
              class="rd-panel-button"
              :icon="'chevron-right'"
              style="
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
                transform-origin: center left;
              "
              @clicked="changeMonth('right')"
            />
          </div>
        </div>
        <div class="rd-backdrop-date-days-container">
          <span
            v-for="(day, i) in days"
            :key="i"
            class="rd-backdrop-date-day rd-caption-text"
            >{{ day.slice(0, 1) }}</span
          >
        </div>
        <div class="rd-backdrop-date-weeks-wrapper">
          <div class="rd-backdrop-date-weeks rd-backdrop-date-weeks-prev">
            <div v-for="i in 6" :key="i" class="rd-backdrop-date-week">
              <div
                v-for="j in 7"
                :key="j"
                class="rd-backdrop-date-week-day"
                :class="
                  props.input.threshold || props.input.available?.length
                    ? isYesterday(
                        selectedMonth.month === 0
                          ? selectedMonth.year - 1
                          : selectedMonth.year,
                        selectedMonth.month === 0
                          ? 11
                          : selectedMonth.month - 1,
                        prevDays[i - 1][j - 1]
                      )
                      ? 'rd-backdrop-date-week-day-disabled'
                      : ''
                    : ''
                "
              >
                <div
                  v-if="
                    isSameDay(
                      selectedMonth.month === 0
                        ? selectedMonth.year - 1
                        : selectedMonth.year,
                      selectedMonth.month === 0 ? 11 : selectedMonth.month - 1,
                      prevDays[i - 1][j - 1]
                    )
                  "
                  class="rd-backdrop-date-week-day-overlay"
                ></div>
                <span
                  v-if="prevDays[i - 1][j - 1]"
                  class="rd-backdrop-date-week-day-date rd-headline-6"
                  :class="
                    isSelected(
                      selectedMonth.month === 0
                        ? selectedMonth.year - 1
                        : selectedMonth.year,
                      selectedMonth.month === 0 ? 11 : selectedMonth.month - 1,
                      prevDays[i - 1][j - 1]
                    )
                      ? 'rd-backdrop-date-week-day-date-selected'
                      : ''
                  "
                  >{{ prevDays[i - 1][j - 1] }}</span
                >
                <span v-else class="rd-backdrop-date-week-day-dot"></span>
              </div>
            </div>
          </div>
          <div class="rd-backdrop-date-weeks rd-backdrop-date-weeks-current">
            <div v-for="i in 6" :key="i" class="rd-backdrop-date-week">
              <div
                v-for="j in 7"
                :key="j"
                class="rd-backdrop-date-week-day"
                :class="
                  props.input.threshold || props.input.available?.length
                    ? isYesterday(
                        selectedMonth.year,
                        selectedMonth.month,
                        currentDays[i - 1][j - 1]
                      )
                      ? 'rd-backdrop-date-week-day-disabled'
                      : ''
                    : ''
                "
              >
                <div
                  v-if="
                    isSameDay(
                      selectedMonth.year,
                      selectedMonth.month,
                      currentDays[i - 1][j - 1]
                    )
                  "
                  class="rd-backdrop-date-week-day-overlay"
                ></div>
                <span
                  v-if="currentDays[i - 1][j - 1]"
                  class="rd-backdrop-date-week-day-date rd-headline-6"
                  :class="
                    isSelected(
                      selectedMonth.year,
                      selectedMonth.month,
                      currentDays[i - 1][j - 1]
                    )
                      ? 'rd-backdrop-date-week-day-date-selected'
                      : ''
                  "
                  @click="selectOption(currentDays[i - 1][j - 1])"
                  >{{ currentDays[i - 1][j - 1] }}</span
                >
                <span v-else class="rd-backdrop-date-week-day-dot"></span>
              </div>
            </div>
          </div>
          <div class="rd-backdrop-date-weeks rd-backdrop-date-weeks-next">
            <div v-for="i in 6" :key="i" class="rd-backdrop-date-week">
              <div
                v-for="j in 7"
                :key="j"
                class="rd-backdrop-date-week-day"
                :class="
                  props.input.threshold || props.input.available?.length
                    ? isYesterday(
                        selectedMonth.month === 11
                          ? selectedMonth.year + 1
                          : selectedMonth.year,
                        selectedMonth.month === 11
                          ? 0
                          : selectedMonth.month + 1,
                        nextDays[i - 1][j - 1]
                      )
                      ? 'rd-backdrop-date-week-day-disabled'
                      : ''
                    : ''
                "
              >
                <div
                  v-if="
                    isSameDay(
                      selectedMonth.month === 11
                        ? selectedMonth.year + 1
                        : selectedMonth.year,
                      selectedMonth.month === 11 ? 0 : selectedMonth.month + 1,
                      nextDays[i - 1][j - 1]
                    )
                  "
                  class="rd-backdrop-date-week-day-overlay"
                ></div>
                <span
                  v-if="nextDays[i - 1][j - 1]"
                  class="rd-backdrop-date-week-day-date rd-headline-6"
                  :class="
                    isSelected(
                      selectedMonth.month === 11
                        ? selectedMonth.year + 1
                        : selectedMonth.year,
                      selectedMonth.month === 11 ? 0 : selectedMonth.month + 1,
                      nextDays[i - 1][j - 1]
                    )
                      ? 'rd-backdrop-date-week-day-date-selected'
                      : ''
                  "
                  >{{ nextDays[i - 1][j - 1] }}</span
                >
                <span v-else class="rd-backdrop-date-week-day-dot"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="rd-backdrop-button-wrapper">
        <rd-input-button class="rd-backdrop-button" label="simpan" />
      </div> -->
    </div>
  </rd-backdrop>
</template>

<script lang="ts" setup>
  import gsap from "gsap";
  import { ComputedRef } from "vue";

  import { InputDateOption } from "~~/interfaces/general";

  interface DateObject {
    date?: number;
    year: number;
    month: number;
  }

  const emits = defineEmits(["exit"]);
  const props = defineProps<{
    input: InputDateOption;
  }>();

  const rdBackdropBody = ref<HTMLDivElement>(null);

  const backdropState = ref<"idle" | "hide">("idle");

  const todayDate = ref<DateObject>({
    date: new Date().getDate(),
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });

  const selectedMonth = ref<DateObject>(todayDate.value);
  const selectedDate = ref<DateObject>({
    date: -1,
    month: -1,
    year: -1,
  });

  const currentDays: ComputedRef<number[][]> = computed(() => {
    if (!selectedMonth.value) return null;
    return getDays(selectedMonth.value.year, selectedMonth.value.month);
  });
  const nextDays: ComputedRef<number[][]> = computed(() => {
    if (!selectedMonth.value) return null;
    const { month, year }: DateObject = selectedMonth.value;
    if (month === 11) return getDays(year + 1, 0);
    return getDays(year, month + 1);
  });
  const prevDays: ComputedRef<number[][]> = computed(() => {
    if (!selectedMonth.value) return null;
    const { month, year }: DateObject = selectedMonth.value;
    if (month === 0) return getDays(year - 1, 11);
    return getDays(year, month - 1);
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

  function exit(): void {
    backdropState.value = "hide";
  }

  function monthHandler(y: number, m: number): string {
    return `${months[m]} ${y}`;
  }

  function isYesterday(y: number, m: number, d: number): boolean {
    const day: Date = new Date(y, m, d);
    return (
      props.input.available?.indexOf(day.getDay()) === -1 ||
      day.getTime() < props.input.threshold?.getTime()
    );
  }
  function isSameDay(y: number, m: number, d: number): boolean {
    return (
      y === todayDate.value.year &&
      m === todayDate.value.month &&
      d === todayDate.value.date
    );
  }
  function isSameMonth(y: number, m: number): boolean {
    return y === todayDate.value.year && m === todayDate.value.month;
  }
  function isSelected(y: number, m: number, d: number): boolean {
    return (
      y === selectedDate.value.year &&
      m === selectedDate.value.month &&
      d === selectedDate.value.date
    );
  }

  function selectOption(date: number): void {
    selectedDate.value = {
      date,
      month: selectedMonth.value.month,
      year: selectedMonth.value.year,
    };
    exit();
  }

  function changeMonth(dir: "left" | "right"): void {
    const rdBackdropBodyControlsIndicator: HTMLElement[] = gsap.utils.toArray(
      rdBackdropBody.value.querySelectorAll(
        ".rd-backdrop-date-controls-indicator"
      )
    );
    const rdBackdropBodyWeeks: HTMLElement[] = gsap.utils.toArray(
      rdBackdropBody.value.querySelectorAll(".rd-backdrop-date-weeks")
    );

    const tl: GSAPTimeline = gsap.timeline({
      onComplete() {
        if (dir === "left") {
          selectedMonth.value = {
            month:
              selectedMonth.value.month === 0
                ? 11
                : selectedMonth.value.month - 1,
            year:
              selectedMonth.value.month === 0
                ? selectedMonth.value.year - 1
                : selectedMonth.value.year,
          };
        } else {
          selectedMonth.value = {
            month:
              selectedMonth.value.month === 11
                ? 0
                : selectedMonth.value.month + 1,
            year:
              selectedMonth.value.month === 11
                ? selectedMonth.value.year + 1
                : selectedMonth.value.year,
          };
        }
        gsap.to(rdBackdropBodyControlsIndicator, {
          y: 0,
          duration: 0,
        });
        gsap.to(rdBackdropBodyWeeks, {
          x: 0,
          duration: 0,
        });
      },
    });

    tl.to(rdBackdropBodyControlsIndicator, {
      y: dir === "left" ? "2rem" : "-2rem",
      duration: 0.25,
    }).to(
      rdBackdropBodyWeeks,
      {
        x: dir === "left" ? "100%" : "-100%",
        duration: 0.25,
      },
      "<0"
    );
  }

  function daysInMonth(y: number, m: number): number {
    return 32 - new Date(y, m, 32).getDate();
  }
  function getDays(y: number, m: number): number[][] {
    let date: number = 1;
    const firstDay: number = new Date(y, m).getDay();
    const month: number[][] = [];
    for (let i = 0; i < 6; i++) {
      const week: number[] = [];
      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < firstDay) || date > daysInMonth(y, m)) week.push(0);
        else {
          week.push(date);
          date++;
        }
      }
      month.push(week);
    }
    return month;
  }

  watch(
    () => props.input.value,
    (val: string, oldVal: string) => {
      if (val && val !== oldVal) {
        const date: Date = new Date(val);
        selectedMonth.value = selectedDate.value = {
          date: date.getDate(),
          month: date.getMonth(),
          year: date.getFullYear(),
        };
      }
    }
  );

  watch(
    () => selectedDate.value,
    ({ date, month, year }) => {
      const str: string = `${date.toString().padStart(2, "0")}-${(month + 1)
        .toString()
        .padStart(2, "0")}-${year}`;
      const model: string = str;
      const value: string = new Date(
        year,
        month,
        date,
        23,
        59,
        59,
        999
      ).toISOString();
      props.input.model = model;
      props.input.value = value;
    },
    {
      deep: true,
    }
  );

  onMounted(() => {
    selectedMonth.value = todayDate.value;
    if (props.input.value) {
      const date: Date = new Date(props.input.value);
      selectedDate.value = {
        date: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
      };
    }
  });
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
      .rd-backdrop-date-wrapper {
        position: relative;
        width: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        .rd-backdrop-date-controls-container {
          position: relative;
          width: 100%;
          height: 2rem;
          padding: 0 1rem;
          box-sizing: border-box;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .rd-backdrop-date-controls-indicator-wrapper {
            position: relative;
            height: 100%;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            .rd-backdrop-date-controls-indicator {
              position: relative;
              height: 100%;
              flex-shrink: 0;
              display: flex;
              align-items: center;
            }
          }
          .rd-backdrop-date-controls {
            position: relative;
            height: 100%;
            display: flex;
          }
        }
        .rd-backdrop-date-days-container {
          position: relative;
          width: 100%;
          margin: 0.75rem 0;
          padding: 0 1rem;
          box-sizing: border-box;
          display: flex;
          justify-content: space-between;
          align-items: center;
          span.rd-backdrop-date-day {
            position: relative;
            width: 1.5rem;
            height: 1rem;
            margin-right: 0.5rem;
            display: flex;
            justify-content: center;
            align-items: center;
            &:last-child {
              margin-right: 0;
            }
          }
        }
        .rd-backdrop-date-weeks-wrapper {
          position: relative;
          width: 100%;
          display: flex;
          flex-shrink: 0;
          justify-content: center;
          .rd-backdrop-date-weeks {
            position: relative;
            width: 100%;
            margin-top: 0.5rem;
            padding: 0 1rem;
            box-sizing: border-box;
            display: flex;
            flex-shrink: 0;
            flex-direction: column;
            justify-content: flex-start;
            .rd-backdrop-date-week {
              position: relative;
              width: 100%;
              height: 1.5rem;
              margin-bottom: 0.5rem;
              display: flex;
              justify-content: space-between;
              align-items: center;
              .rd-backdrop-date-week-day {
                position: relative;
                width: 1.5rem;
                height: 1.5rem;
                border-radius: 0.5rem;
                display: flex;
                justify-content: center;
                align-items: center;
                .rd-backdrop-date-week-day-overlay {
                  pointer-events: none;
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  border-radius: 0.5rem;
                  border: 1px solid var(--primary-color);
                  box-sizing: border-box;
                }
                span.rd-backdrop-date-week-day-date {
                  cursor: pointer;
                  position: relative;
                  width: 100%;
                  height: 100%;
                  line-height: 1;
                  opacity: 0.5;
                  background: rgba(0, 0, 0, 0);
                  border-radius: 0.5rem;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  &.rd-backdrop-date-week-day-date-selected {
                    opacity: 1;
                    background: var(--primary-color);
                  }
                }
                span.rd-backdrop-date-week-day-dot {
                  pointer-events: none;
                  position: relative;
                  width: 0.25rem;
                  height: 0.25rem;
                  border-radius: 50%;
                  background: var(--font-color);
                  opacity: 0.05;
                }
                &.rd-backdrop-date-week-day-disabled {
                  pointer-events: none;
                  opacity: 0.5;
                }
              }
              &:last-child {
                margin-bottom: 0;
              }
            }
          }
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
          .rd-backdrop-date-controls-container {
            padding: 0 2rem;
          }
          .rd-backdrop-date-days-container {
            padding: 0 2rem;
          }
          .rd-backdrop-date-weeks-wrapper {
            .rd-backdrop-date-weeks {
              padding: 0 2rem;
            }
          }
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
