import { ref } from "vue";
import IColumnMapping from "../types/mapper";

const mapping = ref<IColumnMapping>({
  bookDate: "",
  amount: "",
  accountNumber: "",
  debitCredit: "",
  counterpartyName: "",
  counterAccount: "",
  code: "",
  description: "",
});

function getMapping() {
  const storedData = localStorage.getItem("mapping");
  if (storedData) {
    mapping.value = JSON.parse(storedData);
  }
}

function setMapping() {
  localStorage.setItem("mapping", JSON.stringify(mapping.value));
}

export function useMapping() {
  return {
    mapping,
    setMapping,
    getMapping,
  };
}

export default useMapping;
