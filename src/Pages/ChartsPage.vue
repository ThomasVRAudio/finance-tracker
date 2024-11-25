<script setup lang="ts">
import { Card, Tag } from "primevue";
import { onMounted, watch } from "vue";
import { useCharts } from "../composables/useCharts";
import StatementsTable from "../components/StatementsTable.vue";
import Graph from "../components/Graph.vue";
import PieChart from "../components/PieChart.vue";
import usePieCharts from "../composables/usePieCharts";

const { topDebit, topCredit } = usePieCharts();

const {
  setVisualizerData,
} = useCharts();

const { getTopTen } = usePieCharts();

onMounted(() => {
  setVisualizerData();
  getTopTen();
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
            <PieChart class="pie-chart" :data="topDebit" mainColor="red.500" />
            <Tag class="tag" value="Debit" severity="danger" />
            <PieChart class="pie-chart" :data="topCredit" mainColor="green.600" />
            <Tag class="tag" value="Crebit" severity="success" />
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
  margin-top: 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  align-content: space-between;
}

.pie-chart {
  margin: var(--margin-s);
}

.tag {
  max-width: 100px;
  min-width: 100px;
  align-self: center;
  margin: var(--margin-l)
}
</style>