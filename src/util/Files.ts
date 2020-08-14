import { existsSync, lstatSync, readdirSync } from "fs";
import { join } from "path";

/**
 * A helper function to test if a path leads to a directory.
 * @param path
 */
export function isDir(path: string): boolean {
  if (!existsSync(path)) return false;
  else return lstatSync(path).isDirectory();
}

/**
 * A helper function for recursively reading a directory.
 * @param path
 */
export function readDir(path: string): string[] {
  if (!isDir(path)) throw new Error(`Path: ${path}, doesn't exist or it is not a directory`);

  const files: string[] = [];
  const read = (dir = path) => {
    for (const file of readdirSync(dir)) {
      const joined = join(dir, file);
      if (isDir(joined)) read(joined);
      else files.push(joined);
    }
  }

  read();
  return files;
}
