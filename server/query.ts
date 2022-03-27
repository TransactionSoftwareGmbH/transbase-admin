export default {
  systemDatabase: () => `select distinct database_name from sysdatabases`,
  systemTable: () => `select * from systable`,
  systemUser: () => `select * from sysuser`,
  // TODO: there is surely a better way
  tableSchema: (table: string) => `select * from "${table}" where 1=0 FIRST(0)`,
  selectAllFrom: (table: string) => `select * from "${table}"`,
  insertIntoTable: (table: string, data: ColData) =>
    `insert into ${table} (${Object.keys(data).join(
      ","
    )}) values (${Object.values(data).map(normalizeValue).join(",")})`,
  updateTableRow: (table: string, primaryKey: string, data: ColData) =>
    `update ${table} set (${Object.entries(data)
      .map(([colKey, value]) => `${colKey}=${normalizeValue(value)}`)
      .join(", ")} where primaryKey=${primaryKey}`, // TODO primaryKeys
};

type ColData = { [col: string]: string | number };
function normalizeValue(value: string | number) {
  return typeof value === "string" ? "'" + value + "'" : value;
}
