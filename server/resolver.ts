import type { Transbase } from "@transaction/transbase-nodejs";
import Query, { ColData, QueryParams } from "./query";
import { parsePrimaryKey } from "./utils";

export class Resolver {
  constructor(private db: Transbase) {}

  getDatabases() {
    try {
      return this.db
        .query<{ database_name: string }>(Query.systemDatabase())
        .toArray()
        .map((it) => ({
          name: it.database_name,
          id: it.database_name,
        }));
    } catch (e) {
      return [];
    }
  }

  getTableNames() {
    return this.db
      .query<{ ttype: "r"; tname: string }>(Query.systemTable())
      .toArray()
      .filter((it) => it.ttype === "r")
      .map((it) => ({ name: it.tname }));
  }

  getColumnNames() {
    return Object.fromEntries(
      this.db
        .query<{ tname: string; cname: string; ctype: string }>(
          Query.systemColumns()
        )
        .toArray()
        .reduce((map, { tname, cname }) => {
          const key = tname.toLowerCase();
          if (!map.has(key)) {
            map.set(key, []);
          }
          map.get(key)!.push(cname);
          return map;
        }, new Map<string, string[]>())
        .entries()
    );
  }

  getTableSchema(table: string) {
    const colInfo = this.db.query(Query.tableSchema(table)).getColumns();
    const keys = this.db
      .query<{ cname: string }>(Query.getPrimaryKey(table))
      .toArray();
    return { columns: colInfo, primaryKey: keys.map((it) => it.cname) };
  }

  getMany(table: string, params: QueryParams) {
    if (params?.sort?.[0] == "id") {
      // TODO
      params.sort[0] = this.db
        .query<{ cname: string }>(Query.getPrimaryKey(table))
        .toArray()
        .map((it) => it.cname)[0];
    }
    return this.db
      .query<ColData>(Query.selectAllFrom(table, params))
      .toArray()
      .map((row) => ({ ...row, ...this.getId(table, row) }));
  }

  getOne(table: string, primaryKey: ColData) {
    return this.db
      .query<ColData>(Query.selectOne(table, primaryKey))
      .toArray()
      .map((row) => ({ ...row, ...this.getId(table, row) }))[0];
  }

  createRow(table: string, data: ColData) {
    this.db.query<number>(Query.insertIntoTable(table, data));
    const primaryKey = parsePrimaryKey(this.getId(table, data).id);
    try {
      if (primaryKey) {
        return this.getOne(table, primaryKey);
      }
    } catch (e) {
      console.error(e);
      return { ...data, id: primaryKey };
    }
  }

  updateRow(table: string, primaryKey: ColData, data: ColData) {
    return this.db.query<number>(Query.updateTableRow(table, primaryKey, data));
  }

  deleteRow(table: string, primaryKey: ColData) {
    return this.db.query<number>(Query.deleteTableRow(table, primaryKey));
  }

  executeQuery(sql: string) {
    try {
      const result = this.db.query(sql);
      const data =
        typeof result === "number" ? (result as number) : result.toArray();
      return {
        schema: { columns: result.getColumns() },
        data,
        length: typeof data === "number" ? 0 : data.length,
      };
    } catch (e: any) {
      // TODO: extend transbase-nodejs if we need sqlcode, tci error code...
      return {
        error: e.message,
      };
    }
  }

  getId(table: string, data: ColData) {
    const keys = this.db
      .query<{ cname: string }>(Query.getPrimaryKey(table))
      .toArray()
      .map((it) => it.cname);
    return {
      ...("id" in data ? { _id: data.id } : undefined),
      id: keys.map((key) => `${key}=${data[key]}`).join("&"),
    };
  }

  getUsers() {
    return this.db
      .query<{
        passwd: string;
        userclass: string;
        userid: number;
        username: string;
      }>(Query.systemUser())
      .toArray()
      .map(({ userid, ...rest }) => ({ ...rest, id: userid }));
  }
}
