# Norium — site institucional

Site independente em React + Vite, com GSAP ScrollTrigger, destinado à Hostinger.

## Rodar localmente

```sh
npm ci
npm run dev
```

Abra http://127.0.0.1:4173. Para testar a versão compilada: `npm run build` e `npm run preview`.

## Páginas

- `/`: início com vídeo animado e galeria bento sincronizada com a rolagem.
- `/plataforma`: abas de recursos e capturas ampliáveis.
- `/solucoes`: conteúdo para pessoas, equipes e gestão.
- `/nora`: apresentação e exemplos de uso, sem chat no site.
- `/telas`: galeria pesquisável de telas reais com dados de demonstração.
- `/planos`: Free, Individual, Equipe e Enterprise; perguntas frequentes.

Todos os botões de acesso usam o endereço definido em `src/data.js`, fornecido pelo proprietário.

## Hostinger

- Build: `npm ci && npm run build`.
- Diretório público: `dist`.
- Em hospedagem de arquivos estáticos, publique o **conteúdo de dist**, incluindo `.htaccess`, em `public_html`.
- Em integração com build automático, selecione Vite, o comando de build e `dist`.
- O `.htaccess` permite abrir e recarregar diretamente as páginas. Em servidores que não usam Apache, configure fallback para `index.html`.
- O repositório não configura domínio nem publica automaticamente: isso depende do plano de hospedagem do proprietário.

## Conteúdo e origem

Logotipo e símbolo da Nora vêm do projeto Norium. As capturas são interfaces reais renderizadas localmente com respostas de API fictícias e isoladas, sem dados de clientes ou credenciais.

O vídeo fornecido pelo proprietário foi convertido para H.264 sem faixa de áudio, com nitidez moderada, CRF 16 e faststart. Ampliado para 3840×2160 a 24 fps: não é restauração por IA nem recuperação de detalhes inexistentes. O arquivo original permanece intacto.

Preços: há divergência entre o cadastro público de planos (79/179/399) e a tabela financeira (129/299/899). Até confirmação do proprietário, os planos pagos aparecem como **Sob consulta**. Free aparece como R$ 0. Edite `src/data.js` após confirmação e confira os recursos/limites antes da publicação comercial.

Referências de direção visual: https://openai.com/pt-BR/, https://demos.gsap.com/demo/scrubbed-bento-gallery/, https://animejs.com/ e https://motion.dev/examples. Layout e implementação próprios, sem cópia de marcas ou conteúdo das referências.

## Acessibilidade e movimento

Menu responsivo, links de pular conteúdo, foco visível, diálogos nativos fecháveis com Escape e preferência de movimento reduzido. O vídeo não possui controles visíveis, conforme solicitado; respeita movimento reduzido. A animação do vídeo usa pin/scrub no desktop e mobile, sobre fundo preto, sem imagens ao redor.

## Validação

Build Vite aprovado. As seis páginas foram verificadas em 360, 390, 768 e 1440 pixels, sem overflow horizontal ou erros de JavaScript. Menu mobile, Escape, abas, ampliação de capturas, busca da galeria, FAQ e movimento reduzido foram verificados. A hero foi medida no início, meio e fim da animação em mobile e desktop, com vídeo inteiro e sem imagens ao redor.

A galeria contém 26 telas do workspace. As telas de administração interna não fazem parte desta apresentação pública.
