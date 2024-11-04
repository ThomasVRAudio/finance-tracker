export default interface IColumnMapping {
  bookDate: string;
  amount: string;
  accountNumber: string;
  debitCredit: string;
  counterpartyName: string;
  counterAccount: string;
  code: string;
  description: string;
  [key: string]: unknown;
}
