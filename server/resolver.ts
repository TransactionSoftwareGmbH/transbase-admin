import type { Transbase } from "@transaction/transbase-nodejs";
import Query from "./query";

export class Resolver {
  constructor(private db: Transbase) {}

  getDatabases() {
    return this.db
      .query<{ database_name: string }>(Query.systemDatabase())
      .toArray()
      .map((it) => ({
        name: it.database_name,
        id: it.database_name,
      }));
  }

  getTableNames() {
    return this.db
      .query<{ ttype: "r"; tname: string }>(Query.systemTable())
      .toArray()
      .filter((it) => it.ttype === "r")
      .map((it) => ({ name: it.tname }));
  }

  getTableSchema(table: string) {
    return this.db.query(Query.tableSchema(table)).getColumns();
  }

  getTableResource(table: string) {
    return this.db.query(Query.selectAllFrom(table)).toArray();
  }

  executeQuery(sql: string) {
    const result = this.db.query(sql);
    const data =
      typeof result === "number" ? (result as number) : result.toArray();
    return {
      schema: result.getColumns(),
      data,
      length: typeof data === "number" ? 0 : data.length,
    };
  }
}
