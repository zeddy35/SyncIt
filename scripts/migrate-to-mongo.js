// Usage: node scripts/migrate-to-mongo.js "<MONGODB_CONNECTION_STRING>"
// Put Music.sql (and optionally music.bak) inside the scripts/ folder first.

const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const CONNECTION_STRING = process.argv[2];

if (!CONNECTION_STRING) {
  console.error('Usage: node scripts/migrate-to-mongo.js "<MONGODB_CONNECTION_STRING>"');
  process.exit(1);
}

// ─── SQL parser ───────────────────────────────────────────────────────────────

function parseSql(filePath) {
  const raw = fs.readFileSync(filePath, 'latin1');
  // Windows-1254 (Turkish) chars misread as Latin-1 → fix manually
  const content = raw
    .replace(/ð/g, 'ğ').replace(/Ð/g, 'Ğ')
    .replace(/þ/g, 'ş').replace(/Þ/g, 'Ş')
    .replace(/ý/g, 'ı').replace(/Ý/g, 'İ');

  const singers = [];
  const albums = [];
  const instruments = [];
  const instrumentSinger = [];

  // Matches: INSERT [dbo].[TABLE] ([col1], [col2], ...) VALUES (v1, v2, ...)
  const insertRe = /INSERT\s+\[dbo\]\.\[(\w+)\]\s+\([^)]+\)\s+VALUES\s+\(([^)]+)\)/gi;

  let match;
  while ((match = insertRe.exec(content)) !== null) {
    const table = match[1].toUpperCase();
    const rawValues = match[2];

    // Parse values: handles N'string', integers, NULL
    const values = [];
    const valRe = /N'((?:[^']|'')*)'|'((?:[^']|'')*)'|(\d+)|NULL/gi;
    let vm;
    while ((vm = valRe.exec(rawValues)) !== null) {
      if (vm[1] !== undefined) values.push(vm[1].replace(/''/g, "'"));
      else if (vm[2] !== undefined) values.push(vm[2].replace(/''/g, "'"));
      else if (vm[3] !== undefined) values.push(parseInt(vm[3], 10));
      else values.push(null);
    }

    if (table === 'SINGER') {
      singers.push({ singerID: values[0], name: values[1], style: values[2] });
    } else if (table === 'ALBUM') {
      albums.push({ albumID: values[0], title: values[1], year: values[2], singerID: values[3] });
    } else if (table === 'INSTRUMENT') {
      instruments.push({ insID: values[0], name: values[1] });
    } else if (table === 'INSTRUMENT_SINGER') {
      instrumentSinger.push({ singerID: values[0], insID: values[1] });
    }
  }

  return { singers, albums, instruments, instrumentSinger };
}

// ─── Build MongoDB documents ──────────────────────────────────────────────────

function buildDocs({ singers, albums, instruments, instrumentSinger }) {
  const singerDocs = singers.map((s) => {
    const instrumentNames = instrumentSinger
      .filter((is) => is.singerID === s.singerID)
      .map((is) => instruments.find((i) => i.insID === is.insID)?.name)
      .filter(Boolean);

    const singerAlbums = albums
      .filter((a) => a.singerID === s.singerID)
      .map(({ title, year }) => ({ title, year }));

    return {
      singerID: s.singerID,
      name: s.name,
      style: s.style,
      instruments: instrumentNames,
      albums: singerAlbums,
    };
  });

  const albumDocs = albums.map((a) => {
    const singer = singers.find((s) => s.singerID === a.singerID);
    return {
      albumID: a.albumID,
      title: a.title,
      year: a.year,
      singerID: a.singerID,
      singerName: singer?.name ?? '',
      singerStyle: singer?.style ?? '',
    };
  });

  // Deduplicate instruments by name
  const seen = new Set();
  const instrumentDocs = instruments
    .filter((i) => {
      if (seen.has(i.name)) return false;
      seen.add(i.name);
      return true;
    })
    .map(({ insID, name }) => ({ insID, name }));

  return { singerDocs, albumDocs, instrumentDocs };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const sqlPath = path.join(__dirname, 'Music.sql');

  if (!fs.existsSync(sqlPath)) {
    console.error(`Music.sql not found at ${sqlPath}`);
    console.error('Place Music.sql inside the scripts/ folder and try again.');
    process.exit(1);
  }

  console.log(`Reading ${sqlPath}...`);
  const raw = parseSql(sqlPath);
  console.log(`Parsed: ${raw.singers.length} singers, ${raw.albums.length} albums, ${raw.instruments.length} instruments, ${raw.instrumentSinger.length} instrument-singer links\n`);

  const { singerDocs, albumDocs, instrumentDocs } = buildDocs(raw);

  const client = new MongoClient(CONNECTION_STRING);

  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('Connected.\n');

    const db = client.db('final_project');

    for (const col of ['singers', 'albums', 'instruments']) {
      const exists = await db.listCollections({ name: col }).hasNext();
      if (exists) {
        await db.collection(col).drop();
        console.log(`Dropped existing "${col}" collection`);
      }
    }

    const r1 = await db.collection('singers').insertMany(singerDocs);
    console.log(`✓ singers   → ${r1.insertedCount} documents`);

    const r2 = await db.collection('albums').insertMany(albumDocs);
    console.log(`✓ albums    → ${r2.insertedCount} documents`);

    const r3 = await db.collection('instruments').insertMany(instrumentDocs);
    console.log(`✓ instruments → ${r3.insertedCount} documents`);

    console.log('\n── Sample singer ──');
    console.log(JSON.stringify(singerDocs.find((s) => s.instruments.length > 0), null, 2));

    console.log('\n── Sample album ──');
    console.log(JSON.stringify(albumDocs[0], null, 2));

    console.log('\nMigration complete!');
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
