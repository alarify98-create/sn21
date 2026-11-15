// Copies Tajawal + Reem Kufi fonts into www/ so the app looks the same offline.
const fs = require('fs'), path = require('path');
const out = path.join('www', 'fonts');
fs.mkdirSync(out, { recursive: true });
const jobs = [
  ['tajawal', ['400', '500', '700']],
  ['reem-kufi', ['600']],
];
let css = '';
for (const [pkg, weights] of jobs) {
  const base = path.join('node_modules', '@fontsource', pkg);
  for (const w of weights) {
    let c = fs.readFileSync(path.join(base, w + '.css'), 'utf8');
    c = c.replace(/url\(\.\/files\//g, 'url(./fonts/');
    // keep only woff2 sources
    c = c.replace(/,\s*url\([^)]*\.woff\)\s*format\("woff"\)/g, '');
    for (const m of c.matchAll(/url\(\.\/fonts\/([^)]+)\)/g)) {
      fs.copyFileSync(path.join(base, 'files', m[1]), path.join(out, m[1]));
    }
    css += c + '\n';
  }
}
fs.writeFileSync(path.join('www', 'fonts.css'), css);
console.log('fonts ready');
