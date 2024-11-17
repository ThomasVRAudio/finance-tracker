<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useCharts } from '../composables/useCharts';
import { IVisualizerType } from '../types/charts';
import { $dt } from '@primevue/themes';
import { DatePicker, FloatLabel, MultiSelect, Select } from 'primevue';
import Chart from 'primevue/chart';

const {
    graphData,
    labels,
    ignoredAccounts,
    setIgnoredAccounts,
    accountList,
    options,
    orderedData,
    setVisualizerData
} = useCharts();
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

<style scoped lang="css">
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