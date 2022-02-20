import express from "express";

import cors from "cors"; // TODO only for local dev

import { Transbase } from "@transaction/transbase-nodejs";
import { authenticateToken, generateAccessToken } from "./auth";
import { Resolver } from "./resolver";

const URL = "//develop.transaction.de:8324/test"; // TODO make configurable

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
app.post("/auth/login", (req, res) => {
  const { username, password } = req.body;
  let db;
  try {
    const data = {
      url: URL,
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

/**
 * GET column schema of table
 */
app.get("/api/:table/schema", withAuth, (req, res) => {
  res.send(req.resolver.getTableSchema(req.params.table));
});

/**
 * GET all table names
 */
app.get("/api/system/tables", withAuth, (req, res) => {
  res.send(req.resolver.getTableNames());
});

/**
 * GET/POST Run arbitrary sql query
 */
app.get("/api/sql", withAuth, (req, res) => {
  const sql = JSON.parse(
    decodeURIComponent((req.query as { filter: string }).filter)
  ).sql;
  const result = req.resolver.executeQuery(sql);
  res.set("Content-Range", String(result.length));
  res.set("Access-Control-Expose-Headers", "Content-Range");
  res.send(result.data);
});
app.post("/api/sql", withAuth, (req, res) => {
  res.send(req.resolver.executeQuery(req.body.sql));
});

/**
 * GET generic table as resource
 */
app.get("/api/:resourceId", withAuth, (req, res) => {
  const data = req.resolver.getTableResource(req.params.resourceId);
  res.set("Content-Range", String(data.length));
  res.set("Access-Control-Expose-Headers", "Content-Range");
  res.send(data);
});

app.listen(3003, () =>
  console.log("🚀 transbase-admin server listening on port 3003")
);

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
