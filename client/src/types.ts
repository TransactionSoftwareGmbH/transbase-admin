export type TableSchema = {
  columns: Array<{ name: string; typeName: string }>;
};

export type ColumnNamesByTable = { [tableName: string]: string[] };
