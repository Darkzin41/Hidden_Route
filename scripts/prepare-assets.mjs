import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const source = path.join(root, "legacy", "hidden-rout-static");
const output = path.join(root, "apps", "web", "public", "images");

await mkdir(output, { recursive: true });
await copyFile(
  path.join(source, "IMG", "HIDDEN ROUTE.svg"),
  path.join(root, "apps", "web", "public", "logo.svg"),
);

const assets = [
  {
    input: ["IMG", "home-img.jpg"],
    output: "home-hero",
    widths: [640, 1200, 1600],
  },
  {
    input: ["IMG", "Group 2.png"],
    output: "catalog-hero",
    widths: [640, 1200, 1920],
  },
  {
    input: ["imagem", "praia plano de fundo.jpg"],
    output: "about-hero",
    widths: [640, 1200, 1600],
  },
  {
    input: ["IMG", "foto1pontaverde.png"],
    output: "ponta-verde-hero",
    widths: [640, 1200],
  },
  {
    input: ["IMG", "foto2pontaverde.png"],
    output: "ponta-verde-detail",
    widths: [640, 960],
  },
  {
    input: ["IMG", "recantodajulia.png"],
    output: "recanto-julia",
    widths: [640],
  },
  {
    input: ["IMG", "paraisodosreis.png"],
    output: "paraiso-reis",
    widths: [640],
  },
  { input: ["IMG", "loca.png"], output: "location", widths: [720] },
  { input: ["imagem", "equipe.jpg"], output: "team", widths: [640] },
  {
    input: ["IMG", "sao-luis5.jpg"],
    output: "discovery-beaches",
    widths: [640],
  },
  {
    input: ["IMG", "sao-luis4.jpg"],
    output: "discovery-nature",
    widths: [640],
  },
  { input: ["IMG", "sao-luis6.jpg"], output: "discovery-stays", widths: [640] },
  { input: ["imagem", "weblly.jpg"], output: "team-weblly", widths: [480] },
  { input: ["imagem", "daniel.jpg"], output: "team-daniel", widths: [480] },
  { input: ["imagem", "marcos.jpg"], output: "team-marcos", widths: [480] },
  { input: ["imagem", "ariel.jpg"], output: "team-ariel", widths: [480] },
  { input: ["imagem", "bruno.jpg"], output: "team-bruno", widths: [480] },
  { input: ["imagem", "samuel.jpg"], output: "team-samuel", widths: [480] },
  { input: ["imagem", "thiago.jpg"], output: "team-thiago", widths: [480] },
];

for (const asset of assets) {
  const input = path.join(source, ...asset.input);
  for (const width of asset.widths) {
    await sharp(input)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 82, effort: 4 })
      .toFile(path.join(output, `${asset.output}-${width}.webp`));
  }
  const largest = Math.max(...asset.widths);
  await copyFile(
    path.join(output, `${asset.output}-${largest}.webp`),
    path.join(output, `${asset.output}.webp`),
  );
}

console.log(`${assets.length} grupos de imagens preparados em ${output}`);
