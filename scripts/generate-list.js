import fs from "fs";
import path from "path";

const folder = "writeups";
const files = fs.readdirSync(folder).filter(f => f.endsWith(".txt") || f.endsWith(".md"));

let list = [];

files.forEach(filename => {
  const filePath = path.join(folder, filename);
  const content = fs.readFileSync(filePath, "utf8").trim();

  const words = content.split(/\s+/).length;
  const readingTime = Math.ceil(words / 180);

  const base = filename.replace(/\.[^.]+$/, "");
  const title = base.charAt(0).toUpperCase() + base.slice(1);

  const description = content.split(".")[0] + ".";

  const stats = fs.statSync(filePath);
  const date = stats.mtime.toISOString().split("T")[0];

  list.push({ title, slug: base, description, date, readingTime });
});

fs.writeFileSync("writeup-list.json", JSON.stringify(list, null, 2));
console.log("✔ Generated writeup-list.json");
