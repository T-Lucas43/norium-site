import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const temp=mkdtempSync(join(tmpdir(),'norium-publish-'));
const git=(args,extra={})=>execFileSync('git',args,{encoding:'utf8',...extra}).trim();
try {
 const gitDir=resolve(git(['rev-parse','--git-dir']));
 const env={...process.env,GIT_DIR:gitDir,GIT_WORK_TREE:resolve('dist'),GIT_INDEX_FILE:join(temp,'index')};
 const remote=git(['ls-remote','--heads','origin','hostinger']);
 let parent='';
 if(remote){git(['fetch','origin','hostinger']);parent=git(['rev-parse','FETCH_HEAD']);}
 git(['read-tree','--empty'],{env});git(['add','--all'],{env,cwd:resolve('dist')});
 const tree=git(['write-tree'],{env});
 const args=['commit-tree',tree,...(parent?['-p',parent]:[]),'-m',`Deploy estático Hostinger Premium — ${git(['rev-parse','--short','HEAD'])}`];
 const commit=git(args);git(['push','origin',`${commit}:refs/heads/hostinger`]);
 console.log('Branch hostinger publicada: '+commit);
} finally {rmSync(temp,{recursive:true,force:true});}
