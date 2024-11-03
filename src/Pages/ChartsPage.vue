<script setup lang="ts">
import { $dt } from "@primevue/themes";
import { Select } from "primevue";
import Chart from "primevue/chart";
import { computed, ref } from "vue";
import IVisualizerType from "../types/charts";

const data = [
  { month: "January", credit: 1200.45, debit: 120.45 },
  { month: "February", credit: 310.95, debit: 560.78 },
  { month: "March", credit: 1500.8, debit: 325.67 },
  { month: "April", credit: 275.6, debit: 480.56 },
  { month: "May", credit: 4020.3, debit: 2390.33 },
  { month: "June", credit: -250.75, debit: 210.49 },
  { month: "July", credit: -3500.45, debit: 1780.29 },
  { month: "August", credit: -1800.55, debit: 1520.11 },
  { month: "September", credit: 950.85, debit: 412.75 },
  { month: "October", credit: -75.4, debit: 530.66 },
  { month: "November", credit: 1800.9, debit: 325.48 },
  { month: "December", credit: 2250.15, debit: 890.37 },
];

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

const visualizerChoice = ref<IVisualizerType>({ name: "Line", value: "line" });

const chartData = computed(() => {
  return {
    labels: data.map((item) => item.month),
    datasets: [
      {
        label: "Total credit",
        data: data.map((item) => item.credit),
        borderWidth: 1,
        borderColor: $dt("cyan.300").value,
        backgroundColor: $dt("cyan.300").value,
        tension: 0.4,
      },
      {
        label: "Total debit",
        data: data.map((item) => item.debit),
        borderWidth: 1,
        borderColor: $dt("red.500").value,
        backgroundColor: $dt("red.500").value,
        tension: 0.4,
      },
      {
        label: "Difference",
        data: data.map((item) => item.credit - item.debit),
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
    <Select
      class="selector"
      v-model="visualizerChoice"
      :options="visualizerTypes"
      name="type"
      optionLabel="name"
    />
  </div>
  <Chart
    :type="visualizerChoice.value"
    :data="chartData"
    optionLabel="name"
    optionGroupLabel="name"
    :optionGroupChildren="['name', 'value']"
  />
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

.selector__container {
  display: flex;
  justify-content: end;
}
</style>
