import fs from "fs";

const path = "src/data/menu-static.ts";
let content = fs.readFileSync(path, "utf8");

// PKR rupees -> USD cents (nice restaurant menu prices)
const map = {
  1400: 2499, 850: 1499, 550: 999,
  2200: 3999, 1150: 2299,
  1450: 2499, 1050: 1699,
  1350: 2199, 1250: 1999,
  380: 699, 320: 599, 360: 699, 340: 649, 280: 499, 160: 299,
  40: 99, 80: 149, 120: 199,
  1850: 2999,
  350: 599,
  100: 199, 220: 399,
};

let replaced = 0;
for (const [oldVal, newVal] of Object.entries(map)) {
  const re = new RegExp(`(price:\\s*)${oldVal}(,)`, "g");
  content = content.replace(re, (m, p1, p2) => {
    replaced++;
    return `${p1}${newVal}${p2}`;
  });
}

fs.writeFileSync(path, content);
console.log(`Replaced ${replaced} price entries.`);
