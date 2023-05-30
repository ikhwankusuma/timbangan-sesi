<template>
  <button
    class="rd-input-component"
    ref="rdInputComponent"
    @mousedown="mouseDownHandler"
    :class="`${
      disabled ? 'rd-input-component-disabled' : ''
    } rd-input-component-${type || 'default'}`"
    :disabled="disabled"
  >
    <div v-if="icon" class="rd-input-icon-container">
      <rd-svg
        :name="props.icon"
        :color="type === 'primary' ? 'secondary' : ''"
      />
    </div>
    <div v-else class="rd-input-image-container">
      <img :src="image" class="rd-input-image" />
    </div>
    <div class="rd-input-overlay"></div>
    <div class="rd-input-tooltip" v-if="tooltip">
      <span class="rd-input-tooltip-message rd-headline-6">{{ tooltip }}</span>
    </div>
  </button>
</template>

<script lang="ts" setup>
  import gsap from "gsap";

  const props = defineProps<{
    icon?: string;
    image?: string;
    disabled?: boolean;
    type?: "default" | "primary" | "secondary";
    tooltip?: string;
  }>();
  const emits = defineEmits(["clicked"]);

  const rdInputComponent = ref<HTMLButtonElement>(null);

  const buttonAnimating = ref<boolean>(false);
  const buttonClicking = ref<boolean>(false);
  const buttonPressed = ref<boolean>(false);

  const animate = {
    click(rdInputComponent: HTMLElement, cb?: () => void): void {
      const tl: GSAPTimeline = gsap.timeline({
        onComplete() {
          if (cb) cb();
        },
      });

      const rdOverlay: HTMLElement =
        rdInputComponent.querySelector(".rd-input-overlay");

      tl.to(rdInputComponent, {
        scale: 0.95,
        duration: 0.25,
        ease: "power2.out",
      }).to(
        rdOverlay,
        {
          opacity: 1,
          duration: 0.25,
          ease: "power2.inOut",
        },
        "<0"
      );
    },
    release(rdInputComponent: HTMLElement, cb?: () => void): void {
      const tl: GSAPTimeline = gsap.timeline({
        onComplete() {
          if (cb) cb();
        },
      });

      const rdOverlay: HTMLElement =
        rdInputComponent.querySelector(".rd-input-overlay");

      tl.to(rdInputComponent, {
        scale: 1,
        duration: 0.25,
        ease: "back.out(2)",
      }).to(
        rdOverlay,
        {
          opacity: 0,
          duration: 0.25,
          ease: "power2.out",
        },
        "<0"
      );
    },
  };

  function mouseDownHandler(): void {
    buttonAnimating.value = true;
    buttonClicking.value = true;
    buttonPressed.value = true;
    animate.click(rdInputComponent.value, () => {
      buttonClicking.value = false;
      if (!buttonPressed.value) {
        mouseUpHandler();
      }
    });
    window.addEventListener("mouseup", mouseUpHandler);
  }
  function mouseUpHandler(): void {
    window.removeEventListener("mouseup", mouseUpHandler);
    buttonPressed.value = false;
    if (!buttonClicking.value) {
      emits("clicked");
      animate.release(rdInputComponent.value, () => {
        buttonAnimating.value = false;
      });
    }
  }

  onBeforeUnmount(() => {
    window.removeEventListener("mouseup", mouseUpHandler);
  });
</script>

<style lang="scss" scoped>
  button.rd-input-component {
    cursor: pointer;
    position: relative;
    width: 2rem;
    height: 2rem;
    display: flex;
    border-radius: 0.5rem;
    margin: 0;
    background: var(--background-depth-one-color);
    border: var(--border);
    padding: 0;
    // overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    * {
      pointer-events: none;
    }
    .rd-input-icon-container,
    .rd-input-image-container {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      img.rd-input-image {
        position: relative;
        width: 100%;
        height: 100%;
        border-radius: 0.5rem;
        object-fit: cover;
      }
    }
    .rd-input-icon-container {
      padding: 0 0.5rem;
      box-sizing: border-box;
    }
    .rd-input-overlay {
      pointer-events: none;
      position: absolute;
      top: 0;
      left: 0;
      border-radius: 0.5rem;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.1);
      opacity: 0;
    }
    .rd-input-tooltip {
      z-index: 2000000;
      position: absolute;
      top: calc(100% + 0.25rem);
      height: 1rem;
      padding: 0 0.25rem;
      border-radius: 0.25rem;
      background: var(--font-main-color);
      opacity: 0;
      transform: scale(0.75);
      transform-origin: top center;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.125s opacity, 0.125s transform ease-out;
      span.rd-input-tooltip-message {
        position: relative;
        color: var(--background-depth-one-color);
        white-space: nowrap;
      }

      &::after {
        content: " ";
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        border-width: 0.25rem;
        border-style: solid;
        border-color: transparent transparent var(--font-main-color) transparent;
      }
    }
    &.rd-input-component-disabled {
      pointer-events: none;
      filter: grayscale(0.75);
      opacity: 0.5;
    }
    &.rd-input-component-primary {
      background: var(--primary-color);
      border-color: var(--primary-color);
    }
    &:hover:not(:active) {
      .rd-input-tooltip {
        opacity: 1;
        transform: scale(1);
      }
    }
  }
</style>
