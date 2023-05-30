<template>
  <div
    class="rd-input-component"
    :class="input.disabled ? 'rd-input-component-disabled' : ''"
  >
    <input
      type="checkbox"
      class="rd-input"
      ref="rdInput"
      id="rd-input-checkbox"
      :disabled="input.disabled"
      @change="updateModel"
    />
    <label for="rd-input-checkbox" class="rd-input-label">
      <div class="rd-input-label-options">
        <span class="rd-input-label-option rd-body-text">{{
          props.input.options[0]
        }}</span>
        <span class="rd-input-label-option rd-body-text">{{
          props.input.options[1]
        }}</span>
      </div>
      <div class="rd-input-label-slider">
        <span class="rd-input-label-slider-option rd-body-text">{{
          props.input.options[0]
        }}</span>
        <span class="rd-input-label-slider-option rd-body-text">{{
          props.input.options[1]
        }}</span>
      </div>
      <div class="rd-input-label-border"></div>
    </label>
  </div>
</template>

<script lang="ts" setup>
  import { InputSwitchOption } from "~~/interfaces/general";

  const props = defineProps<{
    input: InputSwitchOption;
  }>();

  const rdInput = ref<HTMLInputElement>(null);

  watch(
    () => props.input.model,
    (val) => {
      if (val === props.input.options[0]) rdInput.value.checked = false;
      else rdInput.value.checked = true;
    }
  );

  function updateModel({ target }: InputEvent): void {
    if (target instanceof HTMLInputElement) {
      props.input.model = props.input.options[target.checked ? 1 : 0];
    }
  }
</script>

<style lang="scss" scoped>
  .rd-input-component {
    position: relative;
    width: 100%;
    height: 2rem;
    display: flex;
    align-items: center;
    input.rd-input {
      position: absolute;
      opacity: 0;
      &:checked + label.rd-input-label {
        .rd-input-label-slider {
          transform: translateX(100%);
          span.rd-input-label-slider-option {
            transform: translateX(-100%);
          }
        }
      }
    }
    label.rd-input-label {
      cursor: pointer;
      position: relative;
      width: 100%;
      height: 100%;
      background: var(--background-depth-three-color);
      border-radius: 0.5rem;
      padding: 0.25rem;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      * {
        pointer-events: none;
      }
      .rd-input-label-options {
        cursor: pointer;
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        span.rd-input-label-option {
          position: relative;
          width: 50%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
      .rd-input-label-slider {
        position: absolute;
        top: 0.25rem;
        left: 0.25rem;
        width: calc((100% - 0.5rem) / 2);
        height: calc(100% - 0.5rem);
        border-radius: 0.375rem;
        box-sizing: border-box;
        background: var(--primary-color);
        overflow: hidden;
        display: flex;
        align-items: center;
        transition: 0.25s transform cubic-bezier(0.75, 0, 0.25, 1);
        span.rd-input-label-slider-option {
          position: relative;
          width: 100%;
          height: 100%;
          color: #fff;
          display: flex;
          flex-shrink: 0;
          justify-content: center;
          align-items: center;
          transition: 0.25s transform cubic-bezier(0.75, 0, 0.25, 1);
        }
      }
      .rd-input-label-border {
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
      &:focus {
        .rd-input-label-border {
          border-color: var(--primary-color);
          &::before {
            opacity: 0.25;
          }
        }
      }
    }
    &.rd-input-component-disabled {
      pointer-events: none;
      opacity: 0.5;
    }
  }
</style>
