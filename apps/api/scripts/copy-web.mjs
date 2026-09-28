import { access, cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const webDist = path.resolve(currentDirectory, "../../web/dist");
const destination = path.resolve(currentDirectory, "../dist/web");

await access(path.join(webDist, "index.html"));
await rm(destination, { recursive: true, force: true });
await mkdir(path.dirname(destination), { recursive: true });
await cp(webDist, destination, { recursive: true });
console.log(`Front-end copiado para ${destination}`);
