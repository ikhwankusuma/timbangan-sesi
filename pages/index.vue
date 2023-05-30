<template>
  <div ref="rdContainer" class="rd-container">
    <div class="rd-session-container">
      <rd-session
        class="rd-session"
        v-for="scale in scales"
        :key="scale._id"
        @open-panel="openPanel"
        :data="scale"
      />
      <div ref="rdSessionLoader" class="rd-session-loader">
        <span
          v-if="scaleQuery.eol"
          class="rd-session-loader-message rd-caption-text"
          >Akhir dari daftar</span
        >
      </div>
    </div>
    <rd-input-button-floating
      class="rd-filter-button"
      label="Filter"
      icon="filter"
      type="primary"
      @clicked="
        emits('open-panel', {
          type: 'filter',
          state: 'show',
        })
      "
    />
  </div>
</template>

<script lang="ts" setup>
  import { Config } from "~~/interfaces/general";
  import { ScaleQuery } from "~~/interfaces/scale";

  definePageMeta({
    middleware: ["auth"],
  });
  const emits = defineEmits(["open-panel"]);

  const router = useRouter();
  const { user } = useUser();
  const { scales, query: scaleQuery, getScales } = useScale();
  const { getSources } = useSource();

  const rdContainer = ref<HTMLDivElement>(null);
  const rdSessionLoader = ref<HTMLDivElement>(null);

  function openPanel({ type, data }: { type: string; data: any }): void {
    emits("open-panel", {
      state: "show",
      type,
      data,
    });
  }

  async function loadData(query?: ScaleQuery): Promise<void> {
    if (query) {
      scaleQuery.value.eol = false;
      scaleQuery.value.skip = 0;
      scaleQuery.value.record = query.record || null;
      scaleQuery.value.start_date = query.start_date || null;
      scaleQuery.value.end_date = query.end_date || null;
    }
    if (!scaleQuery.value.eol) await getScales();
  }

  function intersectionHandler(entries: IntersectionObserverEntry[]): void {
    const entry: IntersectionObserverEntry = entries[0];
    if (entry && entry.isIntersecting) {
      loadData();
    }
  }

  onMounted(async () => {
    await getSources();
    await getScales();

    const observer: IntersectionObserver = new IntersectionObserver(
      intersectionHandler,
      {
        root: rdContainer.value,
        threshold: [0],
      }
    );

    observer.observe(rdSessionLoader.value);
  });
</script>

<style lang="scss" scoped>
  .rd-container {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 2rem 2rem 0 2rem;
    box-sizing: border-box;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    .rd-session-container {
      position: relative;
      width: 100%;
      display: flex;
      gap: 0.75rem;
      flex-direction: column;
      .rd-session-loader {
        position: relative;
        width: 100%;
        padding: 1.25rem 0 2rem 0;
        box-sizing: border-box;
        display: flex;
        flex-shrink: 0;
        justify-content: center;
        align-items: center;
      }
    }
    .rd-filter-button {
      z-index: 2;
      bottom: 2rem;
      left: 2rem;
    }
    @media only screen and (max-width: 1024px) {
      padding: 1rem 1rem 0 1rem;
      .rd-session-container {
        .rd-session-loader {
          padding: 0.25rem 0 1rem 0;
        }
      }
      .rd-filter-button {
        bottom: 1rem;
        left: 1rem;
      }
    }
  }
</style>
