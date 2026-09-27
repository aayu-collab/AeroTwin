import * as esbuild from 'esbuild';import {spawnSync} from 'node:child_process';import fs from 'node:fs';
await esbuild.build({entryPoints:['tests/core.test.ts'],outfile:'tests/.core.mjs',bundle:true,platform:'node',format:'esm',target:'node20'});const r=spawnSync(process.execPath,['tests/.core.mjs'],{stdio:'inherit'});fs.unlinkSync('tests/.core.mjs');process.exit(r.status||0);
