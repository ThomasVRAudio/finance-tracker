<script setup lang="ts">
import { ITableRow } from '../types/tables'
import { DataTable, Column } from 'primevue';

defineProps<{
    tableContent: ITableRow[]
}>()

</script>
<template>

    <DataTable class="datatable" :value="tableContent" paginator paginator-position="bottom" showGridlines stripedRows
        :rows="10" :rowsPerPageOptions="[5, 10, 25, 50, 100]">
        <Column sortable class="column" field="bookDate" header="Book Date" />
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