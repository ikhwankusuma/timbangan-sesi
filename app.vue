<template>
  <div class="rd-layout">
    <rd-alert />
    <div class="rd-page">
      <header v-if="config" class="rd-header">
        <div class="rd-application-details-container">
          <h1 class="rd-application-title rd-headline-1">
            {{ config.name }}
          </h1>
          <p
            v-if="config.address || config.email || config.phone"
            class="rd-application-address rd-headline-4"
          >
            {{ config.address || config.email || config.phone }}
          </p>
        </div>
        <rd-input-button-small
          v-if="viewMode !== 'desktop'"
          icon="dots"
          @clicked="panelHandler({ state: 'show', type: 'menu' })"
          tooltip="menu"
        />
      </header>
      <main ref="rdBody" class="rd-body">
        <nuxt-page
          @change-page="changeHandler"
          class="rd-main"
          @open-panel="panelHandler"
        />
      </main>
    </div>
    <div v-if="viewMode === 'desktop'" class="rd-subpage">
      <div class="rd-header">
        <rd-input-button-small
          icon="plus"
          @clicked="panelHandler({ state: 'show', type: 'session-add' })"
          tooltip="buat sesi"
        />
        <rd-input-button-small
          icon="dots"
          @clicked="panelHandler({ state: 'show', type: 'menu' })"
          tooltip="menu"
        />
      </div>
      <div class="rd-body">
        <div v-if="config?.status === 'trial'" class="rd-panel-trial">
          <div class="rd-panel-header">
            <span class="rd-panel-name rd-headline-5">Trial Version</span>
            <rd-input-button-small
              icon="key"
              @clicked="panelHandler({ state: 'show', type: 'activation' })"
            />
          </div>
          <div class="rd-panel-body">
            <span class="rd-panel-placeholder rd-caption-text"
              >Program akan kadaluwarsa pada:</span
            >
            <span class="rd-panel-value rd-headline-5">{{
              dateHandler(new Date(config.exp_date))
            }}</span>
          </div>
        </div>
        <div class="rd-panel-count">
          <div class="rd-panel-header">
            <span class="rd-panel-name rd-headline-5">Total penimbangan</span>
            <rd-input-button-small icon="inflow" />
          </div>
          <div class="rd-panel-body">
            <div class="rd-panel-value-container">
              <span class="rd-panel-value rd-headline-1">{{
                summary?.toLocaleString("de-DE")
              }}</span>
              <span class="rd-panel-placeholder rd-headline-5">kilogram</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <rd-session-add-panel
      v-if="panelOpened === 'session-add'"
      :state="panelState"
      :data="panelData[0]"
      @exit="panelHandler({ state: 'hide' })"
      @open-panel="panelHandler"
    />
    <rd-session-panel
      v-if="panelOpened === 'session'"
      :state="panelState"
      :data="panelData[0]"
      @exit="panelHandler({ state: 'hide' })"
      @open-panel="panelHandler"
      @change-page="changeHandler"
    />
    <rd-source-add-panel
      v-if="panelOpened === 'source-add'"
      :state="panelState"
      :data="panelData[0]"
      @exit="panelHandler({ state: 'hide' })"
      @open-panel="panelHandler"
    />
    <rd-menu-panel
      v-if="panelOpened === 'menu'"
      :state="panelState"
      :data="panelData[0]"
      @exit="panelHandler({ state: 'hide' })"
      @open-panel="panelHandler"
      @change-page="changeHandler"
    />
    <rd-customer-panel
      v-if="panelOpened === 'customer'"
      :state="panelState"
      :data="panelData[0]"
      @exit="panelHandler({ state: 'hide' })"
      @open-panel="panelHandler"
    />
    <rd-customer-add-panel
      v-if="panelOpened === 'customer-add'"
      :state="panelState"
      :data="panelData[0]"
      @exit="panelHandler({ state: 'hide' })"
      @open-panel="panelHandler"
    />
    <rd-supplier-panel
      v-if="panelOpened === 'supplier'"
      :state="panelState"
      :data="panelData[0]"
      @exit="panelHandler({ state: 'hide' })"
      @open-panel="panelHandler"
    />
    <rd-supplier-add-panel
      v-if="panelOpened === 'supplier-add'"
      :state="panelState"
      :data="panelData[0]"
      @exit="panelHandler({ state: 'hide' })"
      @open-panel="panelHandler"
    />
    <rd-material-panel
      v-if="panelOpened === 'material'"
      :state="panelState"
      :data="panelData[0]"
      @exit="panelHandler({ state: 'hide' })"
      @open-panel="panelHandler"
    />
    <rd-material-add-panel
      v-if="panelOpened === 'material-add'"
      :state="panelState"
      :data="panelData[0]"
      @exit="panelHandler({ state: 'hide' })"
      @open-panel="panelHandler"
    />
    <rd-config-panel
      v-if="panelOpened === 'config'"
      :state="panelState"
      :data="panelData[0]"
      @exit="panelHandler({ state: 'hide' })"
      @open-panel="panelHandler"
    />
    <rd-activation-panel
      v-if="panelOpened === 'activation'"
      :state="panelState"
      :data="panelData[0]"
      @exit="panelHandler({ state: 'hide' })"
      @open-panel="panelHandler"
    />
    <rd-filter-panel
      v-if="panelOpened === 'filter'"
      :state="panelState"
      :data="panelData[0]"
      @exit="panelHandler({ state: 'hide' })"
      @open-panel="panelHandler"
    />
  </div>
</template>

<script lang="ts" setup>
  import gsap from "gsap";

  const route = useRoute();
  const router = useRouter();
  const { config, viewMode, getConfig } = useMain();
  const { refresh } = useUser();
  const { initSocket } = useSocket();
  const { loadThreshold, summary } = useScale();

  interface PanelHandlerOption {
    state: "show" | "hide";
    type?: PanelType;
    data?: any;
  }
  type PanelType =
    | "session-add"
    | "session"
    | "source-add"
    | "menu"
    | "customer"
    | "customer-add"
    | "supplier"
    | "supplier-add"
    | "material"
    | "material-add"
    | "config"
    | "activation"
    | "filter";

  const rdBody = ref<HTMLDivElement>(null);

  const panelState = ref<"idle" | "hide">("idle");
  const panelData = ref<any[]>([]);
  const panelOpened = ref<PanelType>(null);
  const panelSequence = ref<PanelType[]>([]);

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

  function panelHandler({ state, type, data }: PanelHandlerOption): void {
    if (state === "show") {
      if (panelSequence.value.length === 0) {
        panelState.value = "idle";
        panelSequence.value.unshift(type);
        panelData.value.unshift(data || {});
        panelOpened.value = panelSequence.value[0];
      } else {
        panelState.value = "hide";
        panelSequence.value.push(type);
        panelData.value.push(data || {});
      }
    } else {
      panelOpened.value = null;
      let sequence: PanelHandlerOption["type"] = null;
      let payload: PanelHandlerOption["data"] = null;
      if (panelState.value === "hide") {
        panelState.value = "idle";
        sequence = panelSequence.value.pop();
        payload = panelData.value.pop();
        if (sequence === panelSequence.value[0]) {
          panelData.value.splice(0, 1);
          panelSequence.value.splice(0, 1);
        }
      } else {
        panelState.value = "hide";
        panelData.value.splice(0, 1);
        panelSequence.value.splice(0, 1);
        sequence = panelSequence.value.pop();
        payload = panelData.value.pop();
      }
      if (sequence) {
        setTimeout(() => {
          panelState.value = "idle";
          panelSequence.value.unshift(sequence);
          panelData.value.unshift(payload || {});
          panelOpened.value = panelSequence.value[0];
        }, 50);
      }
    }
  }
  function resizeHandler(e: MediaQueryList | MediaQueryListEvent): void {
    if (e.matches) viewMode.value = "mobile";
    else viewMode.value = "desktop";
  }
  function changeHandler(to: string, e?: MouseEvent): MouseEvent {
    animate.leavePage(rdBody.value, () => {
      if (route.path !== (to || "/")) {
        router.push(to || "/");
        setTimeout(() => {
          animate.enterPage(rdBody.value);
        }, 250);
      }
    });
    return e;
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

  const animate: {
    [k: string]: (...a: any) => GSAPTimeline | void;
  } = {
    leavePage(rdBody: HTMLElement, cb?: () => void): void {
      const tl: GSAPTimeline = gsap.timeline({
        onComplete: cb,
      });

      tl.to(rdBody, {
        opacity: 0,
        duration: 0.25,
      });
    },
    enterPage(rdBody: HTMLElement, cb?: () => void): void {
      const tl: GSAPTimeline = gsap.timeline({
        onComplete: cb,
      });

      tl.to(rdBody, {
        opacity: 1,
        duration: 0.25,
      });
    },
  };

  watch(
    () => viewMode.value,
    (val, oldVal) => {
      if (val && oldVal) location.reload();
    }
  );

  onMounted(async () => {
    await refresh();
    await getConfig();

    const mediaQuery: MediaQueryList = window.matchMedia("(max-width: 1024px)");
    mediaQuery.addEventListener("change", resizeHandler);
    resizeHandler(mediaQuery);

    loadThreshold();
    initSocket();
  });
</script>

<style lang="scss" scoped>
  .rd-layout {
    position: relative;
    width: 100vw;
    height: 100vh;
    display: flex;
    .rd-page {
      z-index: 2;
      position: relative;
      width: calc(100% - 20rem);
      height: 100%;
      display: flex;
      flex-direction: column;
      header.rd-header {
        position: relative;
        width: 100%;
        height: 6rem;
        padding: 0 2rem;
        border-bottom: var(--border);
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .rd-application-details-container {
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          p.rd-application-address {
            position: relative;
            opacity: 0.5;
          }
        }
      }
      main.rd-body {
        position: relative;
        width: 100%;
        height: calc(100% - 6rem);
        display: flex;
      }
    }
    .rd-subpage {
      z-index: 1;
      position: relative;
      width: 20rem;
      height: 100%;
      border-left: var(--border);
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      .rd-header {
        position: relative;
        width: 100%;
        height: 6rem;
        padding: 2rem;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
      }
      .rd-body {
        position: relative;
        width: 100%;
        padding: 0 2rem;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        .rd-panel-trial,
        .rd-panel-count {
          position: relative;
          width: 100%;
          border: var(--border);
          border-radius: 0.75rem;
          padding: 0.75rem;
          margin-bottom: 0.75rem;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          .rd-panel-header {
            position: relative;
            width: 100%;
            height: 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .rd-panel-body {
            position: relative;
            margin-top: 0.75rem;
            display: flex;
            flex-direction: column;
            span.rd-panel-placeholder {
              position: relative;
              margin-bottom: 0.125rem;
            }
            .rd-panel-value-container {
              position: relative;
              display: flex;
              align-items: flex-end;
              span.rd-panel-value {
                position: relative;
                line-height: 1;
              }
              span.rd-panel-placeholder {
                position: relative;
                line-height: 1;
                margin: 0 0 0.125rem 0.25rem;
                opacity: 0.5;
              }
            }
          }
        }
      }
    }
    @media only screen and (max-width: 1024px) {
      .rd-page {
        width: 100%;
        header.rd-header {
          height: 4rem;
          padding: 0 1rem;
        }
        main.rd-body {
          height: calc(100% - 4rem);
        }
      }
    }
  }
</style>

<style lang="scss">
  :root {
    // --primary-color: #6bc785;
    // --secondary-color: #fff;
    // --error-color: #ff584c;
    // --warning-color: #ffc904;
    // --success-color: #6bc785;
    // --border-color: #345;
    // --font-main-color: #c0d1e2;
    // --font-secondary-color: #7f7f7f;
    // --background-depth-one-color: #123;
    // --background-depth-two-color: #345;
    // --background-depth-three-color: #567;
    // --border: 1px solid var(--border-color);
    // --box-shadow: 0 0.5rem 1rem rgba(0, 5, 10, 0.125);
    --primary-color: #6bc785;
    --secondary-color: #fff;
    --error-color: #ff584c;
    --warning-color: #ffc904;
    --success-color: #6bc785;
    --border-color: #ececec;
    --font-main-color: #020f13;
    --font-secondary-color: #7f7f7f;
    --background-depth-one-color: #ffffff;
    --background-depth-two-color: #f8f8f8;
    --background-depth-three-color: #ececec;
    --border: 1px solid var(--border-color);
    --box-shadow: 0 0.5rem 1rem rgba(199, 199, 199, 0.125);
  }
  html,
  body {
    position: relative;
    width: 100vw;
    margin: 0;
    padding: 0;
    font-size: 24px;
    font-family: "Quicksand", -apple-system, BlinkMacSystemFont, sans-serif;
    color: var(--font-main-color);
    background: var(--background-depth-one-color);
    overflow-x: hidden;
    @media only screen and (max-width: 1900px) and (min-width: 1600px) {
      font-size: 22px;
    }
    @media only screen and (max-width: 1599px) and (min-width: 1480px) {
      font-size: 21px;
    }
    @media only screen and (max-width: 1479px) and (min-width: 1380px) {
      font-size: 20px;
    }
    @media only screen and (max-width: 1379px) and (min-width: 1320px) {
      font-size: 19px;
    }
    @media only screen and (max-width: 1319px) and (min-width: 1024px) {
      font-size: 18px;
    }
    @media only screen and (max-width: 640px) {
      font-size: 24px;
    }
    @media only screen and (max-width: 320px) {
      font-size: 17px;
    }
    @media only screen and (max-width: 1024px) {
      height: auto;
      overflow-y: auto;
    }
  }
  *::-webkit-scrollbar {
    display: none;
    opacity: 0;
  }
  .rd-headline-1 {
    font-size: 1.25rem;
    font-weight: 700;
    font-family: "Quicksand";
  }
  .rd-headline-2 {
    font-size: 1rem;
    font-weight: 700;
    font-family: "Quicksand";
  }
  .rd-headline-3 {
    font-size: 0.85rem;
    font-weight: 700;
    font-family: "Quicksand";
  }
  .rd-headline-4 {
    font-size: 0.75rem;
    font-weight: 700;
    font-family: "Quicksand";
  }
  .rd-headline-5 {
    font-size: 0.65rem;
    font-weight: 700;
    font-family: "Quicksand";
  }
  .rd-headline-6 {
    font-size: 0.55rem;
    font-weight: 700;
    font-family: "Quicksand";
  }
  .rd-subtitle-text {
    font-size: 0.65rem;
    font-weight: 500;
    font-family: "Quicksand";
  }
  .rd-body-text {
    font-size: 0.6rem;
    font-weight: 500;
    font-family: "Quicksand";
  }
  .rd-caption-text {
    font-size: 0.55rem;
    font-family: "Quicksand";
    font-weight: 500;
    color: var(--font-main-color);
    opacity: 0.5;
  }
  .rd-button-text {
    font-family: "Quicksand";
    font-size: 0.55rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.125rem;
    transform: translateX(0.0625rem);
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  span {
    color: var(--font-main-color);
    margin: 0;
    padding: 0;
  }
  @keyframes rd-loading {
    0% {
      left: 0;
      right: 100%;
    }
    50% {
      left: 0;
      right: 0;
    }
    100% {
      left: 100%;
      right: 0;
    }
  }
  @keyframes rd-shake {
    0% {
      transform: translate(1px, 1px);
    }
    10% {
      transform: translate(-1px, -2px);
    }
    20% {
      transform: translate(-3px, 0px);
    }
    30% {
      transform: translate(3px, 2px);
    }
    40% {
      transform: translate(1px, -1px);
    }
    50% {
      transform: translate(-1px, 2px);
    }
    60% {
      transform: translate(-3px, 1px);
    }
    70% {
      transform: translate(3px, 1px);
    }
    80% {
      transform: translate(-1px, -1px);
    }
    90% {
      transform: translate(1px, 2px);
    }
    100% {
      transform: translate(1px, -2px);
    }
  }
  @keyframes rd-rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes rd-circular-rotate {
    0% {
      transform: rotate(0);
    }
    50% {
      transform: rotate(-140deg);
    }
    100% {
      transform: rotate(0);
    }
  }
</style>
