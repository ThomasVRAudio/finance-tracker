<script setup lang="ts">
import "primeicons/primeicons.css";
import { Menu, Button } from "primevue";
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
});

function toggleTheme() {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem("darkMode", String(isDarkMode.value));
}
</script>

<template>
  <div class="layout">
    <div class="menu-holder">
      <Menu :model="items" :active-item="activeItem" />
      <Button
        class="theme__button"
        :icon="isDarkMode ? 'pi pi-moon' : 'pi pi-sun'"
        @click="toggleTheme"
        aria-label="Toggle Light/Dark Mode"
      />
    </div>

    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: flex; /* Use flexbox for layout */
  height: 100%;
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
}

.theme__button {
  margin: var(--margin-s);
}
</style>
