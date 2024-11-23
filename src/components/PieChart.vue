<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import Chart from 'primevue/chart';
import { usePieCharts } from '../composables/usePieCharts';
import { $dt } from '@primevue/themes';

const chartOptions = ref();
const chartData = ref();
const { topDebit } = usePieCharts();

onMounted(() => {
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
})

watch(topDebit, () => {

    chartData.value = setChartData();
})

const setChartData = () => {
    let amounts: number[] = [];
    let labels: string[] = [];
    topDebit.value?.forEach((debit) => {
        amounts.push(debit.amount);
        labels.push(debit.name);
    })
    return {
        labels: labels,
        datasets: [
            {
                data: amounts,
                backgroundColor: [
                    $dt("red.500").value,
                    $dt("blue.400").value,
                    $dt("green.500").value,
                    $dt("yellow.500").value,
                    $dt("purple.500").value,
                    $dt("cyan.300").value,
                    $dt("amber.500").value,
                    $dt("pink.500").value,
                    $dt("teal.300").value,
                    $dt("indigo.500").value
                ],
                borderWidth: 1

            }
        ],
    }
}

const setChartOptions = () => {
    return {
        plugins: {
            legend: {
                display: false
            }
        }
    };
};
</script>

<template>
    <div>
        <Chart type="pie" :data="chartData" :options="chartOptions" class="w-full md:w-[30rem]" />
    </div>
</template>
