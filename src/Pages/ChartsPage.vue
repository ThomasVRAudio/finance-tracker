<script setup lang="ts">
import { Card, DatePicker, FloatLabel, MultiSelect, Select } from "primevue";
import { computed, onMounted, ref, watch } from "vue";
import { useCharts } from "../composables/useCharts";
import { ITableRow } from "../types/tables";
import StatementsTable from "../components/StatementsTable.vue";
import { IVisualizerType } from "../types/charts";
import { $dt } from "@primevue/themes";
import Chart from "primevue/chart";

const {
  orderedData,
  setVisualizerData,
  graphData,
  labels,
  ignoredAccounts,
  setIgnoredAccounts,
  accountList,
  options
} = useCharts();


onMounted(() => {
  setVisualizerData();
});

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
})

const dates = ref<Date[]>();

watch(dates, () => {
  options.value.dateRange = dates.value;
  setVisualizerData();
});
</script>

<template>
  <div class="page">
    <Card class="card">
      <template #title>Visualizer</template>
      <template #content>
        <div class="selector__container">
          <div class="filters__left">
            <DatePicker class="datepicker" v-model="dates" selectionMode="range" />
          </div>
          <div class="filters__right">
            <Select class="selector" v-model="visualizerChoice" :options="visualizerTypes" name="type"
              optionLabel="name" />

            <FloatLabel>
              <MultiSelect id="over_label" v-model="ignoredAccounts" :options="accountList" filter placeholder=""
                class="multi-select" showClear :maxSelectedLabels="1" @change="setIgnoredAccounts" />
              <label for="over_label">Ignore Accounts</label>
            </FloatLabel>
          </div>
        </div>
        <Chart :type="visualizerChoice.value" :data="chartData" optionLabel="name" optionGroupLabel="name"
          :optionGroupChildren="['name', 'value']" />
      </template>
    </Card>
    <div class="divider"></div>
    <Card class="card">
      <template #content>
        <StatementsTable :tableContent="tableContent" />
      </template>
    </Card>
  </div>
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

.page {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.divider {
  height: var(--margin-l);
}

.card {
  width: 100%;
  max-width: 1500px;
}

.selector {
  margin: var(--margin-s);
}

.selector__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.multi-select {
  width: 25rem;
}

.datepicker {
  min-width: 210px;
}

.filters__right {
  display: flex;
  align-items: center;
}
</style>