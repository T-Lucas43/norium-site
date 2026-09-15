import {useEffect,useRef,useState} from 'react';
import {ArrowUpRight,LoaderCircle,Send,Sparkles} from 'lucide-react';
import {APP_URL} from './data';
import './mini-nora-chat.css';

const INITIAL_MESSAGE={role:'assistant',content:'Olá! Eu sou a Nora. Posso explicar como o Norium organiza tarefas, comunicação, documentos e o trabalho da sua equipe.'};
const SUGGESTIONS=['O que é o Norium?','Que problema ele resolve?','Como a Nora pode ajudar?'];
const localHosts=new Set(['localhost','127.0.0.1']);
const SCOPE_FEEDBACK='Este mini chat foi criado para explicar o Norium com respostas objetivas e confiáveis. Por isso, mantenho o foco na plataforma e não respondo assuntos externos. Posso ajudar com tarefas e projetos, equipe, documentos, integrações, planos ou explicar como a Nora funciona.';
const LOCAL_RESPONSES={
  'oi':'Olá! Posso explicar o que é o Norium, quais problemas ele resolve e como seus recursos ajudam profissionais e equipes. O que você gostaria de conhecer?',
  'ola':'Olá! Posso explicar o que é o Norium, quais problemas ele resolve e como seus recursos ajudam profissionais e equipes. O que você gostaria de conhecer?',
  'o que e o norium':'O Norium é um workspace que reúne organização, comunicação, documentos e inteligência artificial. Ele reduz o tempo perdido entre ferramentas e mantém tarefas, decisões e informações no mesmo contexto, para profissionais e equipes trabalharem com mais clareza.',
  'que problema ele resolve':'O Norium resolve a fragmentação do trabalho: tarefas em um lugar, conversas em outro e documentos difíceis de localizar. Ao reunir esses elementos em um workspace, ele reduz retrabalho, perda de contexto e dúvidas sobre prioridades e responsabilidades.',
  'qual problema ele resolve':'O Norium resolve a fragmentação do trabalho: tarefas em um lugar, conversas em outro e documentos difíceis de localizar. Ao reunir esses elementos em um workspace, ele reduz retrabalho, perda de contexto e dúvidas sobre prioridades e responsabilidades.',
  'como a nora pode ajudar':'A Nora é a assistente de IA do Norium. Ela ajuda a organizar ideias, resumir conteúdos, esclarecer recursos e estruturar próximos passos. Neste mini chat, ela explica a plataforma; dentro da conta, suas capacidades dependem do plano, das integrações e das permissões.'
};

function normalized(value){return value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().replace(/[?!.,]+$/g,'').trim()}
function localResponse(question){return LOCAL_RESPONSES[normalized(question)]||''}
function conciseResponse(value){
  const clean=String(value||'').replace(/\*\*/g,'').replace(/^[-•]\s*/gm,'').replace(/\s+/g,' ').trim();
  const words=clean.split(/\s+/);
  if(words.length<=85)return clean;
  const sentences=clean.match(/[^.!?]+[.!?]+/g)||[];
  let result='';
  for(const sentence of sentences){if(`${result} ${sentence}`.trim().split(/\s+/).length>85)break;result=`${result} ${sentence}`.trim()}
  return result||`${words.slice(0,85).join(' ')}…`;
}

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
    const immediate=localResponse(clean);
    if(immediate){setMessages(current=>[...current,{role:'user',content:clean},{role:'assistant',content:immediate}]);setInput('');setError('');return}
    const history=messages.slice(-6).map(({role,content})=>({role,content}));
    setMessages(current=>[...current,{role:'user',content:clean}]);setInput('');setBusy(true);setError('');
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),30000);
    try{
      const response=await fetch(endpoint(),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:clean,history}),signal:controller.signal});
      const data=await response.json().catch(()=>({}));
      if(!response.ok)throw new Error(data.detail||'Não consegui responder agora.');
      const restricted=Boolean(data.restricted);
      setMessages(current=>[...current,{role:'assistant',content:restricted?SCOPE_FEEDBACK:conciseResponse(data.response||'Não consegui responder agora.'),restricted}]);
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
    {(messages.length===1||messages[messages.length-1]?.restricted)&&<div className="mini-nora-suggestions">{SUGGESTIONS.map(item=><button type="button" onClick={()=>ask(item)} key={item}>{item}</button>)}</div>}
    {error&&<p className="mini-nora-error" role="alert">{error}</p>}
    <form className="mini-nora-composer" onSubmit={event=>{event.preventDefault();ask(input)}}><label><textarea aria-label="Pergunte sobre o Norium" rows="1" maxLength="600" value={input} onChange={event=>setInput(event.target.value)} onKeyDown={event=>{if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();ask(input)}}} placeholder="Pergunte sobre o Norium..." disabled={busy}/><button type="submit" aria-label="Enviar pergunta" disabled={busy||!input.trim()}>{busy?<LoaderCircle className="spin" size={18}/>:<Send size={18}/>}</button></label></form>
    <footer><span>Foco exclusivo em dúvidas sobre o Norium.</span><a href={APP_URL}>Abrir a Nora completa <ArrowUpRight size={13}/></a></footer>
  </section>
}
