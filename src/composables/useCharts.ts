import { ref, watch } from "vue";
import IStatement from "../types/statements";
import useMapping from "./useMapping";
import {
  IChartRow,
  IGraphData,
  IGraphPoint,
  IYearlyData,
} from "../types/charts";
import useStatements from "./useStatements";

export function useCharts() {
  const { mapping, getMapping } = useMapping();
  const visualizerData = ref<IChartRow[]>([]);
  const orderedData = ref<IYearlyData>({});
  const graphData = ref<IGraphData>({});
  const accountList = ref<string[]>([]);
  const ignoredAccounts = ref<string[]>([]);
  const labels = ref<string[]>([]);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const { getJsonData, jsonData } = useStatements();

  function setVisualizerData() {
    visualizerData.value.splice(0, visualizerData.value.length);
    console.log("visualizer: ", visualizerData.value);
    getJsonData();
    getMapping();
    mapData();
    filterData();
    sortDataByMonths(2024);
    setGraphData();
  }

  function mapData() {
    jsonData.value.forEach((statement) => {
      if (!statement.data) return;
      statement.data.forEach((data: any) => {
        visualizerData.value?.push({
          bookDate: data[mapping.value.bookDate] ?? null,
          amount: data[mapping.value.amount] ?? 0,
          accountNumber: data[mapping.value.accountNumber] ?? "N/A",
          debitCredit: data[mapping.value.debitCredit] ?? "N/A",
          counterpartyName: data[mapping.value.counterpartyName] ?? "N/A",
          counterAccount: data[mapping.value.counterAccount] ?? "N/A",
          code: data[mapping.value.code] ?? "N/A",
          description: data[mapping.value.description] ?? "N/A",
        });

        let counterpartyName: string = data[mapping.value.counterpartyName];
        if (counterpartyName && !accountList.value.includes(counterpartyName)) {
          accountList.value.push(counterpartyName);
        }
      });
    });
  }

  function filterData() {
    visualizerData.value = visualizerData.value.filter((row) => {
      return !ignoredAccounts.value.includes(row.counterpartyName);
    });
  }

  watch(ignoredAccounts, () => {
    setVisualizerData();
  });

  function sortDataByMonths(year: number) {
    orderedData.value = {};

    if (!visualizerData.value.length) return;

    const startDate = new Date(1900, 0, 1);

    visualizerData.value.forEach((row: IChartRow) => {
      let bookDate = new Date(
        startDate.getTime() + (row.bookDate - 1) * 24 * 60 * 60 * 1000
      );
      if (bookDate.getFullYear() !== year) return;

      const monthKey = bookDate.getMonth();

      if (!orderedData.value[monthKey]) {
        orderedData.value[monthKey] = [];
      }

      orderedData.value[monthKey].push(row);
    });

    labels.value = [];

    Object.keys(orderedData.value)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .forEach((key) => {
        labels.value.push(months[key]);
      });
  }

  function setGraphData() {
    Object.keys(orderedData.value).forEach((key) => {
      const graphPoint: IGraphPoint = { credit: 0, debit: 0 };

      orderedData.value[key].forEach((row: IChartRow) => {
        let debitCredit = row.debitCredit.toLocaleLowerCase().trim();
        if (debitCredit === "debet") {
          // need to map data here as well
          graphPoint.debit += row.amount;
        } else if (debitCredit === "credit") {
          graphPoint.credit += row.amount;
          console.log(row.amount);
        } else {
          console.log("not credit or debit: ", debitCredit);
        }
      });
      graphData.value[key] = graphPoint;
    });
  }

  return {
    visualizerData,
    setVisualizerData,
    sortDataByMonths,
    setGraphData,
    graphData,
    accountList,
    ignoredAccounts,
    labels,
  };
}

export default useCharts();
