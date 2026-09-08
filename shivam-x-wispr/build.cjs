const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const crypto = require('node:crypto');

const root = __dirname;
const source = path.join(root, 'source');
const out = path.join(root, 'public');
const assets = path.join(out, 'assets');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(assets, { recursive: true });

const jobs = [
  { out: 'index.html', parts: ['index-1.br.b64','index-2.br.b64'], sha: 'cb5213dd625dea200ef76711e0e3a7c6497514ef9ddf48cf848b3e0493ec783e' },
  { out: 'assets/flow-symbol.svg', parts: ['flow-symbol.br.b64'], sha: '03d540e5e7fe033c2e7779bc255c137194e147b20e3aca1cf8ba1f00c9a34406' },
  { out: 'assets/wispr-flow-black.svg', parts: ['wispr-flow-black.br.b64'], sha: 'af2c8b428c6b04142641f2b6797c563ae6a2b095202806974996760f90e4a9fd' },
  { out: 'assets/wispr-flow-white.svg', parts: ['wispr-flow-white.br.b64'], sha: 'd25d3c93aca245313ac9c050c295e9d5eb97377a1b558f6e8c7a1c0d3cb5d887' },
  { out: 'assets/wispr-flow-bar.mp4', parts: ['bar-1.br.b64','bar-2.br.b64'], sha: 'd5f5231cb78d72da169b66e0ac8c1bba9bc47cdb41c54e190aa0ddf26d2c4750' },
  { out: 'assets/wispr-flow-bar-poster.webp', parts: ['poster.br.b64'], sha: '9e32a9c9f3b6d48341de4543182f0557b0e21eaf3ae4e71b27a1af83b8094b3f' },
];

for (const job of jobs) {
  const encoded = job.parts.map(p => fs.readFileSync(path.join(source, p), 'utf8').trim()).join('');
  const data = zlib.brotliDecompressSync(Buffer.from(encoded, 'base64'));
  const hash = crypto.createHash('sha256').update(data).digest('hex');
  if (hash !== job.sha) throw new Error(`Integrity check failed for ${job.out}: ${hash}`);
  const dest = path.join(out, job.out);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, data);
}

fs.writeFileSync(path.join(out, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
console.log('Built Shivam x Wispr with official Creator Pack assets.');
