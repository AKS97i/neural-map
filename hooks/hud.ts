// Original optical HUD. No host calls, timers, filters or external assets.
import type {Board, StationId} from '../types'
import type {Setup} from './setup'
import {STATIONS} from './setup'
import {DARK, LIGHT, lightRules} from './palette'
import {formatTokens, shortModel} from './classify'

const FONT='font-family="SF Mono, ui-monospace, Menlo, monospace"'
const escape=(value:string)=>value.replace(/[<>&"]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c] as string))
const n=(value:number)=>String(Math.round(value*10)/10)
const point=(x:number,y:number)=>`${n(x)} ${n(y)}`
const ORDER: StationId[]=['you','memory','files','shell','skills','model','web','browser','agents','hooks']

export function drawHud(board:Board,now:number,setup:Setup,withSpent=false):string {
 const c={...(setup.theme==='light'?LIGHT:DARK),...setup.colors}
 const recent=board.entries.slice(-80)
 const active=recent.filter(e=>e.status==='run')
 const faults=Object.values(board.faults??{}).reduce((sum,v)=>sum+(v??0),0)
 const total=Object.values(board.counts).reduce((sum,v)=>sum+(v??0),0)
 const full=board.context===undefined?undefined:Math.max(0,Math.min(100,Math.round(board.context)))
 const text=(x:number,y:number,value:string,size=8,color=c.ash,anchor='start',extra='')=>`<text x="${x}" y="${y}" text-anchor="${anchor}" ${FONT} font-size="${size}" fill="${color}" ${extra}>${escape(value)}</text>`
 let out=setup.background==='transparent'?'':`<rect width="460" height="430" fill="${c.ground}"/>`
 // One framing line, one scale and consistent gutters; no texture behind type.
 out+=`<path d="M12 51V12H111M448 51V12H405M12 378v40h99M448 378v40h-43" fill="none" stroke="${c.accent}" stroke-width="1.4"/>`
 out+=text(24,29,'NEURAL / MAP',15,c.accent,'start','letter-spacing="1.1" font-weight="700"')
 out+=text(24,43,'AGENT ACTIVITY / OPTICAL LINK',6.5,c.ash,'start','letter-spacing=".8"')
 out+=text(436,29,'NM—01',9,c.bone,'end')+text(436,43,'LOCAL / READ ONLY',6,c.ash,'end')
 out+=`<path d="M24 59H436M24 363H436" fill="none" stroke="${c.line}" stroke-width=".7"/>`
 out+=text(24,76,'01 / INPUT CHANNELS',6.5,c.ash)+text(436,76,'02 / EXECUTION CHANNELS',6.5,c.ash,'end')
 // Quiet optical calibration marks around the engine.
 for(let i=0;i<60;i++) {
   const a=i*Math.PI/30;const long=i%5===0;const r=long?82:85
   out+=`<line x1="${n(230+Math.cos(a)*r)}" y1="${n(221+Math.sin(a)*r)}" x2="${n(230+Math.cos(a)*88)}" y2="${n(221+Math.sin(a)*88)}" stroke="${long?c.ash:c.line}" stroke-width="${long?1:.5}"/>`
 }
 const plates:string[]=[]
 ORDER.forEach((id,index)=>{
   const left=index<5;const row=index%5;const x=left?24:324;const y=94+row*51;const cy=y+21
   const running=active.filter(e=>e.station===id).length
   const fault=board.faults?.[id]??0
   const last=recent.filter(e=>e.station===id).pop()
   const lit=running>0||(last!==undefined&&now-(last.endedAt??last.startedAt)<2400)
   const tone=fault>0?c.red:id==='memory'?c.mem:lit?c.hot:c.ash
   const startX=left?x+112:x
   const dx=startX-230,dy=cy-221,d=Math.hypot(dx,dy)
   const endX=230+dx/d*79,endY=221+dy/d*79
   const elbow=left?145:315
   const line=`M${point(startX,cy)}H${elbow}L${point(endX,endY)}`
   out+=`<path d="${line}" fill="none" stroke="${lit?tone:c.spoke}" stroke-width="${lit?1.2:.7}" opacity="${lit?.9:.65}"/>`
   // Only recent real calls get a transient signal; never animate the idle core.
   const age=last===undefined?Infinity:now-last.startedAt
   if(setup.motion==='full'&&age>=0&&age<1000) {
     const begin=`${(-age/1000).toFixed(3)}s`
     const path=`M${point(endX,endY)}L${point(startX,cy)}`
     out+=`<circle r="2" fill="${tone}" opacity="0"><animateMotion path="${path}" begin="${begin}" dur="1s" fill="freeze"/><animate attributeName="opacity" values="0;1;0" begin="${begin}" dur="1s" fill="freeze"/></circle>`
   }
   // Rectangular interior pieces keep the terminal painter compatible with the
   // same SVG, without adding polygon rasterization to the lightweight engine.
   let plate=`<rect x="${x+8}" y="${y}" width="96" height="42" fill="${c.raised}"/><rect x="${x}" y="${y}" width="8" height="34" fill="${c.raised}"/><rect x="${x+104}" y="${y+8}" width="8" height="34" fill="${c.raised}"/>`
   plate+=`<path d="M${x} ${y}H${x+104}L${x+112} ${y+8}V${y+42}H${x+8}L${x} ${y+34}Z" fill="none" stroke="${fault>0?c.red:lit?tone:c.line}" stroke-width=".9"/>`
   plate+=`<path d="M${x} ${y+12}V${y}H${x+18}" fill="none" stroke="${tone}" stroke-width="1.5"/>`
   const station=STATIONS.find(s=>s.id===id)
   if(station)plate+=`<path d="${station.icon}" transform="translate(${x+15} ${y+20})" fill="none" stroke="${tone}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>`
   const name=setup.t.stations[id].toUpperCase()
   plate+=text(x+31,y+17,name,8.5,lit?c.bone:c.ash)
   const count=board.counts[id]??0
   plate+=text(x+102,y+32,String(count),10,c.bone,'end')
   const spent=withSpent&&setup.contextCost?(board.spent?.[id]??0):0
   const status=fault>0?`ERR ${fault}`:running>0?`ACTIVE ${running}`:spent>0?`${formatTokens(spent)} TOK`:'IDLE'
   plate+=text(x+31,y+32,status,6.2,tone)
   plates.push(plate)
 })
 // A single optical iris, with no pile-up of competing boxes and circles.
 out+=`<circle cx="230" cy="221" r="76" fill="${c.ground}" stroke="${c.line}" stroke-width=".8"/>`
 out+=`<path d="M192 152h76l29 29v80l-29 29h-76l-29-29v-80Z" fill="none" stroke="${c.accent}" stroke-width="1"/>`
 out+=`<circle cx="230" cy="221" r="62" fill="${c.raised}" stroke="${c.spoke}" stroke-width=".6"/>`
 if(full!==undefined)out+=`<circle cx="230" cy="221" r="71" fill="none" stroke="${full>=90?c.red:c.hot}" stroke-width="2.2" pathLength="100" stroke-dasharray="${full} 100" transform="rotate(-90 230 221)"/>`
 out+=`<path d="M224 141h12M224 301h12M150 215v12M310 215v12" fill="none" stroke="${c.accent}" stroke-width="1.4"/>`
 out+=text(230,188,'ENGINE / 01',6.5,c.ash,'middle','letter-spacing="1.4"')
 out+=text(230,218,setup.core,Math.min(19,104/(setup.core.length*.65)),c.bone,'middle','letter-spacing="1.4" font-weight="700"')
 out+=text(230,237,board.model===undefined?'NEURAL ENGINE':shortModel(board.model),8,c.ash,'middle')
 out+=text(230,258,active.length>0?'PROCESSING':'STANDBY',7,active.length>0?c.hot:c.ash,'middle','letter-spacing="1.2"')
 out+=text(230,333,full===undefined?'CONTEXT / —':`CONTEXT / ${full}%`,7,c.accent,'middle','letter-spacing="1.1"')
 out+=plates.join('')
 const metrics=[['SIGNALS',String(total)],['IN FLIGHT',String(active.length)],['CONTEXT',full===undefined?'—':`${full}%`],['EXCEPTIONS',String(faults)]]
 metrics.forEach(([label,value],i)=>{
   const x=24+i*106
   if(i>0)out+=`<path d="M${x-12} 376v30" fill="none" stroke="${c.line}" stroke-width=".7"/>`
   out+=text(x,382,label??'',6,c.ash,'start','letter-spacing=".8"')
   out+=text(x,402,value??'',15,i===3&&faults>0?c.red:i===1?c.hot:c.bone)
 })
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 430" width="920" height="860">${setup.theme==='auto'?lightRules(setup.colors):''}${out}</svg>`
}
