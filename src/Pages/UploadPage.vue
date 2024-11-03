<script setup lang="ts">
import { Button } from "primevue";
import { onMounted, ref } from "vue";
import * as XLSX from "xlsx";

const jsonData = ref<unknown[]>([]);
const files = ref<FileList | null>(null);

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;

  files.value = input.files;
}

onMounted(() => {
  loadJsonData();
});

function loadJsonData() {
  const storedData = localStorage.getItem("statementData");
  if (storedData) {
    jsonData.value = JSON.parse(storedData);
  }
}

function onUpload() {
  if (!files.value) return;

  Array.from(files.value).forEach((file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result;
      if (!result || !(result instanceof ArrayBuffer)) return;

      const data = new Uint8Array(result);
      const workbook = XLSX.read(data, { type: "array" });

      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      const json = XLSX.utils.sheet_to_json(worksheet);

      if (Array.isArray(json)) {
        jsonData.value.push(...json);
      } else {
        console.error("Parsed data is not an array", json);
      }

      //console.log("Saving to localStorage:", JSON.stringify(jsonData.value));
      localStorage.setItem("statementData", JSON.stringify(jsonData.value));
    };

    reader.readAsArrayBuffer(file);
  });
}

function clearStatements() {
  localStorage.setItem("statementData", JSON.stringify([]));
  jsonData.value.length = 0;
  files.value = null;
}
</script>

<template>
  <h1>Upload Statements</h1>
  <input type="file" @change="onFileChange" accept=".xlsx,.xls" multiple />
  <Button label="Upload" icon="pi fw pi-upload" @click="onUpload" />
  <Button
    label="Clear Statements"
    icon="pi fw pi-upload"
    @click="clearStatements"
  />
</template>

<style scoped>
h1 {
  margin: 0 0 1rem;
}
</style>
