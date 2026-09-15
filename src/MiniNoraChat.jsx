import {useEffect,useRef,useState} from 'react';
import {ArrowUpRight,LoaderCircle,Send,Sparkles} from 'lucide-react';
import {APP_URL} from './data';
import './mini-nora-chat.css';

const INITIAL_MESSAGE={role:'assistant',content:'Olá! Eu sou a Nora. Posso explicar como o Norium organiza tarefas, comunicação, documentos e o trabalho da sua equipe.'};
const SUGGESTIONS=['O que é o Norium?','Que problema ele resolve?','Como a Nora pode ajudar?'];
const localHosts=new Set(['localhost','127.0.0.1']);

function endpoint(){
  return localHosts.has(window.location.hostname)
    ? 'http://127.0.0.1:8000/api/public/site/nora'
    : '/nora.php';
}

export default function MiniNoraChat({compact=false}){
  const[messages,setMessages]=useState([INITIAL_MESSAGE]);
  const[input,setInput]=useState('');
  const[busy,setBusy]=useState(false);
  const[error,setError]=useState('');
  const listRef=useRef(null);

  useEffect(()=>{listRef.current?.scrollTo({top:listRef.current.scrollHeight,behavior:'smooth'})},[messages,busy]);

  async function ask(question){
    const clean=question.trim();
    if(!clean||busy)return;
    const history=messages.slice(-6).map(({role,content})=>({role,content}));
    setMessages(current=>[...current,{role:'user',content:clean}]);setInput('');setBusy(true);setError('');
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),30000);
    try{
      const response=await fetch(endpoint(),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:clean,history}),signal:controller.signal});
      const data=await response.json().catch(()=>({}));
      if(!response.ok)throw new Error(data.detail||'Não consegui responder agora.');
      setMessages(current=>[...current,{role:'assistant',content:data.response||'Não consegui responder agora.'}]);
    }catch(reason){
      setError(reason?.name==='AbortError'?'A resposta demorou mais que o esperado. Tente novamente.':reason.message||'Não consegui responder agora.');
    }finally{clearTimeout(timeout);setBusy(false)}
  }

  return <section className={`mini-nora ${compact?'is-compact':''}`} aria-label="Mini chat da Nora">
    <header className="mini-nora-header"><span className="mini-nora-avatar"><img src="/images/nora-symbol.webp" alt=""/></span><div><span><Sparkles size={11}/> Nora · Assistente Norium</span><strong>Tire suas dúvidas sobre a plataforma</strong><small><i/>Online</small></div></header>
    <div className="mini-nora-messages" ref={listRef} aria-live="polite">
      {messages.map((message,index)=><article className={`mini-nora-message is-${message.role}`} key={`${message.role}-${index}`}>
        {message.role==='assistant'&&<span className="mini-nora-message-avatar"><img src="/images/nora-symbol.webp" alt=""/></span>}
        <div>{message.role==='assistant'&&<b>Nora</b>}{message.content.split('\n').filter(Boolean).map((line,lineIndex)=><p key={lineIndex}>{line.replace(/^[-•]\s*/, '').replace(/\*\*/g,'')}</p>)}</div>
      </article>)}
      {busy&&<article className="mini-nora-message is-assistant is-thinking"><span className="mini-nora-message-avatar"><img src="/images/nora-symbol.webp" alt=""/></span><div><b>Nora</b><p><i/><i/><i/><span hidden>Nora está respondendo</span></p></div></article>}
    </div>
    {messages.length===1&&<div className="mini-nora-suggestions">{SUGGESTIONS.map(item=><button type="button" onClick={()=>ask(item)} key={item}>{item}</button>)}</div>}
    {error&&<p className="mini-nora-error" role="alert">{error}</p>}
    <form className="mini-nora-composer" onSubmit={event=>{event.preventDefault();ask(input)}}><label><textarea aria-label="Pergunte sobre o Norium" rows="1" maxLength="600" value={input} onChange={event=>setInput(event.target.value)} onKeyDown={event=>{if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();ask(input)}}} placeholder="Pergunte sobre o Norium..." disabled={busy}/><button type="submit" aria-label="Enviar pergunta" disabled={busy||!input.trim()}>{busy?<LoaderCircle className="spin" size={18}/>:<Send size={18}/>}</button></label></form>
    <footer><span>Este chat responde somente sobre o Norium.</span><a href={APP_URL}>Abrir a Nora completa <ArrowUpRight size={13}/></a></footer>
  </section>
}
