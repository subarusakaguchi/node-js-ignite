import crypto from "crypto";
import multer from "multer";
import { resolve } from "path";

import { removeSpaces } from "@utils/rename";

const tempFolder = resolve(__dirname, "..", "..", "temp");

export default {
  tempFolder,

  storage: multer.diskStorage({
    destination: tempFolder,
    filename: (request, file, callback) => {
      const fileHash = crypto.randomBytes(16).toString("hex");
      const filename = `${fileHash}-${removeSpaces(file.originalname)}`;

      return callback(null, filename);
    },
  }),
};
