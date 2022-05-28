import express from "express";

import { categoriesRoutes } from "./routes/categories.routes";

const app = express();

const PORT = 5555;

app.use(express.json());

app.use("/", categoriesRoutes);

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
