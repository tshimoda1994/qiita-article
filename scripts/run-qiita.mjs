import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const qiitaMain = join(repoRoot, "node_modules", "@qiita", "qiita-cli", "dist", "main.js");
const userArgs = process.argv.slice(2);

const result = spawnSync(process.execPath, [qiitaMain, "--root", repoRoot, ...userArgs], {
  stdio: "inherit",
  cwd: repoRoot,
});

process.exit(result.status === null ? 1 : result.status);
