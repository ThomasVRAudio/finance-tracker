<script setup lang="ts">
import FileUpload from "primevue/fileupload";
import { ref } from "vue";

const fileupload = ref(); // Reference to the FileUpload component

const onUpload = (event) => {
  console.log("hi");
  // Access the uploaded files from the event
  const uploadedFiles = event.files; // The uploaded files array
  console.log("Uploaded files:", uploadedFiles); // Log the uploaded files
};
</script>

<template>
  <h1>Upload Statements</h1>
  <FileUpload
    ref="fileupload"
    mode="advanced"
    name="fileupload"
    url="/api/upload"
    accept=".xlsx"
    :maxFileSize="1000000"
    @upload="onUpload"
    @error="console.log('error!')"
    multiple
    :previewWidth="0"
  />
</template>

<style scoped>
h1 {
  margin: 0 0 1rem;
}
</style>
