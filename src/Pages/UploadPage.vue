<script setup lang="ts">
import {
  Button,
  DataTable,
  Column,
  Paginator,
  PageState,
  Panel,
} from "primevue";
import { computed, onMounted, ref } from "vue";

import useStatements from "../composables/useStatements";

const pageSize = ref(5);
const currentPage = ref(0);

const {
  onFileChange,
  onUpload,
  getJsonData,
  clearStatements,
  removeFile,
  allFileNames,
  uploadedFiles,
  isUploading,
} = useStatements();

onMounted(() => {
  getJsonData();
});

const visibleStatements = computed(() => {
  return allFileNames.value.slice(
    currentPage.value * pageSize.value,
    pageSize.value + currentPage.value * pageSize.value
  );
});

function onPageChange(pageState: PageState) {
  currentPage.value = pageState.page;
}

function onPageSizeChange(rows: number) {
  pageSize.value = rows;
}
</script>

<template>
  <h1>Upload Statements</h1>
  <div class="buttons">
    <div>
      <label class="button__choose" for="file-upload">Choose Files</label>
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
        :disabled="!uploadedFiles.length"
        label="Upload"
        icon="pi fw pi-upload"
        @click="onUpload"
        :loading="isUploading"
      />
    </div>
    <Button
      class="button__clear"
      label="Clear all Statements"
      icon="pi fw pi-minus"
      @click="clearStatements"
      :disabled="!allFileNames.length"
    />
  </div>
  <DataTable v-if="visibleStatements.length" :value="visibleStatements">
    <Column field="name" header="File Name"> /></Column>
    <Column header="">
      <template #body="slotProps">
        <Button icon="pi fw pi-minus" @click="removeFile(slotProps.index)" />
      </template>
    </Column>
  </DataTable>
  <Paginator
    v-if="visibleStatements.length"
    @update:rows="onPageSizeChange"
    @page="onPageChange"
    :rows="pageSize"
    :totalRecords="allFileNames.length"
    :rowsPerPageOptions="[5, 10, 20, 50]"
  ></Paginator>
  <Panel class="panel" v-else header="You currently don't have any data">
    <p>Add bank statements by clicking on the Choose Files button</p>
  </Panel>
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
  background-color: var(--p-slate-300);
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

.button__clear {
  background-color: var(--p-orange-400);
  border-color: var(--p-orange-400);
}

.button__clear:hover {
  background-color: var(--p-orange-300) !important;
  border-color: var(--p-orange-300) !important;
}

.buttons {
  display: flex;
  justify-content: space-between;
  padding-bottom: var(--padding-m);
}

.panel {
  width: 35rem;
  margin: var(--margin-s);
}
</style>
