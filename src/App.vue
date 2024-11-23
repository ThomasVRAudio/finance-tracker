<script setup lang="ts">
import "primeicons/primeicons.css";
import { Button, Drawer, ToggleSwitch } from "primevue";
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";

const items = [
  { label: "Home", icon: "pi pi-fw pi-home", command: () => router.push("/") },
  {
    label: "Charts",
    icon: "pi pi-fw pi-chart-line",
    command: () => router.push("/charts"),
  },
  {
    label: "Upload",
    icon: "pi pi-fw pi-file-arrow-up",
    command: () => router.push("/upload"),
  },
  {
    label: "Mapper",
    icon: "pi pi-fw pi-map",
    command: () => router.push("/mapper"),
  },
];

const router = useRouter();
const activeItem = ref(items[0]);
const isDarkMode = ref(false);

const menuIsOpen = ref(true);
onMounted(() => {
  const darkMode = localStorage.getItem("darkMode");

  if (darkMode === "true") {
    isDarkMode.value = true;
  }
});

watch(isDarkMode, () => {
  if (isDarkMode.value) {
    if (!document.documentElement.classList.contains("dark-mode")) {
      document.documentElement.classList.add("dark-mode");
    }
  } else {
    document.documentElement.classList.remove("dark-mode");
  }
  localStorage.setItem("darkMode", String(isDarkMode.value));
});

</script>

<template>
  <div>
    <Button class="menu__button" icon="pi pi-bars" @click="menuIsOpen = true" />
    <Drawer class="menu-holder" v-model:visible="menuIsOpen" position="left">
      <template #header>
        <h3>Menu</h3>
      </template>
      <ul class="menu-list">
        <li v-for="item in items" :key="item.label" @click="item.command">
          <i :class="item.icon" class="menu-icon"></i>
          <span>{{ item.label }}</span>
        </li>
      </ul>
      <ToggleSwitch class="theme__button" v-model="isDarkMode" aria-label="Toggle Light/Dark Mode">
        <template #handle="{ checked }">
          <i :class="['pi', { 'pi-moon': checked, 'pi-sun': !checked }, 'icon-margin']" />
        </template>
      </ToggleSwitch>
    </Drawer>
  </div>
  <div class="layout">

    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu__button {
  background-color: var(--p-gray-500);
  border-color: var(--p-gray-500);
  margin: 20px;
  position: absolute;
}

.menu-list li {
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 18px;
  font-weight: 600;
  border-radius: 10px;
}

.menu-list li:hover {
  background-color: var(--p-primary-color);
  border-radius: 10px;
}

.menu-icon {
  margin-right: 10px;
}

.layout {
  display: flex;
  height: 100vh;
}

.content {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}

.menu-holder {
  height: 100vh;
  border-radius: var(--p-menu-border-radius);
  background-color: var(--p-menu-background);
  border-width: 1px;
  border-style: solid;
  border-color: var(--p-menu-border-color);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.theme__button {
  margin: 10px;
}

.icon-margin {
  transform: scale(0.75);
}
</style>
