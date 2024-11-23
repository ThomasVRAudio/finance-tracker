import { ref, watch } from "vue";
import { IChartRow, IPieChartEntry } from "../types/charts";
import { useCharts } from "./useCharts";

const { orderedData } = useCharts();
let topDebit = ref<IPieChartEntry[]>();

function getTopDebit() {
  let combineTotals: IPieChartEntry[] = [];
  if (orderedData.value)
    Object.keys(orderedData.value).forEach((key) => {
      orderedData.value[key].forEach((row: IChartRow) => {
        let entry = combineTotals.find(
          (entry) => entry.name === row.counterpartyName
        );
        if (row.debitCredit === "Credit") return;
        if (entry) {
          entry.amount += row.amount;
        } else {
          combineTotals.push({
            name: row.counterpartyName,
            amount: row.amount,
          });
        }
      });
    });
  let topTotals = combineTotals
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10);
  topDebit.value = topTotals;
}

watch(orderedData, () => {
  getTopDebit();
});

export function usePieCharts() {
  return {
    getTopDebit,
    topDebit,
  };
}

export default usePieCharts;
