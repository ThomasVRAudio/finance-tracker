<script setup lang="ts">
import { computed, ComputedRef, onMounted, ref, watch } from 'vue';
import { useCharts } from '../composables/useCharts';
import { ITableRow } from '../types/tables'
import { DataTable, Column, InputText, IconField, Button } from 'primevue';
import { FilterMatchMode } from '@primevue/core/api';
import { filter } from '@primeuix/utils';

const { orderedData } = useCharts();

onMounted(() => {
    setAmountFilter();
})

const amountFilterButton = ref({
    matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL_TO,
    icon: 'bigger',
    value: null,
    setGreater: true

})

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
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    counterpartyName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    bookDateFormatted: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    amount: { value: amountFilterButton.value.value, matchMode: amountFilterButton.value.matchMode },
    debitCredit: { value: null, matchMode: FilterMatchMode.EQUALS },
    counterAccount: { value: null, matchMode: FilterMatchMode.CONTAINS },
    accountNumber: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    description: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

function setAmountFilter() {
    amountFilterButton.value.setGreater = !amountFilterButton.value.setGreater;
    if (amountFilterButton.value.setGreater) {
        amountFilterButton.value.matchMode = FilterMatchMode.GREATER_THAN_OR_EQUAL_TO;
        amountFilterButton.value.icon = 'pi-caret-up';
    }
    else {
        amountFilterButton.value.matchMode = FilterMatchMode.LESS_THAN_OR_EQUAL_TO;
        amountFilterButton.value.icon = 'pi-caret-down';
    }
    filters.value.amount.matchMode = amountFilterButton.value.matchMode

}
</script>
<template>

    <DataTable v-model:filters="filters" class="datatable" :value="tableContent" paginator paginator-position="bottom"
        showGridlines stripedRows :rows="10" :rowsPerPageOptions="[5, 10, 25, 50, 100]"
        :globalFilterFields="['bookDateFormatted', 'counterpartyName', 'description']" filterDisplay="row">
        <template #header>
            <div class="flex justify-end">
                <IconField>
                    <InputText class="input" v-model="filters['global'].value" placeholder="Global Search" />
                </IconField>
            </div>
        </template>
        <Column sortable sortField="bookDate" class="column" field="bookDateFormatted" header="Book Date"
            filterField="bookDateFormatted" :showFilterMenu="false">
            <template #filter="{ filterModel, filterCallback }">
                <InputText class="input" v-model="filterModel.value" type="text" @input="filterCallback()" />
            </template>
        </Column>
        <Column class="column" sortable sortField="amount" header="Amount" filterField="amount" :showFilterMenu="false">
            <template #header>

                <Button @click="setAmountFilter">
                    <i :class="['pi', String(amountFilterButton.icon), 'icon-amount']" />
                </Button>
            </template>
            <template style="background-color: green;" #body="{ data }">
                <span :class="data.debitCredit === 'Credit' ? 'credit' : 'debit'">
                    €{{ data.amount }}</span>
            </template>
            <template class="filter__amount" #filter="{ filterModel, filterCallback }">
                <InputText class="input" v-model="filterModel.value" type="text" @input="filterCallback()"
                    :showFilterMenu="false" />
            </template>
        </Column>
        <Column sortable class="column" field="debitCredit" header="Debit / Credit" filterField="debitCredit"
            :showFilterMenu="false">
            <template #filter="{ filterModel, filterCallback }">
                <InputText class="input" v-model="filterModel.value" type="text" @input="filterCallback()" />
            </template>
        </Column>
        <Column sortable class="column" field="counterAccount" header="Counter Account" filterField="counterAccount"
            :showFilterMenu="false">

            <template #filter="{ filterModel, filterCallback }">
                <InputText class="input" v-model="filterModel.value" type="text" @input="filterCallback()" />
            </template>
        </Column>
        <Column sortable class="column" field="counterpartyName" filterField="counterpartyName" :showFilterMenu="false"
            header="Counterparty Name">
            <template #filter="{ filterModel, filterCallback }">
                <InputText class="input" v-model="filterModel.value" type="text" @input="filterCallback()" />
            </template>
        </Column>
        <Column sortable class="column" field="accountNumber" header="Account Number" filterField="accountNumber"
            :showFilterMenu="false">
            <template #filter="{ filterModel, filterCallback }">
                <InputText class="input" v-model="filterModel.value" type="text" @input="filterCallback()" />
            </template>
        </Column>
        <Column class="column" field="code" header="Code" style="max-width: 1rem" />
        <Column sortable class="column" field="description" header="Description" filterField="description"
            :showFilterMenu="false">
            <template #body="{ data }">
                <span>{{ data.description.length > 100 ? data.description.substring(0, 100) + '...' : data.description
                    }}</span>
            </template>
            <template #filter="{ filterModel, filterCallback }">
                <InputText class="input" v-model="filterModel.value" type="text" @input="filterCallback()"
                    :showFilterMenu="false" />
            </template>
        </Column>
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

.column {
    max-width: 100px;
}

.input {
    max-height: 100%;
    max-width: 100%;
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

.filter__amount {
    display: flex;
    flex-direction: row;
    gap: 100px;
}
</style>