<script setup lang="ts">
import {
  Card,
  FloatLabel,
  InputGroup,
  InputGroupAddon,
  InputText,
  Button,
} from "primevue";
import useMapping from "../composables/useMapping";
import { onMounted } from "vue";

const { mapping, getMapping, setMapping } = useMapping();

onMounted(() => {
  getMapping();
});
</script>

<template>
  <h1>Mapper</h1>
  <Card class="panel">
    <template #title>Map Statement Column Names</template>
    <template #subtitle>
      Use this tool to match your file's column names to the standard names used
      by the app.
    </template>
    <template #footer>
      <h3>Example:</h3>
      <p>
        If your file has a column called "Deposit" for incoming funds, map it to
        the app's Credit field. This ensures that your data imports correctly
        and is organized as expected.
      </p>
      <p>
        Simply select the standard field for each of your file's columns to
        complete the mapping.
      </p>
    </template>
  </Card>
  <div class="inputs">
    <div>
      <InputGroup class="input__group">
        <InputGroupAddon>
          <i class="pi fw pi-calendar"></i>
        </InputGroupAddon>
        <FloatLabel>
          <InputText id="bookDate" v-model="mapping.bookDate" />
          <label for="bookDate">Book Date</label>
        </FloatLabel>
      </InputGroup>

      <InputGroup class="input__group">
        <InputGroupAddon>
          <i class="pi fw pi-user"></i>
        </InputGroupAddon>
        <FloatLabel>
          <InputText id="account" v-model="mapping.account" />
          <label for="account">Account</label>
        </FloatLabel>
      </InputGroup>

      <InputGroup class="input__group">
        <InputGroupAddon>
          <i class="pi fw pi-euro"></i>
        </InputGroupAddon>
        <FloatLabel>
          <InputText id="amount" v-model="mapping.amount" />
          <label for="amount">Amount</label>
        </FloatLabel>
      </InputGroup>
    </div>
    <div>
      <InputGroup class="input__group">
        <InputGroupAddon>
          <i class="pi fw pi-credit-card"></i>
        </InputGroupAddon>
        <FloatLabel>
          <InputText id="accountNumber" v-model="mapping.accountNumber" />
          <label for="accountNumber">Account Number</label>
        </FloatLabel>
      </InputGroup>

      <InputGroup class="input__group">
        <InputGroupAddon>
          <i class="pi fw pi-chart-line"></i>
        </InputGroupAddon>
        <FloatLabel>
          <InputText id="debitCredit" v-model="mapping.debitCredit" />
          <label for="debitCredit">Credit / Debit</label>
        </FloatLabel>
      </InputGroup>

      <InputGroup class="input__group">
        <InputGroupAddon>
          <i class="pi fw pi-users"></i>
        </InputGroupAddon>
        <FloatLabel>
          <InputText id="counterpartyName" v-model="mapping.counterpartyName" />
          <label for="counterpartyName">Counterparty Name</label>
        </FloatLabel>
      </InputGroup>
    </div>
    <div>
      <InputGroup class="input__group">
        <InputGroupAddon>
          <i class="pi fw pi-address-book"></i>
        </InputGroupAddon>
        <FloatLabel>
          <InputText id="counterAccount" v-model="mapping.counterAccount" />
          <label for="counterAccount">Counter Account</label>
        </FloatLabel>
      </InputGroup>

      <InputGroup class="input__group">
        <InputGroupAddon>
          <i class="pi fw pi-key"></i>
        </InputGroupAddon>
        <FloatLabel>
          <InputText id="code" v-model="mapping.code" />
          <label for="code">Code</label>
        </FloatLabel>
      </InputGroup>

      <InputGroup class="input__group">
        <InputGroupAddon>
          <i class="pi fw pi-info-circle"></i>
        </InputGroupAddon>
        <FloatLabel>
          <InputText id="description" v-model="mapping.description" />
          <label for="description">Description</label>
        </FloatLabel>
      </InputGroup>
      <div class="button__container">
        <Button
          class="button__save"
          label="Save mapping"
          icon="pi fw pi-save"
          @click="setMapping"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
h1 {
  margin-bottom: var(--margin-xl);
}

.input__group {
  width: 20rem;
  margin: var(--margin-xl);
  margin-right: var(--marin-s);
}

.inputs {
  display: flex;
}

.button__container {
  display: flex;
  justify-content: end;
}
</style>
