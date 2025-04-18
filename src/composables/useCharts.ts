import { ref, watch } from "vue";
import useMapping from "./useMapping";
import {
  IChartRow,
  IGraphData,
  IGraphOptions,
  IGraphPoint,
  IYearlyData,
} from "../types/charts";
import useStatements from "./useStatements";

const { mapping, getMapping } = useMapping();
const visualizerData = ref<IChartRow[]>([]);
const orderedData = ref<IYearlyData>({});
const graphData = ref<IGraphData>({});
const accountList = ref<string[]>([]);
const ignoredAccounts = ref<string[]>([]);
const labels = ref<string[]>([]);
const options = ref<IGraphOptions>({ year: 2025 });
const creditAmount = ref(0);
const debitAmount = ref(0);

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
  creditAmount.value = 0;
  debitAmount.value = 0;

  if (
    options.value.dateRange &&
    options.value.dateRange[0] &&
    !options.value.dateRange[1]
  )
    return;
  let ignored = localStorage.getItem("ignoredAccounts");
  if (ignored) ignoredAccounts.value = JSON.parse(ignored);

  getJsonData();
  getMapping();
  mapData();
  filterData();
  sortData(options.value);
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
    return (
      ignoredAccounts.value &&
      !ignoredAccounts.value.includes(row.counterpartyName)
    );
  });
}

function sortData(options?: IGraphOptions) {
  orderedData.value = {};

  if (!visualizerData.value.length) return;

  const startDate = new Date(1900, 0, 1);

  let hasSelectedRange = !!options?.dateRange?.[0];

  if (options?.year && !hasSelectedRange) {
    sortByYear(options, startDate);
  } else if (options?.dateRange) {
    sortByDay(options, startDate);
  }
}

function sortByYear(options: IGraphOptions, startDate: Date) {
  visualizerData.value.forEach((row: IChartRow) => {
    let bookDate = new Date(
      startDate.getTime() + (row.bookDate - 1) * 24 * 60 * 60 * 1000
    );

    if (bookDate.getFullYear() !== options.year || isNaN(bookDate.getTime()))
      return;
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

function sortByDay(options: IGraphOptions, startDate: Date) {
  if (!options.dateRange) return;

  const firstDate = options.dateRange[0];
  const lastDate = options.dateRange[1];

  if (firstDate) firstDate.setHours(0, 0, 0, 0);
  if (lastDate) lastDate.setHours(0, 0, 0, 0);

  visualizerData.value.forEach((row: IChartRow) => {
    row.bookDate -= 1;
    let bookDate = new Date(
      startDate.getTime() + (row.bookDate - 1) * 24 * 60 * 60 * 1000
    );

    bookDate.setHours(0, 0, 0, 0);
    if (isNaN(bookDate.getTime())) return;

    if (bookDate < firstDate || bookDate > lastDate) return;
    const dayKey = formatDateToDDMM(bookDate);

    if (!orderedData.value[dayKey]) {
      orderedData.value[dayKey] = [];
    }
    orderedData.value[dayKey].push(row);
  });

  labels.value = [];

  Object.keys(orderedData.value)
    .sort((a, b) => parseInt(a) - parseInt(b))
    .forEach((key) => {
      labels.value.push(String(key));
    });
}

function formatDateToDDMM(date: Date) {
  const day = String(date.getDate()).padStart(2, "0"); // Add leading zero if needed
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1
  return `${day}/${month}`;
}

function setGraphData() {
  graphData.value = {};
  Object.keys(orderedData.value).forEach((key) => {
    const graphPoint: IGraphPoint = { credit: 0, debit: 0 };

    orderedData.value[key].forEach((row: IChartRow) => {
      let debitCredit = row.debitCredit.toLocaleLowerCase().trim();
      if (debitCredit === "debet") {
        graphPoint.debit += row.amount;
        debitAmount.value += row.amount;
      } else if (debitCredit === "credit") {
        graphPoint.credit += row.amount;
        creditAmount.value += row.amount;
      } else {
        console.log("not credit or debit: ", debitCredit);
      }
    });
    graphData.value[key] = graphPoint;
  });
}
function setIgnoredAccounts() {
  let ignored: string[] = [];
  if (ignoredAccounts.value) {
    ignoredAccounts.value.forEach((i) => {
      ignored.push(i);
    });
  }
  localStorage.setItem(
    "ignoredAccounts",
    JSON.stringify(ignoredAccounts.value)
  );
  setVisualizerData();
}

export function useCharts() {
  return {
    visualizerData,
    setVisualizerData,
    sortData,
    setGraphData,
    graphData,
    accountList,
    ignoredAccounts,
    labels,
    options,
    orderedData,
    debitAmount,
    creditAmount,
    setIgnoredAccounts,
  };
}

export default useCharts();
