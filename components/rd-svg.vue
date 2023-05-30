<template>
  <div
    class="rd-component-svg"
    ref="rdComponent"
    :class="color ? `rd-color-${color}` : ''"
  ></div>
</template>

<script lang="ts" setup>
  import gsap from "gsap";

  const config = useRuntimeConfig();
  const props = defineProps<{
    name: string;
    color?: string;
  }>();

  const rdComponent = ref<HTMLDivElement>(null);

  const rdElementText = ref<string>("");

  onBeforeMount(async () => {
    await loadElementText();
  });

  async function loadElementText(): Promise<boolean> {
    try {
      const data: Response = await fetch(
        `${config.public.base}/icons/${props.name}.svg`
      );
      rdElementText.value = await data.text();
      return true;
    } catch {
      return false;
    }
  }

  watch(
    () => rdElementText.value,
    (val) => {
      rdComponent.value.innerHTML = val;
    }
  );

  watch(
    () => props.name,
    () => {
      loadElementText();
    }
  );
</script>

<style lang="scss">
  .rd-component-svg {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.25s transform;
    svg {
      position: relative;
      width: 100%;
      height: 100%;
      &.rd-svg-filled {
        .rd-svg-filled-main {
          fill: var(--font-main-color);
        }
        .rd-svg-filled-secondary {
          fill: var(--secondary-color);
        }
      }
      &.rd-svg-outlined {
        .rd-svg-outlined-main {
          stroke: var(--font-main-color);
        }
        .rd-svg-outlined-secondary {
          stroke: var(--secondary-color);
        }
      }
    }
    &.rd-color-secondary {
      svg {
        &.rd-svg-filled {
          .rd-svg-filled-main {
            fill: var(--secondary-color);
          }
          .rd-svg-filled-secondary {
            fill: #fff;
          }
        }
        &.rd-svg-outlined {
          .rd-svg-outlined-main {
            stroke: var(--secondary-color);
          }
          .rd-svg-outlined-secondary {
            stroke: #fff;
          }
        }
      }
    }
    &.rd-color-primary {
      svg {
        &.rd-svg-filled {
          .rd-svg-filled-main {
            fill: var(--primary-color);
          }
          .rd-svg-filled-secondary {
            fill: var(--secondary-color);
          }
        }
        &.rd-svg-outlined {
          .rd-svg-outlined-main {
            stroke: var(--primary-color);
          }
          .rd-svg-outlined-secondary {
            stroke: var(--secondary-color);
          }
        }
      }
    }
  }
</style>
