<script setup lang="ts">
import { computed } from 'vue';
import Chart from 'primevue/chart';
import { $dt } from '@primevue/themes';
import { IPieChartEntry } from '../types/charts';

const props = defineProps<{
    data: IPieChartEntry[],
    mainColor?: string;
}>();


const chartData = computed(() => {
    let amounts: number[] = [];
    let labels: string[] = [];
    props.data.forEach((debit) => {
        amounts.push(debit.amount);
        labels.push(debit.name);
    })
    return {
        labels: labels,
        datasets: [
            {
                data: amounts,
                backgroundColor: [
                    $dt(props.mainColor ?? "red.500").value,
                    $dt("blue.400").value,
                    $dt("green.300").value,
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
})

const chartOptions = {
    plugins: {
        legend: {
            display: false
        }
    },
    responsize: false,
    maintainAspectRatio: false
};
</script>

<template>
    <div>
        <Chart type="pie" :height="250" :data="chartData" :options="chartOptions" class="w-full md:w-[30rem]" />
    </div>
</template>
