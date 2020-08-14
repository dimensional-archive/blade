/**
 * @file A simple git information utility class.
 */

import { exec } from "child_process";
import { join } from "path";
import { readFileSync } from "fs";
import { isDir } from "./Files";

export abstract class ProjectInfo {
  public static dir: string = process.cwd();

  /**
   * Whether the project root is a git project.
   */
  public static get isGitProject(): boolean {
    return isDir(join(this.dir, ".git"));
  }

  /**
   * The current version of this project. (package.json)
   */
  public static get version(): string | null {
    const file = readFileSync(join(this.dir, "package.json"), { encoding: "utf8" });
    return JSON.parse(file).version;
  }

  /**
   * The current branch.
   * @since 2.0.0
   */
  public static currentBranch(): Promise<string> | null {
    if (!this.isGitProject) return null;

    return new Promise((resolve, reject) => {
      exec(`cd ${this.dir} && git rev-parse --abbrev-ref HEAD`, (err, res) => {
        if (err) return reject(err);
        return resolve(res.trim());
      });
    });
  }

  /**
   * All of the branches in the git project.
   * @since 2.0.0
   */
  public static allBranches(): Promise<string[]> | null {
    if (!this.isGitProject) return null;

    return new Promise((res, rej) => {
      exec(`cd ${this.dir} && git branch -r`, (err, out) => {
        if (err) rej(err);
        res(out
          .split(" ")
          .filter(s => ![ "", "*" ].includes(s))
          .map(s => s.replace(/\n/gi, "").split("/"))
          .map(s => s[s.length - 1]));
      });
    });
  }

  /**
   * Get the current commit hash of the project.
   * @param shorten
   * @since 2.0.0
   */
  public static currentHash(shorten: boolean = false): Promise<string> | null {
    if (!this.isGitProject) return null;

    return new Promise((resolve, reject) => {
      exec(`cd ${this.dir} && git rev-parse HEAD`, (err, out) => {
        if (err) return reject(err);
        const hash = out.trim();
        resolve(shorten ? hash.substr(0, 7) : hash);
      });
    });
  }

  /**
   * Get all commits.
   * @param limit
   * @since 2.0.0
   */
  public static getCommits(limit: number = 5): Promise<GitCommit[]> | null {
    if (!this.isGitProject) return null;

    return new Promise((resolve, reject) => {
      exec(`cd ${this.dir} && git log --pretty=format:'%H %s %cn' -n ${limit}`, (err, out) => {
        if (err) return reject(err);

        const split = out.trim().split("\n").map((s) => s.trim().split(" "));
        resolve(split.map((c) => ({
          hash: c.shift()!,
          committer: c.pop()!,
          subject: c.join(" ")!
        })).reverse());
      });
    });
  }

  /**
   * Provide a different url than the project root.
   * @param dir
   * @since 2.0.0
   */
  public static useDirectory(dir: string): typeof ProjectInfo {
    if (!isDir(dir)) throw new Error(`"${dir}" is not a directory.`);
    this.dir = dir;
    return this;
  }
}

export interface GitCommit {
  committer: string;
  hash: string;
  subject: string;
}
