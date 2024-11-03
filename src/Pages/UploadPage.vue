<script setup lang="ts">
import { Button, DataTable, Column } from "primevue";
import { computed, onMounted, ref } from "vue";
import * as XLSX from "xlsx";
import IStatement from "../types/statements";

const jsonData = ref<IStatement[]>([]);
const uploadedFiles = ref<File[]>([]);

const allFileNames = ref<IStatement[]>([]);

const removedFiles = ref<string[]>([]);

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;

  Array.from(input.files).forEach((statement) => {
    uploadedFiles.value.push(statement);
    allFileNames.value.push({ name: statement.name });
  });
}

onMounted(() => {
  loadJsonData();
});

function loadJsonData() {
  const storedData = localStorage.getItem("statementData");
  if (storedData) {
    jsonData.value = JSON.parse(storedData);
  }

  jsonData.value.forEach((statement) => {
    allFileNames.value.push({ name: statement.name });
  });
}

function onUpload() {
  if (!uploadedFiles.value && !removedFiles.value) return;

  if (removedFiles.value) {
    let filteredData = jsonData.value.filter((data) => {
      return !removedFiles.value.includes(data.name);
    });

    jsonData.value = filteredData;
  }

  const fileReadPromises = Array.from(uploadedFiles.value).map((file) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const result = e.target?.result;
        if (!result || !(result instanceof ArrayBuffer)) {
          reject(new Error("Failed to read file"));
          return;
        }

        const data = new Uint8Array(result);
        const workbook = XLSX.read(data, { type: "array" });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const json = XLSX.utils.sheet_to_json(worksheet);

        if (Array.isArray(json)) {
          jsonData.value.push({
            name: file.name,
            data: json,
          });
          resolve();
        } else {
          reject(new Error("Parsed data is not an array"));
        }
      };

      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsArrayBuffer(file);
    });
  });

  Promise.all(fileReadPromises)
    .then(() => {
      localStorage.setItem("statementData", JSON.stringify(jsonData.value));
    })
    .catch((error) => {
      console.error("Error processing files:", error);
    });
}

function removeFile(index: number) {
  allFileNames.value.splice(index, 1);
  removedFiles.value.push(allFileNames.value[index].name);
}

function clearStatements() {
  uploadedFiles.value.splice(0, uploadedFiles.value.length);
  allFileNames.value.splice(0, allFileNames.value.length);
  localStorage.setItem("statementData", JSON.stringify([]));
}
</script>

<template>
  <h1>Upload Statements</h1>
  <div class="buttons">
    <label class="button__choose" for="file-upload">Choose File</label>

    <input
      id="file-upload"
      class="button__choose"
      type="file"
      @change="onFileChange"
      accept=".xlsx,.xls"
      multiple
      style="display: none"
    />
    <Button
      class="button__upload"
      label="Upload"
      icon="pi fw pi-upload"
      @click="onUpload"
    />
    <Button
      class="button__clear"
      label="Clear Statements"
      icon="pi fw pi-minus"
      @click="clearStatements"
    />
  </div>
  <DataTable v-if="allFileNames.length" :value="allFileNames">
    <Column field="name" header="File Name"> /></Column>
    <Column header="Actions">
      <template #body="slotProps">
        <Button icon="pi fw pi-minus" @click="removeFile(slotProps.index)" />
      </template>
    </Column>
  </DataTable>
</template>

<style scoped>
h1 {
  margin: 0 0 1rem;
}

.button__upload,
.button__clear,
.button__choose {
  margin: var(--margin-s);
}

.button__choose {
  line-height: normal;
  align-self: center;
  background-color: var(--p-slate-500);
  color: var(--primary-text-color);
  padding: var(--padding-sm) var(--padding-m);
  size: var(--p-primary-font-size);
  border: var(--primary-button-border);
  border-radius: var(--primary-button-border-radius);
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.button__choose:hover {
  background-color: var(--p-slate-400);
}
</style>
