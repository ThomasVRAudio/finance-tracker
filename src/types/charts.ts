export interface IVisualizerType {
  name: "Line" | "Bar";
  value: "line" | "bar";
}

export interface IChartRow {
  bookDate: number;
  amount: number;
  accountNumber: string;
  debitCredit: string;
  counterpartyName: string;
  counterAccount: string;
  code: string;
  description: string;
}

export interface IYearlyData {
  [key: string]: IChartRow[];
}

export interface IGraphData {
  [key: string]: IGraphPoint;
}

export interface IGraphPoint {
  credit: number;
  debit: number;
}

export interface IGraphOptions {
  dateRange?: Date[];
  year?: number;
}
