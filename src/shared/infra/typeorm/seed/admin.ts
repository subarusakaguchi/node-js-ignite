import { hash } from "bcryptjs";
import { Connection, getConnection } from "typeorm";
import { v4 as uuidv4 } from "uuid";

import createConnection from "../index";

async function create() {
  const connection = await createConnection("localhost");

  const id = uuidv4();

  const password = await hash("admin123", 8);

  await connection.query(
    `INSERT INTO USERS(id, name, email, password, "isAdmin", driver_license, created_at) values('${id}', 'Admin', 'admin@rentx.com', '${password}', true, 'XXXXXX', 'now()')`
  );

  await connection.close();
}

create().then(() => console.log("Admin account successfully created"));
