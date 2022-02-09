const { Transbase } = require("@transaction/transbase-nodejs");
const express = require("express");
var cors = require("cors");

const db = new Transbase({
  url: "//develop.transaction.de:8324/test",
  user: "test",
  password: "test",
});

function getTable(name) {
  return select(name);
}

function getTableNames() {
  return db
    .query(`select * from systable`)
    .toArray()
    .filter((it) => it.ttype === "r");
}

function select(table, options = {}) {
  return db.query(`select * from ${table}` + where(options?.where));
}

function executeSqlQuery(sql) {
  return db.query(sql);
}

const where = (expr = "") => (!expr ? "" : " where " + expr);

const app = express();
app.use(express.json());
app.use(express.static("dist"));
app.use(cors());

app.get("/api/:table/schema", (req, res) => {
  // TODO: transbase has something like TOP 1?
  const colInfos = select(req.params.table, { where: "1=0" }).colInfos;
  res.send(colInfos);
});
app.get("/api/system/tables", (_, res) => res.send(getTableNames()));

app.get("/api/sql", (req, res) => {
  const sql = JSON.parse(decodeURIComponent(req.query.filter)).sql;
  const result = executeSqlQuery(sql);
  const response = { schema: result.colInfos, data: result.toArray() };
  res.set("Content-Range", response.data.length);
  res.set("Access-Control-Expose-Headers", "Content-Range");
  res.send(response.data);
});
app.post("/api/sql", (req, res) => {
  const sql = req.body.sql;
  const result = executeSqlQuery(sql);
  res.send({ schema: result.colInfos, data: result.toArray() });
});

app.get("/api/:resourceId", (req, res) => {
  const list = getTable(req.params.resourceId).toArray();
  res.set("Content-Range", list.length);
  res.set("Access-Control-Expose-Headers", "Content-Range");
  res.send(list);
});

app.listen(3003, () => console.log("🚀 cashbook app listening on port 3003"));
