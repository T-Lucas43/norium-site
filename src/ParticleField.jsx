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
    let w=0,h=0,raf=0,last=0,time=0,ready=false,visible=true,dirty=true,mouseX=.5,mouseY=.5;

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
      ready=true;dirty=true;
    };

    const resize=()=>{
      const rect=canvas.getBoundingClientRect(),ratio=Math.min(devicePixelRatio,1.6);
      w=rect.width;h=rect.height;canvas.width=Math.round(w*ratio);canvas.height=Math.round(h*ratio);
      ctx.setTransform(ratio,0,0,ratio,0,0);dirty=true;
    };
    const move=event=>{
      const rect=canvas.getBoundingClientRect();
      mouseX=(event.clientX-rect.left)/Math.max(rect.width,1);
      mouseY=(event.clientY-rect.top)/Math.max(rect.height,1);
    };
    const draw=now=>{
      raf=requestAnimationFrame(draw);
      if(!ready||!visible||document.hidden||now-last<32||(reduced.matches&&!dirty))return;
      last=now;dirty=false;if(!reduced.matches)time+=.0038;
      const hero=canvas.parentElement;
      const scroll=reduced.matches?0:Math.max(0,Math.min(1,-hero.getBoundingClientRect().top/Math.max(hero.offsetHeight*.78,1)));
      const morph=smooth(scroll),compact=Math.min(w*(w<650?.92:.72),h*(w<650?.52:.82));
      const cloudX=w*(w<650?.64:.6),cloudY=h*(w<650?.54:.52),count=w<650?2800:COUNT;
      ctx.clearRect(0,0,w,h);ctx.globalCompositeOperation='lighter';
      for(let i=0;i<count;i++){
        const p=particles[i],pulse=Math.sin(time*2+p.phase),spin=p.phase+time*1.4+morph*2.8;
        const logoX=w*.5+p.tx*compact,logoY=h*.49+p.ty*compact;
        const vortexX=w*.5+p.sx*cloudX*(.22+morph*.95)+Math.cos(spin)*28*morph;
        const vortexY=h*.49+p.sy*cloudY*(.16+morph*.88)+Math.sin(spin)*35*morph-scroll*80;
        const x=logoX*(1-morph)+vortexX*morph+Math.cos(p.phase+time)*p.depth*2.3+(mouseX-.5)*18*p.depth*(1-morph);
        const y=logoY*(1-morph)+vortexY*morph+Math.sin(p.phase+time*.8)*p.depth*2.3+(mouseY-.5)*12*p.depth*(1-morph);
        ctx.globalAlpha=(.2+p.depth*.62)*(1-morph*.42);
        ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(x,y,p.depth*.72+.28+pulse*.12,0,Math.PI*2);ctx.fill();
      }
      ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;
      canvas.dataset.scroll=scroll.toFixed(3);canvas.dataset.shape=scroll<.18?'norium-n':'morphing';
    };

    logo.onload=buildLogo;logo.src='/images/symbol.png';
    const observer=new ResizeObserver(resize);observer.observe(canvas);
    const intersection=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;dirty=true});intersection.observe(canvas);
    const motionChange=()=>{dirty=true};reduced.addEventListener('change',motionChange);
    canvas.parentElement.addEventListener('pointermove',move);resize();raf=requestAnimationFrame(draw);
    return()=>{cancelAnimationFrame(raf);observer.disconnect();intersection.disconnect();reduced.removeEventListener('change',motionChange);canvas.parentElement.removeEventListener('pointermove',move)};
  },[]);
  return <canvas ref={ref} className="particle-field" aria-hidden="true"/>;
}
