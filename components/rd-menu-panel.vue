<template>
  <rd-panel
    class="rd-panel"
    label="Menu"
    :state="panelState"
    @exit="emits('exit')"
  >
    <div
      v-if="config.status === 'trial'"
      class="rd-panel-menu"
      @click="clickHandler('activation')"
    >
      <div class="rd-panel-menu-icon-container">
        <rd-svg class="rd-icon" name="key" />
      </div>
      <div class="rd-panel-menu-details-container">
        <span class="rd-panel-menu-name rd-headline-5">Aktivasi</span>
        <span class="rd-panel-menu-description rd-caption-text">{{
          `Kadaluwarsa pada ${dateHandler(new Date(config.exp_date))}`
        }}</span>
      </div>
    </div>
    <div
      v-for="menu in menus"
      :key="menu.action"
      class="rd-panel-menu"
      @click="clickHandler(menu.action)"
    >
      <div class="rd-panel-menu-icon-container">
        <rd-svg class="rd-icon" :name="menu.icon" />
      </div>
      <div class="rd-panel-menu-details-container">
        <span class="rd-panel-menu-name rd-headline-5">{{ menu.name }}</span>
        <span class="rd-panel-menu-description rd-caption-text">{{
          menu.description
        }}</span>
      </div>
    </div>
  </rd-panel>
</template>

<script lang="ts" setup>
  import { ComputedRef } from "vue";
  import { InputOption } from "~~/interfaces/general";
  import { ScaleBody } from "~~/interfaces/scale";

  interface Menu {
    icon: string;
    name: string;
    description: string;
    action: string;
  }

  const { config } = useMain();
  const { logout } = useUser();

  const props = defineProps<{
    state: "idle" | "hide";
  }>();
  const emits = defineEmits(["exit", "open-panel", "change-page"]);

  const panelState = ref<"idle" | "hide">("idle");

  const menus: Menu[] = [
    {
      name: "Customer",
      description: "Lihat, tambah atau ubah customer",
      icon: "account-multiple",
      action: "customer",
    },
    {
      name: "Supplier",
      description: "Lihat, tambah atau ubah supplier",
      icon: "carry",
      action: "supplier",
    },
    {
      name: "Material",
      description: "Lihat, tambah atau ubah material",
      icon: "shape",
      action: "material",
    },
    {
      name: "Pengaturan",
      description: "Ubah nama, alamat dan lain-lain",
      icon: "cog",
      action: "config",
    },
    {
      name: "Log out",
      description: "Keluar dari aplikasi",
      icon: "logout",
      action: "logout",
    },
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

  function clickHandler(action: string): void {
    if (action !== "logout") {
      emits("open-panel", {
        state: "show",
        type: action,
      });
    } else {
      panelState.value = "hide";
      logout();
      emits("change-page", "/auth");
    }
  }
  function dateHandler(x: Date): string {
    const year: number = x.getFullYear();
    const month: number = x.getMonth();
    const date: number = x.getDate();
    const hours: number = x.getHours();
    const minutes: number = x.getMinutes();
    return `${date} ${months[month]} ${year} - ${hours
      .toString()
      .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  }

  watch(
    () => props.state,
    (val) => {
      panelState.value = val;
    }
  );
</script>

<style lang="scss" scoped>
  .rd-panel {
    .rd-panel-menu {
      cursor: pointer;
      position: relative;
      width: 100%;
      padding: 0.5rem;
      border: var(--border);
      border-radius: 0.75rem;
      margin-bottom: 0.75rem;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      .rd-panel-menu-icon-container {
        position: relative;
        width: 2rem;
        height: 2rem;
        padding: 0 0.5rem;
        border-radius: 0.5rem;
        border: var(--border);
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .rd-panel-menu-details-container {
        position: relative;
        height: 100%;
        margin-left: 0.5rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        span.rd-panel-menu-description {
          position: relative;
          margin-top: 0.125rem;
        }
      }
    }
    .rd-panel-footer {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 6rem;
      background: var(--background-depth-one-color);
      padding: 2rem;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
      .rd-panel-button {
        width: 100%;
      }
      &::after {
        content: "";
        position: absolute;
        bottom: 100%;
        left: 0;
        width: 100%;
        height: 1px;
        background: var(--border-color);
      }
    }
  }
</style>
