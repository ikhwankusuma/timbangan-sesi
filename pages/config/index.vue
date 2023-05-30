<template>
  <div class="rd-container" ref="rdContainer">
    <div class="rd-background-image-container">
      <img src="/background.svg" class="rd-background-image" />
    </div>
    <form class="rd-panel" @submit="submitHandler">
      <div class="rd-panel-header">
        <h1 class="rd-panel-title rd-headline-2">Konfigurasi aplikasi</h1>
        <p class="rd-panel-message rd-body-text">
          Silahkan isi konfigurasi tersebut sesuai kebutuhan anda.
        </p>
      </div>
      <div class="rd-panel-body">
        <div
          class="rd-panel-body-wrapper"
          :style="`transform: translateX(${panelIndex * -100}%)`"
        >
          <div class="rd-panel-input-container">
            <div class="rd-panel-input-wrapper" style="margin-bottom: 1rem">
              <rd-input-switch class="rd-panel-input" :input="statusInput" />
            </div>
            <div class="rd-panel-input-wrapper" style="margin-bottom: 1rem">
              <rd-input-text class="rd-panel-input" :input="nameInput" />
            </div>
            <div class="rd-panel-input-wrapper">
              <rd-input-text class="rd-panel-input" :input="passwordInput" />
            </div>
          </div>
          <div class="rd-panel-button-container">
            <div class="rd-panel-error-container">
              <span class="rd-panel-error rd-caption-text">{{ error }}</span>
            </div>
            <rd-input-button
              label="lanjut"
              class="rd-panel-button"
              :disabled="!name || !password"
              :loading="loading"
              @clicked="submit"
            />
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
  import gsap from "gsap";
  import { ComputedRef } from "vue";
  import {
    InputOption,
    InputSwitchOption,
    Config,
  } from "~~/interfaces/general";

  definePageMeta({
    middleware: ["no-auth"],
  });
  const { config, errorHandler, createConfig, getConfig } = useMain();
  const { refresh } = useUser();
  const { setThreshold } = useScale();
  const router = useRouter();
  const emits = defineEmits(["shake"]);

  const rdContainer = ref<HTMLDivElement>(null);

  const statusInput = ref<InputSwitchOption>({
    options: ["Trial", "Activated"],
    model: "Trial",
  });
  const nameInput = ref<InputOption>({
    name: "name",
    placeholder: "PT. ABC",
    model: "",
    label: "Nama perusahaan",
    disabled: false,
  });
  const passwordInput = ref<InputOption>({
    name: "password",
    placeholder: "ssst...",
    model: "",
    label: "Password",
    type: "password",
    disabled: false,
  });

  const panelIndex = ref<number>(0);

  const error = ref<string>("");

  const loading = ref<boolean>(false);

  const status: ComputedRef<Config["status"]> = computed(() =>
    statusInput.value.model === "Trial" ? "trial" : "activated"
  );
  const name: ComputedRef<string> = computed(() => nameInput.value.model);
  const password: ComputedRef<string> = computed(
    () => passwordInput.value.model
  );

  const animate = {
    init(rdContainer: HTMLElement): void {
      const tl: GSAPTimeline = gsap.timeline();

      tl.to(rdContainer, {
        opacity: 1,
        duration: 0.5,
      });
    },
    exit(rdContainer: HTMLElement, cb?: () => void): void {
      const tl: GSAPTimeline = gsap.timeline({
        onComplete: cb,
      });

      tl.to(rdContainer, {
        opacity: 0,
        duration: 0.5,
      });
    },
  };

  function submitHandler(e: Event): void {
    e.preventDefault();
    if (panelIndex.value === 0) submit();
  }

  function submit(): void {
    if (name.value && password.value && !loading.value) {
      loading.value = true;
      setTimeout(async () => {
        try {
          const config: Config = await createConfig({
            status: status.value,
            name: name.value,
            password: password.value,
          });
          if (!config) throw new Error("Gagal memuat config");
          loading.value = false;
          error.value = "";
          setThreshold({ threshold: 100 });
          animate.exit(rdContainer.value, () => {
            router.push("/auth");
          });
        } catch (e: any) {
          emits("shake");
          loading.value = false;
          error.value = errorHandler(e?.message || "");
        }
      }, 500);
    }
  }

  onMounted(async () => {
    await getConfig();
    await refresh();

    if (config.value) router.push("/");

    animate.init(rdContainer.value);
    if (config.value) router.push("/auth");
  });
</script>

<style lang="scss" scoped>
  .rd-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: var(--background-depth-two-color);
    display: flex;
    justify-content: flex-end;
    opacity: 0;
    .rd-background-image-container {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      img.rd-background-image {
        position: relative;
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0;
      }
    }
    .rd-panel {
      position: relative;
      width: 100%;
      background: var(--background-depth-one-color);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      .rd-panel-header {
        position: relative;
        width: 100%;
        height: 4rem;
        padding: 0 1rem;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: center;
        p.rd-panel-message {
          position: relative;
          margin-top: 0.125rem;
        }
      }

      .rd-panel-body {
        position: relative;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        display: flex;
        .rd-panel-body-wrapper {
          position: relative;
          width: 100%;
          padding: 0 1rem;
          box-sizing: border-box;
          display: flex;
          flex-shrink: 0;
          flex-direction: column;
          transition: 0.25s transform ease-in-out;
          .rd-panel-title-container {
            position: relative;
            width: 100%;
            margin-bottom: 1.5rem;
            display: flex;
            flex-direction: column;
            p.rd-panel-message {
              position: relative;
              margin-top: 0.25rem;
            }
          }
          .rd-panel-input-container {
            position: relative;
            width: 100%;
            display: flex;
            flex-direction: column;
            .rd-panel-input-wrapper {
              position: relative;
              width: 100%;
              display: flex;
              flex-direction: column;
            }
          }
          .rd-panel-button-container {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 4rem;
            padding: 0 1rem 1rem 1rem;
            box-sizing: border-box;
            display: flex;
            flex-shrink: 0;
            flex-direction: column;
            .rd-panel-error-container {
              position: relative;
              width: 100%;
              height: 1rem;
              display: flex;
              justify-content: center;
              align-items: center;
              span.rd-panel-error {
                position: relative;
                color: var(--error-color);
              }
            }
          }
        }
      }
    }
    @media only screen and (min-width: 1025px) {
      .rd-background-image-container {
        position: relative;
        width: calc(100% - 20rem);
        height: 100%;
      }
      .rd-panel {
        width: 20rem;
        height: 100%;
        .rd-panel-header {
          height: 6rem;
          padding: 0 2rem;
        }
        .rd-panel-body {
          .rd-panel-body-wrapper {
            padding: 0 2rem 2rem 2rem;
            .rd-panel-button-container {
              padding: 0 2rem;
              height: 6rem;
              .rd-panel-error-container {
                height: 2rem;
              }
            }
          }
        }
      }
    }
  }
</style>
