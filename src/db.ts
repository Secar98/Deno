import { Database, MySQLConnector } from "https://deno.land/x/denodb@v1.2.0/mod.ts";

const connector = new MySQLConnector({
  database: 'db',
  host: 'db',
  username: 'root',
  password: 'admin',
  port: 3306, // optional
});

export const db = new Database(connector);


