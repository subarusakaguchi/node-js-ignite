import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { app } from "@shared/infra/http/app";
import createConnection from "@shared/infra/typeorm";

let connection: Connection;
let globalToken: string;
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

    const responseToken = await request(app)
      .post("/session")
      .send({ email, password: passwordGlobal });

    const { refresh_token } = responseToken.body;

    globalToken = refresh_token;
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to create a new Category", async () => {
    const response = await request(app)
      .post("/categories")
      .send({
        name: "Category Supertest",
        description: "Description Supertest",
      })
      .set({
        Authorization: `Bearer ${globalToken}`,
      });

    expect(response.status).toBe(201);
  });

  it("Should not be able to create a category with same name", async () => {
    const response = await request(app)
      .post("/categories")
      .send({
        name: "Category Supertest",
        description: "Description Supertest",
      })
      .set({
        Authorization: `Bearer ${globalToken}`,
      });

    expect(response.status).toBe(400);
  });
});
