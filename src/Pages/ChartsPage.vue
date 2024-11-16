<script setup lang="ts">
import { $dt } from "@primevue/themes";
import { FloatLabel, MultiSelect, Select, DatePicker, DataTable, Column } from "primevue";
import Chart from "primevue/chart";
import { computed, ComputedRef, onMounted, ref, watch } from "vue";
import { IChartRow, IGraphOptions, IVisualizerType } from "../types/charts";
import { useCharts } from "../composables/useCharts";

const {
  setVisualizerData,
  graphData,
  accountList,
  ignoredAccounts,
  labels,
  options,
  orderedData
} = useCharts();

onMounted(() => {
  setVisualizerData();
});

type ITableRow = Omit<IChartRow, 'bookDate'> & { bookDate: string };

const tableContent = ref<ITableRow[]>([]);

const visualizerTypes: IVisualizerType[] = [
  {
    name: "Line",
    value: "line",
  },
  {
    name: "Bar",
    value: "bar",
  },
];

const dates = ref<Date[]>();

watch(dates, () => {
  options.value.dateRange = dates.value;
  setVisualizerData();
});

watch(() => Object.keys(orderedData.value).length, () => {
  let data: ITableRow[] = [];
  const startDate = new Date(1900, 0, 1);
  Object.keys(orderedData.value).forEach((month) => {
    orderedData.value[month].forEach((row) => {
      const date = new Date(startDate);
      const formattedDate = new Date(date.setDate(date.getDate() + row.bookDate - 1)).toLocaleDateString('en-GB');
      data.push({ ...row, bookDate: formattedDate });
    })
  })
  tableContent.value = data;
})


const visualizerChoice = ref<IVisualizerType>({ name: "Line", value: "line" });

const chartData = computed(() => {
  return {
    labels: labels.value,
    datasets: [
      {
        label: "Total credit",
        data: Object.keys(graphData.value).map(
          (key) => graphData.value[key].credit
        ),
        borderWidth: 1,
        borderColor: $dt("cyan.300").value,
        backgroundColor: $dt("cyan.300").value,
        tension: 0.4,
      },
      {
        label: "Total debit",
        data: Object.keys(graphData.value).map(
          (key) => graphData.value[key].debit
        ),
        borderWidth: 1,
        borderColor: $dt("red.500").value,
        backgroundColor: $dt("red.500").value,
        tension: 0.4,
      },
      {
        label: "Difference",
        data: Object.keys(graphData.value).map(
          (key) => graphData.value[key].credit - graphData.value[key].debit
        ),
        borderWidth: 1,
        borderColor: $dt("amber.400").value,
        backgroundColor:
          visualizerChoice.value.name === "Line"
            ? $dt("amber.400").value + "33"
            : $dt("amber.400").value,
        tension: 0.4,
        fill: true,
      },
    ],
  };
});
</script>

<template>
  <h1>Visualizer</h1>
  <div class="selector__container">
    <div class="filters__left">
      <DatePicker v-model="dates" selectionMode="range" />
    </div>
    <div class="filters__right">
      <Select class="selector" v-model="visualizerChoice" :options="visualizerTypes" name="type" optionLabel="name" />

      <FloatLabel>
        <MultiSelect id="over_label" v-model="ignoredAccounts" :options="accountList" filter placeholder=""
          class="multi-select" showClear :maxSelectedLabels="1" />
        <label for="over_label">Ignore Accounts</label>
      </FloatLabel>
    </div>
  </div>
  <Chart :type="visualizerChoice.value" :data="chartData" optionLabel="name" optionGroupLabel="name"
    :optionGroupChildren="['name', 'value']" />
  <DataTable class="datatable" :value="tableContent" paginator paginator-position="bottom" showGridlines stripedRows
    :rows="10" :rowsPerPageOptions="[5, 10, 25, 50, 100]">
    <Column sortable class="column" field="bookDate" header="Book Date" />
    <Column header="Amount"><template style="background-color: green;" #body="{ data }"> <span
          :class="data.debitCredit === 'Credit' ? 'credit' : 'debit'">
          €{{ data.amount }}</span></template>
    </Column>
    <Column sortable class="column" field="debitCredit" header="Debit / Credit" />
    <Column sortable class="column" field="counterAccount" header="Counter Account" />
    <Column sortable class="column" field="counterpartyName" header="Counterparty Name" />
    <Column sortable class="column" field="accountNumber" header="Account Number" />
    <Column sortable class="column" field="code" header="Code" />
    <Column class="column" field="description" header="Description" />
  </DataTable>
</template>

<style scoped>
h3 {
  margin: 0 0 1rem;
}

ul {
  list-style-type: none;
  padding: 0;
}

ul li {
  margin: 0.5rem 0;
}

.selector {
  margin: var(--margin-s);
}

.datatable {
  font-size: 12px;
}


.selector__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.multi-select {
  width: 25rem;
}

.filters__right {
  display: flex;
  align-items: center;
}

.debit {
  background-color: var(--p-red-400);
}

.credit {
  background-color: var(--p-green-400);
}

.credit,
.debit {
  padding: var(--margin-xs) var(--margin-s);
  border-radius: 6px;
  text-wrap: nowrap;
  color: var(--p-slate-900);
  font-size: 14px;
  font-weight: 400;
}
</style>
