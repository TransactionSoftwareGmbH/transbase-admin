const { Transbase } = require("@transaction/transbase-nodejs");
const express = require("express");

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

const where = (expr = "") => (!expr ? "" : " where " + expr);

const app = express();

app.use(express.static("dist"));

app.get("/api/:table/schema", (req, res) => {
  // TODO: transbase has something like TOP 1?
  const colInfos = select(req.params.table, { where: "1=0" }).colInfos;
  res.send(colInfos);
});
app.get("/api/system/tables", (_, res) => res.send(getTableNames()));
app.get("/api/:resourceId", (req, res) => {
  const list = getTable(req.params.resourceId).toArray();
  res.set("Content-Range", list.length);
  res.send(list);
});

app.listen(3003, () => console.log("🚀 cashbook app listening on port 3003"));
