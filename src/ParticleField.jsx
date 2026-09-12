import {useEffect,useRef} from 'react';

export default function ParticleField(){
  const ref=useRef(null);
  useEffect(()=>{
    const canvas=ref.current,ctx=canvas.getContext('2d');
    if(!ctx)return;
    const motion=matchMedia('(prefers-reduced-motion: reduce)');
    let w=0,h=0,frame=0,visible=true,t=0,last=0,dirty=true;
    const particles=Array.from({length:4400},(_,i)=>({
      a:i*2.399963,r:Math.sqrt(((i*1973)%4400+.5)/4400),
      z:(i%19)/19,j:Math.sin(i*127.1)*Math.cos(i*37.7)
    }));
    const resize=()=>{
      const rect=canvas.getBoundingClientRect();w=rect.width;h=rect.height;
      const d=Math.min(devicePixelRatio,1.5);
      canvas.width=w*d;canvas.height=h*d;
      ctx.setTransform(d,0,0,d,0,0);dirty=true;
    };
    const draw=now=>{
      frame=requestAnimationFrame(draw);
      if(!visible||document.hidden||now-last<32||(motion.matches&&!dirty))return;
      last=now;dirty=false;
      if(!motion.matches)t+=.003;
      const top=canvas.parentElement.getBoundingClientRect().top;
      const scroll=motion.matches?0:Math.max(0,Math.min(1,-top/Math.max(h,1)));
      ctx.clearRect(0,0,w,h);
      const count=w<650?2000:4400;
      for(let i=0;i<count;i++){
        const p=particles[i],angle=p.a+t+scroll*1.5;
        const radius=p.r*Math.min(w*.66,h*.95);
        const wave=Math.sin(p.a*3+t*2+p.r*8)*30+p.j*22;
        const x=w*.5+Math.cos(angle)*(radius+wave)*(1+scroll*.45);
        const y=h*.48+Math.sin(angle)*radius*(w<650?1.1:.66)+Math.sin(p.r*9+t)*60-scroll*85;
        ctx.fillStyle=`hsla(${210+p.z*52},100%,${55+p.z*25}%,${(.12+p.z*.65)*(1-scroll*.5)})`;
        ctx.beginPath();ctx.arc(x,y,p.z*.9+.35,0,Math.PI*2);ctx.fill();
      }
      canvas.dataset.scroll=scroll.toFixed(3);
    };
    const onMotion=()=>{dirty=true};
    const observer=new ResizeObserver(resize);observer.observe(canvas);
    const io=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;dirty=true});io.observe(canvas);
    motion.addEventListener('change',onMotion);
    resize();frame=requestAnimationFrame(draw);
    return()=>{cancelAnimationFrame(frame);observer.disconnect();io.disconnect();motion.removeEventListener('change',onMotion)};
  },[]);
  return <canvas ref={ref} className="particle-field" aria-hidden="true"/>;
}
