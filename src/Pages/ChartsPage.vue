<script setup lang="ts">
import { Card, DatePicker, FloatLabel, MultiSelect, Select } from "primevue";
import { computed, onMounted, ref, watch } from "vue";
import { useCharts } from "../composables/useCharts";
import { ITableRow } from "../types/tables";
import StatementsTable from "../components/StatementsTable.vue";
import { IVisualizerType } from "../types/charts";
import { $dt } from "@primevue/themes";
import Chart from "primevue/chart";
import Graph from "../components/Graph.vue";
import PieChart from "../components/PieChart.vue";
import usePieCharts from "../composables/usePieCharts";

const {
  setVisualizerData,
} = useCharts();
const { getTopDebit } = usePieCharts();

onMounted(() => {
  setVisualizerData();
  getTopDebit();
});
</script>

<template>
  <div class="page">
    <Card class="card">
      <template #title>Visualizer</template>
      <template #content class="visualizer-content">
        <div class="visualizer">
          <div class="graph">
            <Graph />
          </div>
          <div class="pie">
            <PieChart />
          </div>
        </div>
      </template>
    </Card>
    <div class="divider"></div>
    <Card class="card">
      <template #content>
        <StatementsTable />
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

.visualizer {
  display: flex;
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
  max-height: 1000px;
}

.graph {
  flex: 3
}

.pie {
  margin-top: 100px;
  flex: 1
}
</style>