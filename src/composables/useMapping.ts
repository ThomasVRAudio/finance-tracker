import { ref } from "vue";
import IColumnMapping from "../types/mapper";

export function useMapping() {
  const mapping = ref<IColumnMapping>({
    bookDate: "",
    account: "",
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

  return {
    mapping,
    setMapping,
    getMapping,
  };
}

export default useMapping;
