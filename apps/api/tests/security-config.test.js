import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(currentDirectory, "../../..");

async function readRepositoryFile(relativePath) {
  return readFile(path.join(repositoryRoot, relativePath), "utf8");
}

describe("configuração segura do banco local", () => {
  it("publica o MySQL somente no loopback e exige senhas definidas", async () => {
    const compose = await readRepositoryFile("database/compose.yml");

    expect(compose).toContain('"127.0.0.1:${DB_PORT:-3306}:3306"');
    expect(compose).toContain("MYSQL_PASSWORD: ${DB_PASSWORD:?");
    expect(compose).toContain("MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD:?");
    expect(compose).not.toContain("hidden_route_local");
    expect(compose).not.toContain("hidden_route_root_local");
  });

  it("mantém segredos vazios no arquivo de exemplo", async () => {
    const example = await readRepositoryFile(".env.example");

    for (const key of [
      "DB_PASSWORD",
      "DB_ROOT_PASSWORD",
      "JWT_SECRET",
      "ADMIN_PASSWORD",
    ]) {
      expect(example).toMatch(new RegExp(`^${key}=$`, "m"));
    }
  });
});

describe("legado seguro para consulta pública", () => {
  it("não mantém credenciais fixas nem SQL interpolado", async () => {
    const files = await Promise.all(
      [
        "legacy/sexemplo/SEXEMPLO-API/index.js",
        "legacy/sexemplo/SEXEMPLO-API/dicas importantes",
        "legacy/sexemplo/database/Dockerfile",
        "legacy/sexemplo/database/README",
      ].map(readRepositoryFile),
    );
    const legacy = files.join("\n");

    expect(legacy).not.toMatch(/password:\s*["']admin["']/i);
    expect(legacy).not.toMatch(/MYSQL_(?:ROOT_)?PASSWORD=\w+/);
    expect(legacy).not.toMatch(/senha:\s*admin/i);
    expect(legacy).not.toMatch(/BY\s+["']admin["']/i);
    expect(legacy).not.toContain('VALUES ("${nome_empresa}"');
  });
});

describe("escopo do CodeQL", () => {
  it("analisa a aplicação e exclui somente o legado não executável", async () => {
    const [workflow, config] = await Promise.all([
      readRepositoryFile(".github/workflows/codeql.yml"),
      readRepositoryFile(".github/codeql-config.yml"),
    ]);

    expect(workflow).toContain("config-file: ./.github/codeql-config.yml");
    expect(config).toContain("paths-ignore:");
    expect(config).toContain('"legacy/**"');
  });
});
