const { Transbase } = require("@transaction/transbase-nodejs");
const express = require("express");
const cors = require("cors"); // TODO only for local dev
const jwt = require("jsonwebtoken");

function getTable(db, name) {
  return select(db, name);
}

function getTableNames(db) {
  return db
    .query(`select * from systable`)
    .toArray()
    .filter((it) => it.ttype === "r");
}

function select(db, table, options = {}) {
  return db.query(`select * from ${table}` + where(options?.where));
}

function executeSqlQuery(db, sql) {
  return db.query(sql);
}

const where = (expr = "") => (!expr ? "" : " where " + expr);

const app = express();
app.use(express.json());
app.use(express.static("dist"));
app.use(cors());

app.post("/auth/login", (req, res) => {
  const { username, password } = req.body;
  let db;
  try {
    const data = {
      url: "//develop.transaction.de:8324/test",
      user: username,
      password: password,
    };
    db = new Transbase(data);
    const token = generateAccessToken(data);
    res.status(200).json(token);
  } catch (e) {
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

app.get("/api/:table/schema", authenticateTokenAndConnect, (req, res) => {
  // TODO: transbase has something like TOP 1?
  const colInfos = select(req.db, req.params.table, { where: "1=0" }).colInfos;
  res.send(colInfos);
});

app.get("/api/system/tables", authenticateTokenAndConnect, (req, res) => {
  res.send(getTableNames(req.db));
});

app.get("/api/sql", authenticateTokenAndConnect, (req, res) => {
  const sql = JSON.parse(decodeURIComponent(req.query.filter)).sql;
  const result = executeSqlQuery(req.db, sql);
  const response = { schema: result.colInfos, data: result.toArray() };
  res.set("Content-Range", response.data.length);
  res.set("Access-Control-Expose-Headers", "Content-Range");
  res.send(response.data);
});
app.post("/api/sql", authenticateTokenAndConnect, (req, res) => {
  const sql = req.body.sql;
  const result = executeSqlQuery(req.db, sql);
  res.send({ schema: result.colInfos, data: result.toArray() });
});

app.get("/api/:resourceId", authenticateTokenAndConnect, (req, res) => {
  const list = getTable(req.db, req.params.resourceId).toArray();
  res.set("Content-Range", list.length);
  res.set("Access-Control-Expose-Headers", "Content-Range");
  res.send(list);
});

app.listen(3003, () =>
  console.log("🚀 transbase-admin server listening on port 3003")
);

const TOKEN_SECRET = // require("crypto").randomBytes(64).toString("hex");
  "bebd71885fcc847d543036d7da80088209f09d822d7ceb940d04a4880933f2edf6621fe89c317036c91e220d375bfbcaeffbdaae87d5727d01dcc4567fd00b08";

function generateAccessToken(loginData) {
  return jwt.sign(loginData, TOKEN_SECRET, {
    expiresIn: "3000s",
  });
}

function authenticateTokenAndConnect(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null || token == "null") {
    return res.sendStatus(401);
  }
  jwt.verify(token, TOKEN_SECRET, (err, connection) => {
    if (err) {
      return res.sendStatus(403);
    }
    let db;
    try {
      db = new Transbase(connection);
      req.db = db;
      next();
    } catch (e) {
      res.sendStatus(500).send(e.message);
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
}
