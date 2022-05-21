import type { TransbaseConfig } from "@transaction/transbase-nodejs";
import jwt from "jsonwebtoken";

const TOKEN_SECRET = // require("crypto").randomBytes(64).toString("hex");
  "bebd71885fcc847d543036d7da80088209f09d822d7ceb940d04a4880933f2edf6621fe89c317036c91e220d375bfbcaeffbdaae87d5727d01dcc4567fd00b08";

export function generateAccessToken(loginData: TransbaseConfig) {
  return jwt.sign(loginData, TOKEN_SECRET, {
    expiresIn: "3000s",
  });
}

export function authenticateToken(
  callback: (req: any, connectionConfig: TransbaseConfig) => void
) {
  return (req: any, res: any, next: any) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null || token == "null") {
      return res.sendStatus(401);
    }

    jwt.verify(token, TOKEN_SECRET, (err: any, connectionConfig: any) => {
      if (err) {
        return res.sendStatus(403);
      }
      callback(req, connectionConfig);
      next();
    });
  };
}
