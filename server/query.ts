export default {
  systemDatabase: () => `select distinct database_name from sysdatabases`,
  systemTable: () => `select * from systable`,
  getUsers: () => `select * from sysuser`,
  grantUser: (name: string, type: "access" | "resource" | "dba") =>
    `grant ${type} to "${name}"`,
  revokeGrantUser: (name: string, type: "access" | "resource" | "dba") =>
    `revoke ${type} from "${name}"`,
  deleteUser: (userid: number) =>
    `delete from sysuser where userid = ${userid}`,
  alterUserPassword: (oldPassword?: string, newPassword = "") =>
    `alter password from '${oldPassword}' TO '${newPassword}'`,
  getUser: (userId: number) => `SELECT * FROM sysuser where userid = ${userId}`,
  systemColumns: () =>
    `select cname, tname from systable t join syscolumn c on c.tsegno=t.segno where ttype ='r'`,
  // TODO: better extract from syscolumn?
  tableSchema: (table: string) => `select * from "${table}" where 1=0 FIRST(0)`,
  selectAllFrom: (table: string, queryParams: QueryParams) =>
    `select * from "${table}"${firstOrderBy(queryParams)}`,
  selectOne: (table: string, primaryKey: ColData) =>
    `select * from "${table}" where ${equals(primaryKey).join(" and")}`,
  insertIntoTable: (table: string, data: ColData) =>
    `insert into ${table} (${Object.keys(data).join(
      ","
    )}) values (${Object.values(data).map(normalizeValue).join(",")})`,
  updateTableRow: (table: string, primaryKey: ColData, data: ColData) =>
    `update ${table} set (${equals(data).join(", ")} where ${equals(
      primaryKey
    ).join(" and")}`,
  deleteTableRow: (table: string, primaryKey: ColData) =>
    `delete from "${table}" where ${equals(primaryKey).join(" and")}`,
  getPrimaryKey: (table: string) =>
    `select cname from systable t join syscolumn c on c.tsegno=t.segno where ttype ='r' and tname='${table}' and c.ckey!=0`,
};

export type ColData = { [col: string]: string | number };

export type QueryParams = {
  filter?: {};
  range?: [from: number, to: number];
  sort?: [columnName: string, direction: "ASC" | "DESC"];
};

function firstOrderBy({ range, sort }: QueryParams) {
  const orderBy = sort ? ` order by "${sort[0]}" ${sort[1]}` : "";
  if (range) {
    return ` first(${range[0] + 1} to ${range[1] + 1}${orderBy})`;
  } else {
    return orderBy;
  }
}

function normalizeValue(value: string | number) {
  return typeof value === "string" ? "'" + value + "'" : value;
}

function equals(data: ColData) {
  return Object.entries(data).map(
    ([colKey, value]) => `${colKey}=${normalizeValue(value)}`
  );
}
