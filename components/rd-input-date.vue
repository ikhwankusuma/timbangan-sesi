<template>
  <div
    ref="rdInputComponent"
    class="rd-input-component"
    :class="props.input.error ? 'rd-input-error-active' : ''"
  >
    <label v-if="props.input.label" class="rd-input-label rd-headline-6">{{
      props.input.label
    }}</label>
    <div class="rd-input-container">
      <div v-if="props.input.icon" class="rd-input-icon-container">
        <rd-svg :name="props.input.icon" :color="'secondary'" />
      </div>
      <input
        class="rd-input rd-body-text"
        :placeholder="props.input.placeholder"
        ref="rdInput"
        readonly
        :name="props.input.name"
        @focusin="dropDownHandler('open')"
        @input="updateModel"
      />
      <div class="rd-input-border"></div>
      <div
        v-if="dropDownOpened"
        ref="rdInputDate"
        class="rd-input-date"
        tabindex="-1"
        :class="dropDownOpened ? 'rd-input-date-opened' : ''"
      >
        <div class="rd-input-date-controls-container">
          <div class="rd-input-date-controls-indicator-wrapper">
            <div
              class="rd-input-date-controls-indicator rd-input-date-controls-indicator-prev"
            >
              <span
                class="rd-input-date-controls-indicator-text rd-headline-5"
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
              class="rd-input-date-controls-indicator rd-input-date-controls-indicator-prev"
            >
              <span
                class="rd-input-date-controls-indicator-text rd-headline-5"
                >{{
                  monthHandler(selectedMonth.year, selectedMonth.month)
                }}</span
              >
            </div>
            <div
              class="rd-input-date-controls-indicator rd-input-date-controls-indicator-prev"
            >
              <span
                class="rd-input-date-controls-indicator-text rd-headline-5"
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
          <div class="rd-input-date-controls">
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
        <div class="rd-input-date-days-container">
          <span
            v-for="(day, i) in days"
            :key="i"
            class="rd-input-date-day rd-caption-text"
            >{{ day.slice(0, 1) }}</span
          >
        </div>
        <div class="rd-input-date-weeks-wrapper">
          <div class="rd-input-date-weeks rd-input-date-weeks-prev">
            <div v-for="i in 6" :key="i" class="rd-input-date-week">
              <div
                v-for="j in 7"
                :key="j"
                class="rd-input-date-week-day"
                :class="
                  props.input.threshold
                    ? isYesterday(
                        selectedMonth.month === 0
                          ? selectedMonth.year - 1
                          : selectedMonth.year,
                        selectedMonth.month === 0
                          ? 11
                          : selectedMonth.month - 1,
                        prevDays[i - 1][j - 1]
                      )
                      ? 'rd-input-date-week-day-disabled'
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
                  class="rd-input-date-week-day-overlay"
                ></div>
                <span
                  v-if="prevDays[i - 1][j - 1]"
                  class="rd-input-date-week-day-date rd-headline-6"
                  :class="
                    isSelected(
                      selectedMonth.month === 0
                        ? selectedMonth.year - 1
                        : selectedMonth.year,
                      selectedMonth.month === 0 ? 11 : selectedMonth.month - 1,
                      prevDays[i - 1][j - 1]
                    )
                      ? 'rd-input-date-week-day-date-selected'
                      : ''
                  "
                  >{{ prevDays[i - 1][j - 1] }}</span
                >
                <span v-else class="rd-input-date-week-day-dot"></span>
              </div>
            </div>
          </div>
          <div class="rd-input-date-weeks rd-input-date-weeks-current">
            <div v-for="i in 6" :key="i" class="rd-input-date-week">
              <div
                v-for="j in 7"
                :key="j"
                class="rd-input-date-week-day"
                :class="
                  props.input.threshold
                    ? isYesterday(
                        selectedMonth.year,
                        selectedMonth.month,
                        currentDays[i - 1][j - 1]
                      )
                      ? 'rd-input-date-week-day-disabled'
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
                  class="rd-input-date-week-day-overlay"
                ></div>
                <span
                  v-if="currentDays[i - 1][j - 1]"
                  class="rd-input-date-week-day-date rd-headline-6"
                  :class="
                    isSelected(
                      selectedMonth.year,
                      selectedMonth.month,
                      currentDays[i - 1][j - 1]
                    )
                      ? 'rd-input-date-week-day-date-selected'
                      : ''
                  "
                  @click="selectOption(currentDays[i - 1][j - 1])"
                  >{{ currentDays[i - 1][j - 1] }}</span
                >
                <span v-else class="rd-input-date-week-day-dot"></span>
              </div>
            </div>
          </div>
          <div class="rd-input-date-weeks rd-input-date-weeks-next">
            <div v-for="i in 6" :key="i" class="rd-input-date-week">
              <div
                v-for="j in 7"
                :key="j"
                class="rd-input-date-week-day"
                :class="
                  props.input.threshold
                    ? isYesterday(
                        selectedMonth.month === 11
                          ? selectedMonth.year + 1
                          : selectedMonth.year,
                        selectedMonth.month === 11
                          ? 0
                          : selectedMonth.month + 1,
                        nextDays[i - 1][j - 1]
                      )
                      ? 'rd-input-date-week-day-disabled'
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
                  class="rd-input-date-week-day-overlay"
                ></div>
                <span
                  v-if="nextDays[i - 1][j - 1]"
                  class="rd-input-date-week-day-date rd-headline-6"
                  :class="
                    isSelected(
                      selectedMonth.month === 11
                        ? selectedMonth.year + 1
                        : selectedMonth.year,
                      selectedMonth.month === 11 ? 0 : selectedMonth.month + 1,
                      nextDays[i - 1][j - 1]
                    )
                      ? 'rd-input-date-week-day-date-selected'
                      : ''
                  "
                  >{{ nextDays[i - 1][j - 1] }}</span
                >
                <span v-else class="rd-input-date-week-day-dot"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <span class="rd-input-error rd-headline-6">
      <span class="rd-text-wrapper">
        <span class="rd-text-container rd-text-container-up">
          <span class="rd-text">{{ inputError }}</span>
        </span>
      </span>
    </span>
  </div>
</template>

<script lang="ts" setup>
  import gsap from "gsap";
  import { ComputedRef } from "vue";

  import { InputDateOption } from "~~/interfaces/general.js";

  interface DateObject {
    date?: number;
    year: number;
    month: number;
  }

  const props = defineProps<{
    input: InputDateOption;
  }>();

  const rdInputDate = ref<HTMLDivElement>(null);
  const rdInput = ref<HTMLInputElement>(null);

  const inputError = ref<string>(props.input.error);
  const inputModel = ref<string>("");
  const inputValue = ref<string>("");

  const dropDownOpened = ref<boolean>(false);

  const selectedMonth = ref<DateObject>(null);
  const selectedDate = ref<DateObject>({
    date: -1,
    month: -1,
    year: -1,
  });
  const todayDate = ref<DateObject>({
    date: new Date().getDate(),
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
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

  const animate = {
    dropDownOpen(rdInputDate: HTMLElement, cb?: () => void): void {
      const tl: GSAPTimeline = gsap.timeline({
        onComplete() {
          if (cb) cb();
        },
      });

      tl.to(rdInputDate, {
        scale: 1,
        opacity: 1,
        duration: 0.25,
        ease: "power2.inOut",
      });
    },
    dropDownClose(rdInputDate: HTMLElement, cb?: () => void): void {
      const tl: GSAPTimeline = gsap.timeline({
        onComplete() {
          if (cb) cb();
        },
      });

      tl.to(rdInputDate, {
        scale: 1.125,
        opacity: 0,
        duration: 0.25,
        ease: "power2.inOut",
      });
    },
  };

  function dropDownHandler(state: "open" | "close"): void {
    if (state === "open") {
      dropDownOpened.value = true;
      setTimeout(() => {
        rdInputDate.value.focus();
        animate.dropDownOpen(rdInputDate.value);
        const { bottom, right }: DOMRect =
          rdInputDate.value.getBoundingClientRect();
        gsap.to(rdInputDate.value, {
          top: window.innerHeight - bottom < 0 ? "auto" : "100%",
          bottom: window.innerHeight - bottom < 0 ? "100%" : "auto",
          right: window.innerWidth - right < 0 ? "0" : "auto",
          left: window.innerWidth - right < 0 ? "auto" : "0",
          duration: 0,
        });
      }, 100);
    } else {
      if (dropDownOpened.value) {
        animate.dropDownClose(rdInputDate.value, () => {
          dropDownOpened.value = false;
        });
      }
    }
  }

  function updateModel({ target }: InputEvent): void {
    if (target instanceof HTMLInputElement) {
      inputModel.value = target.value;
      dropDownHandler("open");
    }
  }

  function selectOption(date: number): void {
    selectedDate.value = {
      date,
      month: selectedMonth.value.month,
      year: selectedMonth.value.year,
    };
    dropDownHandler("close");
  }

  function monthHandler(y: number, m: number): string {
    return `${months[m]} ${y}`;
  }

  function isYesterday(y: number, m: number, d: number): boolean {
    const day: Date = new Date(y, m, d);
    return day.getTime() < props.input.threshold.getTime();
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

  function changeMonth(dir: "left" | "right"): void {
    const rdInputDateControlsIndicator: HTMLElement[] = gsap.utils.toArray(
      rdInputDate.value.querySelectorAll(".rd-input-date-controls-indicator")
    );
    const rdInputDateWeeks: HTMLElement[] = gsap.utils.toArray(
      rdInputDate.value.querySelectorAll(".rd-input-date-weeks")
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
        gsap.to(rdInputDateControlsIndicator, {
          y: 0,
          duration: 0,
        });
        gsap.to(rdInputDateWeeks, {
          x: 0,
          duration: 0,
        });
      },
    });

    tl.to(rdInputDateControlsIndicator, {
      y: dir === "left" ? "2rem" : "-2rem",
      duration: 0.25,
    }).to(
      rdInputDateWeeks,
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
    () => props.input.error,
    (val: string) => {
      if (val) inputError.value = val;
    }
  );
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
      inputModel.value = str;
      inputValue.value = new Date(
        year,
        month,
        date,
        23,
        59,
        59,
        999
      ).toISOString();
      props.input.model = inputModel.value;
      props.input.value = inputValue.value;
      rdInput.value.value = str;
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
  .rd-input-component {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-content: flex-start;
    label.rd-input-label {
      position: relative;
      width: 100%;
      height: 1rem;
      display: flex;
      color: var(--font-color);
      opacity: 0.5;
      align-items: center;
    }
    .rd-input-container {
      position: relative;
      width: 100%;
      height: 2rem;
      background: var(--background-depth-three-color);
      border-radius: 0.5rem;
      display: flex;
      .rd-input-icon-container {
        position: relative;
        width: 2rem;
        height: 2rem;
        padding: 0 0.5rem;
        border-top-left-radius: 0.5rem;
        border-bottom-left-radius: 0.5rem;
        box-sizing: border-box;
        background: rgba(0, 0, 0, 0.05);
        display: flex;
        justify-content: center;
        align-items: center;
      }
      input.rd-input {
        position: relative;
        width: 100%;
        height: 100%;
        padding: 0 0.5rem;
        border: none;
        border-top-right-radius: 0.5rem;
        border-bottom-right-radius: 0.5rem;
        box-sizing: border-box;
        color: var(--font-color);
        background: rgba(0, 0, 0, 0);
        display: flex;
        transition: background-color 0.25s;
        &::placeholder {
          color: var(--font-color);
          opacity: 0.5;
          transition: opacity 0.25s;
        }
        &:hover {
          outline: none;
          background: rgba(0, 0, 0, 0);
          &::placeholder {
            opacity: 1;
          }
        }
        &:focus {
          outline: none;
          background: var(--background-depth-two-color);
        }
        &:focus + .rd-input-border {
          border-color: var(--primary-color);
          &::before {
            opacity: 0.25;
          }
        }
      }
      .rd-input-border {
        pointer-events: none;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 0.5rem;
        border: 1px solid rgba(0, 0, 0, 0.125);
        box-sizing: border-box;
        transition: 0.25s border-color, 0.25s border-width;
        &::before {
          content: "";
          position: absolute;
          top: -3px;
          left: -3px;
          width: calc(100% + 6px);
          height: calc(100% + 6px);
          border-radius: 0.5rem;
          border: 3px solid var(--primary-color);
          box-sizing: border-box;
          opacity: 0;
          transition: 0.25s opacity;
        }
      }
      .rd-input-date {
        z-index: 20000000;
        pointer-events: none;
        position: absolute;
        top: 100%;
        width: 13.5rem;
        background: var(--background-depth-one-color);
        box-shadow: var(--box-shadow);
        opacity: 0;
        padding: 0.75rem 0;
        border-radius: 0.75rem;
        box-sizing: border-box;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        transform: scale(1.125);
        .rd-input-date-controls-container {
          position: relative;
          width: 100%;
          height: 2rem;
          padding: 0 0.75rem;
          box-sizing: border-box;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .rd-input-date-controls-indicator-wrapper {
            position: relative;
            height: 100%;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            .rd-input-date-controls-indicator {
              position: relative;
              height: 100%;
              flex-shrink: 0;
              display: flex;
              align-items: center;
            }
          }
          .rd-input-date-controls {
            position: relative;
            height: 100%;
            display: flex;
          }
        }
        .rd-input-date-days-container {
          position: relative;
          width: 100%;
          margin: 0.75rem 0;
          padding: 0 0.75rem;
          box-sizing: border-box;
          display: flex;
          justify-content: space-between;
          align-items: center;
          span.rd-input-date-day {
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
        .rd-input-date-weeks-wrapper {
          position: relative;
          width: 100%;
          display: flex;
          flex-shrink: 0;
          justify-content: center;
          .rd-input-date-weeks {
            position: relative;
            width: 100%;
            margin-top: 0.5rem;
            padding: 0 0.75rem;
            box-sizing: border-box;
            display: flex;
            flex-shrink: 0;
            flex-direction: column;
            justify-content: flex-start;
            .rd-input-date-week {
              position: relative;
              width: 100%;
              height: 1.5rem;
              margin-bottom: 0.5rem;
              display: flex;
              justify-content: space-between;
              align-items: center;
              .rd-input-date-week-day {
                position: relative;
                width: 1.5rem;
                height: 1.5rem;
                border-radius: 0.5rem;
                display: flex;
                justify-content: center;
                align-items: center;
                .rd-input-date-week-day-overlay {
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
                span.rd-input-date-week-day-date {
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
                  &.rd-input-date-week-day-date-selected {
                    opacity: 1;
                    background: var(--primary-color);
                  }
                }
                span.rd-input-date-week-day-dot {
                  pointer-events: none;
                  position: relative;
                  width: 0.25rem;
                  height: 0.25rem;
                  border-radius: 50%;
                  background: var(--font-color);
                  opacity: 0.05;
                }
                &.rd-input-date-week-day-disabled {
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
        &.rd-input-date-opened {
          pointer-events: all;
        }
      }
    }
    span.rd-input-error {
      position: relative;
      width: 100%;
      height: 1rem;
      color: var(--error-color);
      white-space: nowrap;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: nowrap;
      span.rd-text-wrapper {
        overflow: visible;
        justify-content: flex-start;
        span.rd-text-container {
          justify-content: flex-start;
          transition: 0.25s transform;
          span.rd-text {
            transition: 0.25s transform;
          }
        }
      }
    }
    &.rd-input-error-active {
      span.rd-input-error {
        span.rd-text-wrapper {
          span.rd-text-container {
            transform: translateY(0);
            span.rd-text {
              transform: translateY(0);
            }
          }
        }
      }
    }
  }
</style>
