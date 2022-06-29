import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { app } from "@shared/infra/http/app";
import createConnection from "@shared/infra/typeorm";

let connection: Connection;
const email = "admin@rentx.com";
const passwordGlobal = "admin_test";

describe("Create Category Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();

    const id = uuidv4();

    const password = await hash(passwordGlobal, 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, "isAdmin", driver_license, created_at) values('${id}', 'Admin', 'admin@rentx.com', '${password}', true, 'XXXXXX', 'now()')`
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to create a new Category", async () => {
    const responseToken = await request(app)
      .post("/sessions")
      .send({ email, password: passwordGlobal });

    console.log(responseToken.body);

    const response = await request(app).post("/categories").send({
      name: "Category Supertest",
      description: "Description Supertest",
    });

    expect(response.status).toBe(201);
  });
});
