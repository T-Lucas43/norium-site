import { mkdirSync, readFileSync, writeFileSync, existsSync, unlinkSync, rmdirSync } from 'node:fs';
const pages = {plataforma:'A plataforma Norium',solucoes:'Soluções Norium',nora:'Conheça a Nora',planos:'Planos Norium',telas:'Telas do Norium'};
const html=readFileSync('dist/index.html','utf8');
if(html.includes('/src/')) throw new Error('Build contém referência ao código fonte');
for(const [route,title] of Object.entries(pages)) {mkdirSync(`dist/${route}`,{recursive:true});writeFileSync(`dist/${route}/index.html`,html.replace(/<title>.*?<\/title>/,`<title>${title}</title>`));}
if(!existsSync('dist/.htaccess')) throw new Error('.htaccess ausente');
console.log('Seis entradas HTML estáticas prontas. Nenhum servidor Node.js necessário.');

for(const name of ['norium-intro.mp4','norium-intro-4k.mp4','norium-intro-4k-hq.mp4']) {
 const path='dist/media/'+name; if(existsSync(path)) unlinkSync(path);
}
try {rmdirSync('dist/media')} catch(error) {if(!['ENOENT','ENOTEMPTY'].includes(error.code)) throw error}
