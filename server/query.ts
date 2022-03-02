export default {
  systemDatabase: () => `select distinct database_name from sysdatabases`,
  systemTable: () => `select * from systable`,
  systemUser: () => `select * from sysuser`,
  // TODO: there is surely a better way
  tableSchema: (table: string) => `select * from "${table}" where 1=0`,
  selectAllFrom: (table: string) => `select * from "${table}"`,
};
