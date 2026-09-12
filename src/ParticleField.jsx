import {useEffect,useRef} from 'react';

const COUNT=5200;
const fract=value=>value-Math.floor(value);
const noise=seed=>fract(Math.sin(seed*91.733)*43758.5453);
const smooth=value=>value*value*(3-2*value);

export default function ParticleField(){
  const ref=useRef(null);
  useEffect(()=>{
    const canvas=ref.current,ctx=canvas.getContext('2d');
    if(!ctx)return;
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    const logo=new Image(),particles=[];
    let w=0,h=0,raf=0,last=0,time=0,startedAt=0,ready=false,visible=true,dirty=true;
    const pointer={x:0,y:0,active:false};

    const buildLogo=()=>{
      const size=520,buffer=document.createElement('canvas');
      const sample=buffer.getContext('2d',{willReadFrequently:true});
      buffer.width=size;buffer.height=size;sample.drawImage(logo,0,0,size,size);
      const pixels=sample.getImageData(0,0,size,size).data,opaque=[];
      for(let y=0;y<size;y+=2)for(let x=0;x<size;x+=2){
        const index=(y*size+x)*4;
        if(pixels[index+3]>55)opaque.push([x/size-.5,y/size-.5,pixels[index],pixels[index+1],pixels[index+2]]);
      }
      for(let i=0;i<COUNT;i++){
        const point=opaque[Math.floor(noise(i+17)*opaque.length)];
        const angle=noise(i+91)*Math.PI*2,radius=Math.sqrt(noise(i+301));
        particles.push({
          tx:point[0]+(noise(i+51)-.5)*.008,ty:point[1]+(noise(i+71)-.5)*.008,
          sx:Math.cos(angle)*radius,sy:Math.sin(angle)*radius,
          phase:noise(i+111)*Math.PI*2,depth:.35+noise(i+151)*.9,
          color:`rgb(${point[2]} ${point[3]} ${point[4]})`
        });
      }
      startedAt=Date.now();ready=true;dirty=true;
    };

    const resize=()=>{
      const rect=canvas.getBoundingClientRect(),ratio=Math.min(devicePixelRatio,1.6);
      w=rect.width;h=rect.height;canvas.width=Math.round(w*ratio);canvas.height=Math.round(h*ratio);
      ctx.setTransform(ratio,0,0,ratio,0,0);dirty=true;
    };
    const move=event=>{
      const rect=canvas.getBoundingClientRect();
      pointer.x=event.clientX-rect.left;pointer.y=event.clientY-rect.top;pointer.active=true;
      canvas.dataset.pointer='active';dirty=true;
    };
    const leave=()=>{pointer.active=false;canvas.dataset.pointer='idle';dirty=true};
    const draw=now=>{
      raf=requestAnimationFrame(draw);
      if(!ready||!visible||document.hidden||now-last<32||(reduced.matches&&!dirty))return;
      last=now;dirty=false;time=reduced.matches?0:(Date.now()-startedAt)/1000;
      const hero=canvas.parentElement;
      const scroll=reduced.matches?0:Math.max(0,Math.min(1,-hero.getBoundingClientRect().top/Math.max(hero.offsetHeight*.78,1)));
      const formation=reduced.matches?1:smooth(Math.max(0,Math.min(1,(Date.now()-startedAt-180)/2350)));
      const morph=smooth(scroll),compact=Math.min(w*(w<650?.92:.72),h*(w<650?.52:.82));
      const cloudX=w*(w<650?.64:.6),cloudY=h*(w<650?.54:.52),count=w<650?2800:COUNT;
      const repelRadius=w<650?92:150,repelForce=w<650?30:48;
      ctx.clearRect(0,0,w,h);ctx.globalCompositeOperation='lighter';
      for(let i=0;i<count;i++){
        const p=particles[i],pulse=Math.sin(time*2+p.phase),spin=p.phase+time*1.4+morph*2.8;
        const flow=Math.sin(time*1.35+p.tx*18+p.ty*9),orbit=3.2+p.depth*4.4;
        const aliveX=Math.cos(p.phase+time*(.65+p.depth*.18))*orbit+flow*2.2;
        const aliveY=Math.sin(p.phase+time*(.58+p.depth*.16))*orbit+Math.cos(time*1.1+p.ty*20)*2.2;
        const logoX=w*.5+p.tx*compact+aliveX,logoY=h*.49+p.ty*compact+aliveY;
        const scatteredX=w*.5+p.sx*cloudX+Math.cos(p.phase+time*.7)*24;
        const scatteredY=h*.49+p.sy*cloudY+Math.sin(p.phase+time*.6)*28;
        const assembledX=scatteredX+(logoX-scatteredX)*formation;
        const assembledY=scatteredY+(logoY-scatteredY)*formation;
        const vortexX=w*.5+p.sx*cloudX*(.22+morph*.95)+Math.cos(spin)*28*morph;
        const vortexY=h*.49+p.sy*cloudY*(.16+morph*.88)+Math.sin(spin)*35*morph-scroll*80;
        let x=assembledX*(1-morph)+vortexX*morph;
        let y=assembledY*(1-morph)+vortexY*morph;
        if(pointer.active){
          const dx=x-pointer.x,dy=y-pointer.y,distance=Math.hypot(dx,dy);
          if(distance<repelRadius){
            const strength=(1-distance/repelRadius)**2*repelForce;
            const safeDistance=Math.max(distance,.01);
            x+=dx/safeDistance*strength;y+=dy/safeDistance*strength;
          }
        }
        ctx.globalAlpha=(.2+p.depth*.62)*(1-morph*.42)*(.58+formation*.42);
        ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(x,y,p.depth*.72+.28+pulse*.12,0,Math.PI*2);ctx.fill();
      }
      ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;
      canvas.dataset.formation=formation.toFixed(3);canvas.dataset.scroll=scroll.toFixed(3);
      canvas.dataset.motion=reduced.matches?'reduced':`flowing-${(time%10).toFixed(2)}`;
      canvas.dataset.shape=formation<.3?'scattered':formation<.98?'forming':scroll<.18?'norium-n':'morphing';
    };

    logo.onload=buildLogo;logo.src='/images/symbol.png';
    const observer=new ResizeObserver(resize);observer.observe(canvas);
    const intersection=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;dirty=true});intersection.observe(canvas);
    const motionChange=()=>{dirty=true};reduced.addEventListener('change',motionChange);
    const hero=canvas.parentElement;
    hero.addEventListener('pointermove',move);hero.addEventListener('pointerleave',leave);canvas.dataset.pointer='idle';
    resize();raf=requestAnimationFrame(draw);
    return()=>{cancelAnimationFrame(raf);observer.disconnect();intersection.disconnect();reduced.removeEventListener('change',motionChange);hero.removeEventListener('pointermove',move);hero.removeEventListener('pointerleave',leave)};
  },[]);
  return <canvas ref={ref} className="particle-field" aria-hidden="true"/>;
}
