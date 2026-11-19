import {expect,test} from 'claude-code/testing'
import {drawMap,setupFrom} from './map'
import {parseMap} from './raster'
const PANE={plugin:'neural-map',component:'Pane',requestId:'neural-map',props:{title:'Neural Map',isFocused:false,bodyColumns:60,placement:'dock',scroll:{offset:0,bodyRows:40},view:{}}} as const

test('presets change the drawing while preserving recorded activity and custom overrides',()=>{
 const board={entries:[],counts:{files:7},context:32};
 const city=drawMap(board,1000,setupFrom({theme:'dark',colorPreset:'night-city',skin:'cyberpunk'}));
 const red=drawMap(board,1000,setupFrom({theme:'dark',colorPreset:'arasaka',skin:'cyberpunk'}));
 expect(city).toContain('#f4f444');expect(red).toContain('#ff6274');expect(red).not.toBe(city);
 expect(city).toContain('NEURAL / MAP');expect(city).toContain('>7</text>');expect(red).toContain('>7</text>');
 expect(drawMap(board,1000,setupFrom({colorPreset:'night-city',colors:'accent=#123456'}))).toContain('#123456');
 expect(drawMap(board,1000,setupFrom({colorPreset:'<script>'}))).toBe(drawMap(board,1000,setupFrom({colorPreset:'classic'})));
});

test('the optical HUD stays static at rest, preserves activity and supports the terminal painter',()=>{
 const setup=setupFrom({colorPreset:'night-city',skin:'cyberpunk',motion:'full'})
 const idle=drawMap({entries:[],counts:{files:7},context:38},10000,setup)
 expect(idle).toContain('OPTICAL LINK');expect(idle).not.toContain('repeatCount="indefinite"')
 expect(parseMap(idle).unknown).toEqual([])
 const busy=drawMap({entries:[{id:'a',station:'files',label:'private',from:'core',status:'run',startedAt:9500}],counts:{files:7}},10000,setup)
 expect(busy).toContain('ACTIVE');expect(busy).not.toContain('private')
 expect(busy).toContain('animateMotion')
 expect(drawMap({entries:[],counts:{}},10000,setupFrom({skin:'cyberpunk',motion:'reduced'}))).not.toContain('animateMotion')
});

test('the native theme button changes color without starting tools or losing activity',{options:{colorPreset:'night-city',skin:'cyberpunk'}},async($,on)=>{
 let saved: unknown
 on('store.set',(_,e)=>{if(e.key==='colorPreset')saved=e.value;return {value:undefined}})
 on('clock.now',()=>({value:10000}));on('tool.call',()=>({result:{}}) as never);
 await $.tool.call({tool:'Read',file_path:'/a/example.ts'});
 const ui=await $.ui.mount({...PANE,surface:'desktop'});
 expect(String((await ui.find({type:'Svg'}))?.props.source)).toContain('#f4f444');
 await ui.press({key:'theme-next'});
 expect(String((await ui.find({type:'Svg'}))?.props.source)).toContain('#32e5ed');
 expect(await ui.find({type:'Text',text:/example.ts/})).toBeDefined();
 expect(saved).toEqual({preset:'netrunner',configured:'night-city'});
 await ui.unmount();
});
