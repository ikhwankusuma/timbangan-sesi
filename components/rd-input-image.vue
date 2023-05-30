<template>
  <div class="rd-input-component">
    <label class="rd-input-label rd-headline-6">
      <span class="rd-input-label-text">{{ props.input.label }}</span>
    </label>
    <input
      type="file"
      id="rd-input"
      class="rd-input"
      @change="changeHandler"
      accept="image/*"
    />
    <label
      ref="rdInputArea"
      for="rd-input"
      class="rd-input-area"
      :class="inputLoading ? 'rd-input-area-loading' : ''"
    >
      <div v-if="inputFile" class="rd-input-image-container">
        <img :src="inputFile.image_url.toString()" class="rd-input-image" />
        <div class="rd-input-image-overlay">
          <div
            class="rd-input-image-icon-wrapper"
            @click="inputHandler('hide')"
          >
            <div class="rd-input-image-icon-container">
              <rd-svg :name="'delete'" />
            </div>
          </div>
        </div>
      </div>
      <div class="rd-input-icon-wrapper">
        <div class="rd-input-icon-container">
          <rd-svg :name="'upload'" :color="'secondary'" />
        </div>
        <div class="rd-input-icon-progress-bar">
          <div class="rd-input-icon-progress-bar-outer">
            <div class="rd-input-icon-progress-bar-inner"></div>
          </div>
        </div>
      </div>
      <span class="rd-input-text rd-caption-text">
        click
        <span class="rd-input-text-highlight rd-headline-6">here</span>
        to select image
      </span>
      <div class="rd-input-border"></div>
    </label>
  </div>
</template>

<script lang="ts" setup>
  import gsap from "gsap";
  import { ComputedRef } from "vue";

  import { InputFileOption } from "~~/interfaces/general.js";

  interface ImageFile {
    name: string;
    type: string;
    size: number;
    image_url: string | ArrayBuffer;
    file: File;
  }

  const config = useRuntimeConfig();
  const { setAlert } = useAlert();
  const props = defineProps<{
    input: InputFileOption;
  }>();

  const rdInputArea = ref<HTMLLabelElement>(null);
  const rdImage = ref<HTMLDivElement[]>(null);

  const inputDragging = ref<boolean>(false);
  const inputLoading = ref<boolean>(false);
  const inputFile = ref<ImageFile>(null);

  const file: ComputedRef<File> = computed((): File => inputFile.value?.file);

  const animate = {
    initImage(rdInputArea: HTMLElement): void {
      const tl = gsap.timeline({
        onComplete() {},
      });

      const rdInputImage: HTMLElement = rdInputArea.querySelector(
        ".rd-input-image-container"
      );

      tl.to(rdInputImage, {
        scale: 1,
        opacity: 1,
        duration: 0.25,
        ease: "power4.out",
      });
    },
    exitImage(rdInputArea: HTMLElement, cb?: () => void): void {
      const tl = gsap.timeline({
        onComplete() {
          if (cb) cb();
        },
      });

      const rdInputImage: HTMLElement = rdInputArea.querySelector(
        ".rd-input-image-container"
      );

      tl.to(rdInputImage, {
        scale: 1.125,
        opacity: 0,
        duration: 0.25,
        ease: "power4.in",
      });
    },
  };

  function changeHandler(e: Event): void {
    e.preventDefault();
    if (e.target instanceof HTMLInputElement) {
      const files: FileList = e.target.files;
      console.log(files);
      fileHandler(files);
    }
  }
  async function fileHandler(files: FileList): Promise<void> {
    inputLoading.value = true;
    const file: File = files[0];
    const result: string | ArrayBuffer = await toBase64(file);
    inputFile.value = {
      name: file.name,
      type: file.type,
      size: file.size,
      image_url: result,
      file,
    };
    setTimeout(() => {
      inputHandler("show");
      inputLoading.value = false;
    }, 1000);
  }

  function toBase64(file: File): Promise<string | ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader: FileReader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (e: ProgressEvent<FileReader>) => reject(e);
    });
  }

  function inputHandler(state: "show" | "hide"): void {
    if (state === "show") {
      animate.initImage(rdInputArea.value);
    } else {
      animate.exitImage(rdInputArea.value, () => {
        inputFile.value = null;
      });
    }
  }

  watch(
    () => file.value,
    () => {
      props.input.file = file.value;
    }
  );

  onMounted(() => {
    setTimeout(() => {
      if (props.input.image_url) {
        inputFile.value = {
          name: "",
          type: "",
          size: 0,
          image_url: props.input.image_url,
          file: null,
        };
        setTimeout(() => {
          inputHandler("show");
        }, 250);
      }
    }, 250);
  });
</script>

<style lang="scss" scoped>
  .rd-input-component {
    position: relative;
    width: 100%;
    height: 14rem;
    display: flex;
    flex-direction: column;
    input.rd-input {
      z-index: -1;
      position: absolute;
      opacity: 0;
      visibility: hidden;
    }
    label.rd-input-label {
      position: relative;
      width: 100%;
      height: 1rem;
      padding: 0 1rem;
      box-sizing: border-box;
      color: var(--font-color);
      opacity: 0.5;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    label.rd-input-area {
      position: relative;
      width: calc(100% - 2rem);
      height: 13rem;
      margin: 0 1rem;
      background: var(--background-depth-three-color);
      border-radius: 0.5rem;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .rd-input-image-container {
        z-index: 2;
        position: absolute;
        width: calc(100% - 1rem);
        height: calc(100% - 1rem);
        border-radius: 0.25rem;
        overflow: hidden;
        opacity: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        transform: scale(0.875);
        img.rd-input-image {
          pointer-events: none;
          position: relative;
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 0.25rem;
        }
        .rd-input-image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 0.5rem;
          backdrop-filter: blur(5px);
          background: rgba(0, 0, 0, 0.05);
          opacity: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: 0.25s opacity;
          .rd-input-image-icon-wrapper {
            cursor: pointer;
            position: relative;
            width: 1.5rem;
            height: 1.5rem;
            padding: 0 0.25rem;
            border-radius: 0.5rem;
            box-sizing: border-box;
            background: rgba(0, 0, 0, 0.125);
            opacity: 0.5;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: 0.25s transform, 0.25s opacity;
            .rd-input-image-icon-container {
              position: relative;
              width: 100%;
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            &:hover {
              transform: scale(1.125);
              opacity: 1;
            }
          }
        }
        &:hover {
          .rd-input-image-overlay {
            opacity: 1;
          }
        }
      }
      .rd-input-icon-wrapper {
        z-index: 1;
        pointer-events: none;
        position: relative;
        width: 2rem;
        height: 2rem;
        margin-bottom: 0.75rem;
        border-radius: 0.5rem;
        background: rgba(0, 0, 0, 0.05);
        padding: 0 0.5rem;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: 0.25s transform, 0.25s width, 0.25s height;
        .rd-input-icon-container {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: 0.25s transform, 0.25s opacity;
        }
        .rd-input-icon-progress-bar {
          position: absolute;
          top: calc(50% - 0.375rem);
          left: calc(50% - 0.375rem);
          width: 0.75rem;
          height: 0.75rem;
          opacity: 0;
          animation: rd-rotate 500ms linear infinite;
          transition: 0.25s transform, 0.25s opacity;
          .rd-input-icon-progress-bar-outer {
            position: absolute;
            top: 0;
            left: 0;
            width: 0.375rem;
            height: 0.75rem;
            overflow: hidden;
            .rd-input-icon-progress-bar-inner {
              position: absolute;
              top: 0;
              left: 0;
              width: 0.75rem;
              height: 0.75rem;
              border: 2px solid #fff;
              border-radius: 50%;
              border-left-color: transparent;
              border-bottom-color: transparent;
              box-sizing: border-box;
              animation: rd-circular-rotate 1000ms cubic-bezier(0.4, 0, 0.22, 1)
                infinite;
            }
          }
        }
      }
      span.rd-input-text {
        z-index: 1;
        position: relative;
        width: 75%;
        height: 0.75rem;
        text-align: center;
        opacity: 0.5;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        transition: 0.25s transform, 0.25s opacity;
        span.rd-input-text-highlight {
          cursor: pointer;
          position: relative;
          margin: 0 1%;
          color: var(--primary-color);
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
      &.rd-input-area-dragging {
        .rd-input-icon-wrapper {
          width: 3rem;
          height: 3rem;
          transform: translateY(0.75rem);
        }
        span.rd-input-text {
          pointer-events: none;
          opacity: 0;
          transform: scale(1.125);
        }
        .rd-input-border {
          border-color: var(--primary-color);
          &::before {
            opacity: 0.25;
          }
        }
      }
      &.rd-input-area-loading {
        .rd-input-icon-wrapper {
          width: 3rem;
          height: 3rem;
          transform: translateY(0.75rem);
          .rd-input-icon-container {
            transform: scale(0.875);
            opacity: 0;
          }
          .rd-input-icon-progress-bar {
            transform: scale(1);
            opacity: 1;
          }
        }
        span.rd-input-text {
          pointer-events: none;
          opacity: 0 !important;
          transform: scale(1.125);
        }
        .rd-input-border {
          border-color: var(--primary-color);
          &::before {
            opacity: 0.25;
          }
        }
      }
      &:hover {
        span.rd-input-text {
          opacity: 1;
        }
      }
    }
    @media only screen and (max-width: 1024px) {
      label.rd-input-label {
        padding: 0 1.5rem;
      }
      label.rd-input-area {
        width: calc(100% - 3rem);
        margin: 0 1.5rem;
      }
    }
  }
</style>
