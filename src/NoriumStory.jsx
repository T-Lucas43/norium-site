const principles = [
  ['01', 'Um lugar para acompanhar', 'Projetos, tarefas, agenda e atividades ajudam você a enxergar o que está acontecendo e a decidir o que precisa de atenção.'],
  ['02', 'Contexto para colaborar', 'Conversas, documentos e responsabilidades ficam próximos da rotina da equipe. Cada pessoa consegue entender melhor sua participação no trabalho.'],
  ['03', 'IA como apoio ao trabalho', 'A Nora ajuda a desenvolver ideias, resumir informações e estruturar próximos passos. Ela participa desse ambiente, respeitando os recursos e acessos disponíveis.'],
  ['04', 'Continuidade entre as etapas', 'Da demanda à organização, da conversa à entrega: a proposta é reduzir a necessidade de reconstruir o contexto toda vez que a atividade muda.'],
];

export default function NoriumStory(){
  return <section className="norium-story section" id="a-ideia" aria-labelledby="story-title">
    <div className="story-heading">
      <p className="home-kicker">ANTES DOS RECURSOS, A IDEIA</p>
      <h2 id="story-title">Quando o trabalho se espalha, <br/>o contexto se perde.</h2>
      <p className="story-opening">O Norium parte de uma necessidade simples: entender o que está acontecendo, reunir o que importa e conseguir continuar o trabalho sem começar do zero a cada troca de ferramenta.</p>
    </div>
    <nav className="story-index" aria-label="Entenda o Norium">
      <a href="#o-problema">O problema</a><a href="#a-origem">Como surgiu</a><a href="#a-proposta">A proposta</a><a href="#na-pratica">Na prática</a>
    </nav>
    <div className="story-chapter" id="o-problema">
      <div><span className="chapter-number">01 / O PROBLEMA</span><h3>Muitas ferramentas.<br/>Uma rotina fragmentada.</h3></div>
      <div className="chapter-body">
        <p>Uma solicitação chega por mensagem. O prazo vai para a agenda. O arquivo fica em uma pasta. A execução depende de uma tarefa, e a decisão final se perde em outra conversa. As informações existem, mas conectar essas partes acaba virando mais um trabalho.</p>
        <p>Para quem trabalha sozinho, isso dificulta organizar prioridades. Para uma equipe, a dificuldade cresce: além de encontrar a informação, é preciso entender quem ficou responsável, o que já foi decidido e qual é o próximo passo.</p>
        <ul className="story-points"><li><strong>Informação dispersa:</strong> procurar mensagens, arquivos e anotações para entender uma demanda.</li><li><strong>Responsabilidades pouco claras:</strong> depender de novas perguntas para saber quem faz o quê.</li><li><strong>Retrabalho:</strong> repetir explicações e reorganizar informações que já estavam disponíveis.</li><li><strong>Falta de uma visão do todo:</strong> acompanhar tarefas isoladas sem enxergar a rotina e suas prioridades.</li></ul>
      </div>
    </div>
    <div className="story-chapter" id="a-origem">
      <div><span className="chapter-number">02 / COMO SURGIU</span><h3>Da fragmentação<br/>nasceu uma proposta.</h3></div>
      <div className="chapter-body">
        <p>O Norium surgiu a partir de uma observação: o trabalho digital ganhou uma ferramenta para cada necessidade, mas perdeu continuidade entre elas. Organizar a rotina passou a exigir alternar entre páginas, reconstruir o contexto e repetir informações.</p>
        <p>A ideia foi criar um espaço que acompanhasse o trabalho por inteiro — do planejamento à conversa, do documento à entrega — e que também pudesse contar com inteligência artificial como apoio ao raciocínio e à organização.</p>
      </div>
    </div>
    <div className="story-chapter" id="a-proposta">
      <div><span className="chapter-number">03 / A IDEIA CENTRAL</span><h3>Dar continuidade<br/>ao seu trabalho.</h3></div>
      <div className="chapter-body">
        <p>O Norium é um ambiente de trabalho digital que reúne organização, colaboração, comunicação, documentos e inteligência artificial. A proposta é aproximar essas atividades para que você tenha mais contexto ao planejar, conversar e executar.</p>
        <p>Isso vai além de marcar uma tarefa como concluída. É ter um lugar para acompanhar um projeto, consultar seus compromissos, alinhar a equipe, trabalhar com documentos e pedir apoio à Nora ao longo do caminho.</p>
        <p>A plataforma faz sentido para profissionais, equipes e empresas que lidam com várias demandas ao mesmo tempo e precisam transformar informação espalhada em uma rotina compreensível.</p>
      </div>
    </div>
    <div className="story-principles">{principles.map(([number,title,description])=><article key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p></article>)}</div>
    <div className="story-example" id="na-pratica">
      <div><p className="home-kicker">UMA SITUAÇÃO DO DIA A DIA</p><h3>Do pedido de um cliente<br/>ao próximo passo da equipe.</h3><p>Imagine uma nova demanda que envolve prazo, pessoas e uma proposta comercial. Veja como os espaços do Norium podem participar desse trabalho:</p></div>
      <ol><li><strong>Entenda a demanda.</strong><span>Consulte a conversa e reúna as informações relevantes.</span></li><li><strong>Organize a execução.</strong><span>Crie um projeto e tarefas com responsáveis, prioridades e datas.</span></li><li><strong>Prepare e alinhe.</strong><span>Trabalhe na proposta, converse com a equipe e use a Nora para apoiar a organização das ideias.</span></li><li><strong>Acompanhe a continuidade.</strong><span>Consulte o quadro do projeto e a agenda para revisar entregas e compromissos.</span></li></ol>
      <p className="story-example-note">Esse é um exemplo de uso. Você configura seus projetos e canais; as etapas não são criadas automaticamente. Integrações e recursos dependem do plano e da configuração da conta.</p>
    </div>
    <div className="story-bridge"><p>Essa é a proposta. Agora, conheça os espaços que ajudam a colocá-la em prática.</p><a href="#o-que-faz">O que você pode fazer no Norium <span aria-hidden="true">↓</span></a></div>
  </section>;
}
