import { IChartRow } from "./charts";

export type ITableRow = Omit<IChartRow, "bookDate"> & { bookDate: string };
