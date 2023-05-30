<template>
  <div class="rd-container" ref="rdContainer">
    <div class="rd-background-image-container">
      <img src="/background.svg" class="rd-background-image" />
    </div>
    <form class="rd-panel" @submit="submitHandler">
      <div class="rd-panel-header">
        <h1 class="rd-panel-title rd-headline-2">Selamat datang!</h1>
        <p class="rd-panel-message rd-body-text">
          Silahkan isi identitas anda untuk masuk
        </p>
      </div>
      <div class="rd-panel-body">
        <div
          class="rd-panel-body-wrapper"
          :style="`transform: translateX(${panelIndex * -100}%)`"
        >
          <div class="rd-panel-input-container">
            <div class="rd-panel-input-wrapper" style="margin-bottom: 1rem">
              <rd-input-text class="rd-panel-input" :input="usernameInput" />
            </div>
            <div class="rd-panel-input-wrapper">
              <rd-input-text class="rd-panel-input" :input="passwordInput" />
            </div>
          </div>
          <div class="rd-panel-button-container">
            <div class="rd-panel-error-container">
              <span class="rd-panel-error rd-caption-text">{{
                errorLogin
              }}</span>
            </div>
            <rd-input-button
              label="masuk"
              class="rd-panel-button"
              :disabled="!username || !password"
              :loading="loadingLogin"
              @clicked="userLogin"
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
  import { InputOption } from "~~/interfaces/general";

  definePageMeta({
    middleware: ["no-auth"],
  });
  const { errorHandler } = useMain();
  const { login } = useUser();
  const router = useRouter();
  const emits = defineEmits(["shake"]);

  const rdContainer = ref<HTMLDivElement>(null);

  const usernameInput = ref<InputOption>({
    name: "username",
    placeholder: "johndoe321",
    model: "",
    label: "Username",
    icon: "account",
    disabled: false,
  });
  const passwordInput = ref<InputOption>({
    name: "password",
    placeholder: "ssst...",
    model: "",
    label: "Password",
    icon: "key",
    type: "password",
    disabled: false,
  });

  const panelIndex = ref<number>(0);

  const errorLogin = ref<string>("");

  const loadingLogin = ref<boolean>(false);

  const username: ComputedRef<string> = computed(() => usernameInput.value.model);
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
    if (panelIndex.value === 0) userLogin();
  }

  function userLogin(): void {
    if (username.value && password.value && !loadingLogin.value) {
      loadingLogin.value = true;
      setTimeout(async () => {
        try {
          await login({
            username: username.value,
            password: password.value,
          });
          loadingLogin.value = false;
          errorLogin.value = "";
          animate.exit(rdContainer.value, () => {
            router.push("/");
          });
        } catch (e: any) {
          emits("shake");
          loadingLogin.value = false;
          errorLogin.value = errorHandler(e?.message || "");
        }
      }, 500);
    }
  }

  onMounted(() => {
    animate.init(rdContainer.value);
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
