import express from "express";

import { router } from "./routes";

const app = express();

const PORT = 5555;

app.use(express.json());

app.use("/", router);

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
