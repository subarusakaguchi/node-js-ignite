import { hash } from "bcryptjs";
import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { app } from "@shared/infra/http/app";

let connection: Connection;
let globalToken: string;
const email = "admin@rentx.com";
const passwordGlobal = "admin_test";

describe("List Categories Controller", () => {
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

  it("Should be able to list existing categories", async () => {
    const categoryToBeCreated = {
      name: "Category Supertest",
      description: "Description Supertest",
    };

    await request(app)
      .post("/categories")
      .send({
        name: categoryToBeCreated.name,
        description: categoryToBeCreated.description,
      })
      .set({
        Authorization: `Bearer ${globalToken}`,
      });

    const responseListCategories = await request(app).get("/categories");

    const listedCategory = responseListCategories.body[0];

    expect(listedCategory).toHaveProperty("id");
    expect(listedCategory.name).toEqual(categoryToBeCreated.name);
    expect(listedCategory.description).toEqual(categoryToBeCreated.description);
  });
});
