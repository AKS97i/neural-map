// Development only. The running native mod imports none of this script.
import {writeFile} from 'node:fs/promises'
import sharp from 'sharp'
import {drawMap} from '../hooks/draw'
import {setupFrom} from '../hooks/setup'
import type {Board,StationId} from '../types'

const now=100000
const ids:StationId[]=['you','model','memory','files','shell','web','browser','agents','skills','hooks']
const counts=Object.fromEntries(ids.map((s,i)=>[s,[5,18,7,31,12,9,4,3,6,22][i]]))
const board:Board={entries:ids.map((station,i)=>({id:String(i),station,label:station,from:'core',status:i===3||i===4?'run':'ok',startedAt:now-5000-i*500,endedAt:i===3||i===4?undefined:now-4000-i*500})),counts,context:38,model:'claude-opus-4-6',agents:['a1'],faults:{web:1}}
for(const colorPreset of ['night-city','netrunner','arasaka','monochrome']){
 const svg=drawMap(board,now,setupFrom({colorPreset,skin:'cyberpunk',theme:'dark',motion:'reduced',coreName:'CLAUDE'}))
 await writeFile(`docs/${colorPreset}.svg`,svg)
 await sharp(Buffer.from(svg)).resize(920,860).png().toFile(`docs/${colorPreset}.png`)
}
const icon='<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><rect width="512" height="512" fill="#080c10"/><path d="M60 115V60H180M452 397v55H332" fill="none" stroke="#32e5ed" stroke-width="9"/><path d="M115 362V150h58l108 135V150h58v212h-58L173 226v136Z" fill="#f4f444"/><path d="M350 100h62v62m0-62l-76 76" fill="none" stroke="#32e5ed" stroke-width="12"/></svg>'
await sharp(Buffer.from(icon)).png().toFile('.claude-plugin/icon.png')
console.log('Rendered four themes and plugin icon from the actual map renderer.')
