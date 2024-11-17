import { ref } from "vue";
import IStatement from "../types/statements";
import * as XLSX from "xlsx";

const jsonData = ref<IStatement[]>([]);
const allFileNames = ref<IStatement[]>([]);
const uploadedFiles = ref<File[]>([]);
const removedFiles = ref<string[]>([]);
const isUploading = ref(false);

function getJsonData() {
  jsonData.value.splice(0, jsonData.value.length);
  const storedData = localStorage.getItem("statementData");
  if (storedData) {
    jsonData.value = JSON.parse(storedData);
  }

  jsonData.value.forEach((statement) => {
    allFileNames.value.push({ name: statement.name });
  });
}

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;

  Array.from(input.files).forEach((statement) => {
    uploadedFiles.value.push(statement);
    allFileNames.value.push({ name: statement.name });
  });
}

function removeDeselectedFiles() {
  if (removedFiles.value) {
    let filteredData = jsonData.value.filter((data) => {
      return !removedFiles.value.includes(data.name);
    });

    jsonData.value = filteredData;
  }
}

function onUpload() {
  if (!uploadedFiles.value && !removedFiles.value) return;
  isUploading.value = true;

  removeDeselectedFiles();

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
      uploadedFiles.value.splice(0, uploadedFiles.value.length);
      isUploading.value = false;
    })
    .catch((error) => {
      console.error("Error processing files:", error);
    });
}

function clearStatements() {
  uploadedFiles.value.splice(0, uploadedFiles.value.length);
  allFileNames.value.splice(0, allFileNames.value.length);
  localStorage.setItem("statementData", JSON.stringify([]));
}

function removeFile(index: number) {
  allFileNames.value.splice(index, 1);
  removedFiles.value.push(allFileNames.value[index].name);
}

export function useStatements() {
  return {
    getJsonData,
    onFileChange,
    clearStatements,
    onUpload,
    removeFile,
    allFileNames,
    uploadedFiles,
    isUploading,
    jsonData,
  };
}

export default useStatements;
