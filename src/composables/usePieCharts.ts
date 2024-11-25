import { ref, watch } from "vue";
import { IChartRow, IPieChartEntry } from "../types/charts";
import { useCharts } from "./useCharts";

const { orderedData } = useCharts();
let topDebit = ref<IPieChartEntry[]>([]);
let topCredit = ref<IPieChartEntry[]>([]);

function getTopTen() {
  topDebit.value?.splice(0, topDebit.value.length);
  topCredit.value?.splice(0, topCredit.value.length);

  if (orderedData.value)
    Object.keys(orderedData.value).forEach((key) => {
      orderedData.value[key].forEach((row: IChartRow) => {
        let targetArray =
          row.debitCredit === "Credit" ? topCredit.value : topDebit.value;

        let entry = targetArray.find(
          (entry) => entry.name === row.counterpartyName
        );
        if (entry) {
          entry.amount += row.amount;
        } else {
          targetArray.push({
            name: row.counterpartyName,
            amount: row.amount,
          });
        }
      });
    });
  topDebit.value = topDebit.value
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10);

  topCredit.value = topCredit.value
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10);
}

watch(orderedData, () => {
  getTopTen();
});

export function usePieCharts() {
  return {
    getTopTen,
    topDebit,
    topCredit,
  };
}

export default usePieCharts;
