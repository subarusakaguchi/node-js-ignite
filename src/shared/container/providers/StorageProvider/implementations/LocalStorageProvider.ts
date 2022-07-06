import fs from "fs";
import path from "path";

import upload from "@config/upload";

import { IStorageProvider } from "../IStorageProvider";

class LocalStorageProvider implements IStorageProvider {
  async save(file: string, folder: string): Promise<string> {
    fs.promises.rename(
      path.resolve(upload.tempFolder, file),
      path.resolve(`${upload.tempFolder}/${folder}`, file)
    );

    return file;
  }
  async delete(file: string, folder: string): Promise<void> {
    const filename = path.resolve(`${upload.tempFolder}`, `${folder}`, file);

    try {
      await fs.promises.stat(filename);
    } catch {
      return;
    }

    await fs.promises.unlink(filename);
  }
}

export { LocalStorageProvider };
