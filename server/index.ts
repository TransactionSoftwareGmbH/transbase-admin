import express from "express";
import type { Response } from "express";

import cors from "cors"; // TODO only for local dev

import { Transbase } from "@transaction/transbase-nodejs";
import { authenticateToken, generateAccessToken } from "./auth";
import { Resolver } from "./resolver";
import { parsePrimaryKey } from "./utils";

// const URL = "//develop.transaction.de:8324/test"; // TODO make configurable
const URL = "//localhost:2024/admin";

const withAuth = authenticateToken((req, config) => {
  req.db = new Transbase(config);
  req.resolver = new Resolver(req.db);
});

const app = express();
app.use(express.json());
app.use(express.static("dist"));
app.use(cors());

/*********************
 * REST OPERATIONS
 ********************/
/**
 * POST login
 */
app.post("/auth", (req, res) => {
  const { username, password, connection = URL } = req.body;
  let db;
  try {
    const data = {
      url: connection,
      user: username,
      password: password,
    };
    db = new Transbase(data);
    const token = generateAccessToken(data);
    res.status(200).json(token);
  } catch (e: any) {
    res.status(401).send(e.message);
  } finally {
    try {
      if (db) {
        // TODO: closing crashes sometimes?? db.close();
      }
    } catch (e) {
      console.error(e);
    }
  }
});

app.get("/auth", withAuth, (_, res) => {
  res.sendStatus(200);
});

/**
 * GET all databases
 */
app.get("/api/databases", withAuth, (req, res) => {
  const data = req.resolver.getDatabases();
  sendWithContentRange(res, data);
});

/**
 * GET all table names
 */
app.get("/api/system/tables", withAuth, (req, res) => {
  res.send(req.resolver.getTableNames());
});

/**
 * GET column names and type grouped by table names
 */
app.get("/api/system/columns", withAuth, (req, res) => {
  res.send(req.resolver.getColumnNames());
});

/**
 * GET/POST Run arbitrary sql query
 */
app.get("/api/sql", withAuth, (req, res) => {
  const sql = JSON.parse(
    decodeURIComponent((req.query as { filter: string }).filter)
  ).sql;
  const result = req.resolver.executeQuery(sql);
  if (result.error) {
    res.status(500).send(result);
  } else {
    res.set("Content-Range", String(result.length));
    res.set("Access-Control-Expose-Headers", "Content-Range");
    res.send(result.data);
  }
});
app.post("/api/sql", withAuth, (req, res) => {
  const result = req.resolver.executeQuery(req.body.sql);
  if (result.error) {
    res.status(500).send(result);
  } else {
    res.send(result);
  }
});

/**
 * GET column schema of table
 */
app.get("/api/table/:table/schema", withAuth, (req, res) => {
  res.send(req.resolver.getTableSchema(req.params.table));
});

/**
 * get table data (select * from <tableName>)
 */
app.get("/api/table/:tableName", withAuth, (req, res) => {
  const data = req.resolver.getMany(
    req.params.tableName,
    parseQuery(req.query)
  );
  sendWithContentRange(res, data);
});
/**
 * get one table row by primary key
 */
app.get("/api/table/:tableName/:primaryKeyParam", withAuth, (req, res) => {
  const row = req.resolver.getOne(
    req.params.tableName,
    parsePrimaryKey(req.params.primaryKeyParam)
  );
  res.send(row);
});
/**
 * create new table row (insert into <tableName>)
 */
app.post("/api/table/:tableName", withAuth, (req, res) => {
  const created = req.resolver.createRow(req.params.tableName, req.body);
  res.send(created);
});
/**
 * update table row (update <tablename>)
 */
app.put("/api/table/:tableName/:primaryKeyParam", withAuth, (req, res) => {
  req.resolver.updateRow(
    req.params.tableName,
    parsePrimaryKey(req.params.primaryKeyParam),
    req.body
  );
  res.send({ id: req.params.primaryKeyParam });
});
/**
 * delete table row (delete from <tablename>)
 */
app.delete("/api/table/:tableName/:primaryKeyParam", withAuth, (req, res) => {
  req.resolver.deleteRow(
    req.params.tableName,
    parsePrimaryKey(req.params.primaryKeyParam)
  );
  res.send({ id: req.params.primaryKeyParam });
});

app.listen(3003, () =>
  console.log("🚀 transbase-admin server listening on port 3003")
);

function sendWithContentRange(res: Response, data: unknown[]) {
  res.set("Content-Range", String(data.length));
  res.set("Access-Control-Expose-Headers", "Content-Range");
  res.send(data);
}

function parseQuery(query: any) {
  return Object.fromEntries(
    Object.entries(query).map(([key, value]) => [
      key,
      typeof value === "string" ? JSON.parse(value) : value,
    ])
  );
}

// ts-types overwrites
declare module "express" {
  interface Request {
    db: Transbase;
    resolver: Resolver;
  }
}
declare module "express-serve-static-core" {
  interface Request {
    db: Transbase;
    resolver: Resolver;
  }
}
