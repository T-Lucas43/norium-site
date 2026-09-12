# Publicar no Hostinger Web Premium

Este site roda como HTML, CSS, JavaScript, imagens e animação canvas. React é executado no navegador; Node.js é usado somente para gerar os arquivos antes do upload. Não selecione “Aplicativo Node.js”.

## Opção 1 — ZIP pronto

1. No hPanel, adicione um site personalizado/HTML/PHP ou site vazio no plano Premium, conforme os rótulos disponíveis, e associe seu domínio.
2. Abra o Gerenciador de arquivos e entre em `public_html` do domínio.
3. Faça backup de qualquer site existente antes de substituir arquivos.
4. Envie `norium-hostinger-premium.zip` e extraia dentro de `public_html`.
5. `index.html`, `.htaccess`, `assets`, `images` e as pastas de páginas devem ficar diretamente em `public_html`, sem uma pasta `dist` intermediária.
6. Abra o domínio e teste `/plataforma/`, `/solucoes/`, `/nora/`, `/planos/` e `/telas/`.

## Opção 2 — GitHub

Use a integração Git de sites estáticos/HTML/PHP do hPanel, não o fluxo de aplicativos Node.js.

- Repositório: https://github.com/T-Lucas43/norium-site
- Branch: **hostinger**
- Destino: raiz de `public_html`.
- Não há comando npm nem processo Node.js no servidor.

A branch `main` contém o projeto para desenvolvimento. A branch `hostinger` contém somente arquivos compilados e prontos para servir. O repositório continua privado: autorize a integração Git da Hostinger quando solicitado.

## Gerar novas versões

Na sua máquina: `npm ci`, depois `npm run build`. O diretório `dist` é a entrega estática.

Para atualizar a branch de hospedagem: `npm run publish:hostinger`. Exige Git autenticado e não usa force push.

Cada página tem seu próprio `index.html`, além do fallback Apache no `.htaccess`. O sistema Norium continua na Azure; os botões de acesso usam o endereço ativo da aplicação. O vídeo antigo permanece no código-fonte, mas não é incluído na publicação.
