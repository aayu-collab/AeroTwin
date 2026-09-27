import * as esbuild from 'esbuild';
import fs from 'node:fs';
fs.mkdirSync('dist',{recursive:true});
await esbuild.build({entryPoints:['src/app/main.tsx'],bundle:true,minify:true,sourcemap:false,legalComments:'eof',outfile:'dist/app.js',target:['es2020'],define:{'process.env.NODE_ENV':'"production"'},loader:{'.tsx':'tsx'}});
const js=fs.readFileSync('dist/app.js','utf8').replace(/<\/script/gi,'<\\/script');const css=fs.readFileSync('dist/app.css','utf8');
const html=`<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#111d30"><meta name="description" content="AeroTwin offline frontend demonstrator — synthetic propulsion-health monitoring, interactive 3D engine, explainable diagnostics, maintenance and mission planning."><title>AeroTwin — Propulsion Intelligence</title><style>${css}</style></head><body><div id="root"></div><noscript>AeroTwin needs JavaScript enabled. All application assets are contained in this file.</noscript><script>${js}</script></body></html>`;
fs.writeFileSync('AeroTwin.html',html);fs.writeFileSync('dist/index.html',html);console.log('Built self-contained AeroTwin.html: '+(Buffer.byteLength(html)/1024).toFixed(1)+' KB');
