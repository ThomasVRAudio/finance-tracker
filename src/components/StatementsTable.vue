<script setup lang="ts">
import { computed, ComputedRef, onMounted, ref, watch } from 'vue';
import { useCharts } from '../composables/useCharts';
import { ITableRow } from '../types/tables'
import { DataTable, Column } from 'primevue';

const { orderedData } = useCharts();

const tableContent: ComputedRef<ITableRow[]> = computed(() => {
    let data: ITableRow[] = [];
    const startDate = new Date(1900, 0, 1);
    Object.keys(orderedData.value).forEach((month) => {
        orderedData.value[month].forEach((row) => {
            const date = new Date(startDate);
            const formattedDate = new Date(date.setDate(date.getDate() + row.bookDate - 1)).toLocaleDateString('en-GB');
            data.push({ ...row, bookDateFormatted: formattedDate });
        })
    })
    return data;
});

function sortDate() {

}
</script>
<template>

    <DataTable class="datatable" :value="tableContent" paginator paginator-position="bottom" showGridlines stripedRows
        :rows="10" :rowsPerPageOptions="[5, 10, 25, 50, 100]">
        <Column sortable sortField="bookDate" class="column" field="bookDateFormatted" header="Book Date" />
        <Column sortable sortField="amount" header="Amount"><template style="background-color: green;" #body="{ data }">
                <span :class="data.debitCredit === 'Credit' ? 'credit' : 'debit'">
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

<style lang="css">
.datatable {
    font-size: 12px;
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