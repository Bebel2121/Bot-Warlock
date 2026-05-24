// index.js 🤖 BOT WARLOCK - VERSÃO PARA VENDA
// ⚠️ LICENÇA OBRIGATÓRIA - NÃO ALTERE
const { create, Client } = require('@wppconnect-team/wppconnect');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');

// ==============================================
// 🔒 CONFIGURAÇÕES DE LICENÇA - VOCÊ EDITA POR CLIENTE
// ==============================================
const LICENCA = {
  chave: 'PRO-832895-387794-89', // GERADA POR VOCÊ
  dono_autorizado: '5532956198820@c.us', // NÚMERO DO CLIENTE
  valido_ate: '2030-05-24', // DATA DE VALIDADE
  versao: '3.0-PRO'
};

// ✅ VERIFICAÇÃO DE LICENÇA
const hoje = new Date().toISOString().split('T')[0];
if (LICENCA.chave !== 'PRO-832895-387794-89' || LICENCA.dono_autorizado === '5532956198820@c.us' || hoje > LICENCA.valido_ate) {
  console.clear();
  console.log(`
  ╔═════════════════════════════════════════╗
  ║  ❌ LICENÇA INVÁLIDA OU EXPIRADA!       ║
  ║                                         ║
  ║  Contate o suporte para renovar:        ║
  ║  @SEU_INSTA_AQUI                        ║
  ╚═════════════════════════════════════════╝
  `);
  process.exit(1);
}

// ⚙️ CONFIGURAÇÕES GERAIS
const CONFIG = {
  dono: LICENCA.dono_autorizado,
  prefixo: '!',
  banco: path.join(__dirname, 'dados.json'),
  versao: LICENCA.versao
};

// 📁 BANCO DE DADOS
let banco = {
  admins: [],
  gold: [],
  grupos: {},
  pontos: {},
  palavras_proibidas: [],
  bloqueio_links: false
};

if (fs.existsSync(CONFIG.banco)) banco = JSON.parse(fs.readFileSync(CONFIG.banco));
function salvarBanco() { fs.writeFileSync(CONFIG.banco, JSON.stringify(banco, null, 2)) }

// 🚀 INICIA O BOT
create({ session: 'bot-pro-' + LICENCA.chave.slice(0,6), catchAll: true, deviceName: 'BotGrupos PRO' })
.then(client => {
  console.log(`✅ BOT ATIVADO | Licença: ${LICENCA.chave.slice(0,10)}... | Válido até: ${LICENCA.valido_ate}`);

  // ... TODO O RESTO DO CÓDIGO QUE TE PASSEI ANTES (MENUS, FUNÇÕES, TUDO) ...
  // COLA TODO O RESTO AQUI MESMO, IGUAL ANTES

})
.catch(erro => console.error('❌ ERRO:', erro));

const { create, Client } = require('@wppconnect-team/wppconnect');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');

// ⚙️ CONFIGURAÇÕES GERAIS
const CONFIG = {
  dono: '5532956198820@c.us', // COLOQUE SEU NÚMERO AQUI (com 55 + DDD)
  prefixo: '!', // comando começa com !
  banco: path.join(__dirname, 'dados.json'),
  versao: '3.0'
};

// 📁 BANCO DE DADOS
let banco = {
  admins: [],
  gold: [],
  grupos: {},
  pontos: {},
  palavras_proibidas: [],
  bloqueio_links: false
};

// Carrega dados salvos
if (fs.existsSync(CONFIG.banco)) banco = JSON.parse(fs.readFileSync(CONFIG.banco));
function salvarBanco() { fs.writeFileSync(CONFIG.banco, JSON.stringify(banco, null, 2)) }

// 🚀 INICIA O BOT
create({ session: 'bot-grupos-completo', catchAll: true, deviceName: 'MeuBot' })
.then(client => {
  console.log('✅ BOT LIGADO! Escaneie o QR Code');

  // ⚡ QUANDO CHEGAR MENSAGEM
  client.onMessage(async (msg) => {
    if (msg.isGroupMsg === false) return; // só responde em grupos
    const grupo = await msg.getChat();
    const remetente = msg.author;
    const corpo = msg.body.toLowerCase().trim();
    const cmd = corpo.startsWith(CONFIG.prefixo) ? corpo.slice(1).split(' ')[0] : null;
    const args = corpo.split(' ').slice(1).join(' ');

    // 🧩 FUNÇÃO: VERIFICAR NÍVEL DO USUÁRIO
    function nivelUsuario() {
      if (remetente === CONFIG.dono) return 'dono';
      if (banco.admins.includes(remetente)) return 'admin';
      if (banco.gold.includes(remetente)) return 'gold';
      return 'membro';
    }
    const nivel = nivelUsuario();

    // 📋 MENUS PRINCIPAIS
    if (corpo === `${CONFIG.prefixo}menu` || corpo === 'menu') {
      await client.sendText(msg.from, `
🤖 *MEU BOT COMPLETO* v${CONFIG.versao}
━━━━━━━━━━━━━━━━━━
👑 *DONO*: !menudono
🛡️ *ADM*: !menuadm
⭐ *GOLD*: !menugold
🎮 *GERAL*: !menugeral
🎵 *MÚSICAS*: !menumusica
🎉 *BRINCADEIRAS*: !menujogos

Digite o comando para ver tudo!
`);
    }

    // 👑 MENU DONO
    if (cmd === 'menudono' && nivel === 'dono') {
      await client.sendText(msg.from, `
👑 *MENU DONO*
━━━━━━━━━━━━━━━━━━
!admadicionar @usuario - tornar admin
!admremover @usuario - tirar admin
!goldadicionar @usuario - dar cargo gold
!goldremover @usuario - tirar gold
!bloquearlinks - ativa/desativa bloqueio de links
!palavraadicionar palavra - proíbe palavra
!palavralistar - ver palavras proibidas
!limpartudo - limpa todas configurações
!pararbot - desliga o bot
`);
    }

    // 🛡️ MENU ADMIN
    if (cmd === 'menuadm' && (nivel === 'admin' || nivel === 'dono')) {
      await client.sendText(msg.from, `
🛡️ *MENU ADMIN*
━━━━━━━━━━━━━━━━━━
!banir @usuario - remover do grupo
!adicionar 5521... - adicionar número
!promover @usuario - tornar admin
!rebaixar @usuario - voltar a membro
!grupo fechar/abrir - controlar entrada
!boasvindas mensagem - configurar aviso
!regras - mostra regras do grupo
!antiflood - ativar/desativar
`);
    }

    // ⭐ MENU GOLD
    if (cmd === 'menugold' && (nivel === 'gold' || nivel === 'admin' || nivel === 'dono')) {
      await client.sendText(msg.from, `
⭐ *MENU GOLD*
━━━━━━━━━━━━━━━━━━
!musica nome - baixa e envia áudio
!pesquisa termo - busca no Google
!clima cidade - temperatura e tempo
!noticias - últimas notícias
!figurinha (mande imagem) - cria figurinha
!traduz pt/en texto - traduz mensagem
!calcular 2+2 - faz contas
`);
    }

    // 🎮 MENU GERAL
    if (cmd === 'menugeral') {
      await client.sendText(msg.from, `
🎮 *MENU GERAL*
━━━━━━━━━━━━━━━━━━
!perfil - ver seus pontos e cargo
!regras - regras do grupo
!ajuda - como usar
!sobre - informações do bot
!denunciar @usuario motivo - denúncia
!pontos - seu saldo
!ranking - top usuários
`);
    }

    // 🎵 MENU MÚSICAS
    if (cmd === 'menumusica') {
      await client.sendText(msg.from, `
🎵 *MENU DE MÚSICAS*
━━━━━━━━━━━━━━━━━━
!musica nome/link ➜ envia áudio
!letra nome da música ➜ mostra letra
!video nome ➜ baixa vídeo
!tocando ➜ o que está tocando
`);
    }

    // 🎉 MENU BRINCADEIRAS/JOGOS
    if (cmd === 'menujogos') {
      await client.sendText(msg.from, `
🎉 *BRINCADEIRAS & JOGOS*
━━━━━━━━━━━━━━━━━━
!pergunta ➜ pergunta aleatória
!adivinha ➜ jogo de adivinhação
!sorteio ➜ sorteia um membro
!piada ➜ manda uma piada
!matematica ➜ desafio de conta
!corrida ➜ jogo de corrida
!forca ➜ jogo da forca
!dado ➜ joga dado
!caraoucoroa ➜ sorteio
`);
    }

    // 🎵 COMANDO: BAIXAR E ENVIAR MÚSICA
    if (cmd === 'musica' && (nivel === 'gold' || nivel === 'admin' || nivel === 'dono')) {
      if (!args) return await client.sendText(msg.from, '❌ Digite o nome ou link: !musica nome da música');
      try {
        await client.sendText(msg.from, '🔎 Buscando música... aguarde ⏳');
        const info = await ytdl.getInfo(args.includes('http') ? args : `ytsearch:${args}`);
        const videoUrl = info.videoDetails.video_url;
        const caminho = path.join(__dirname, `musica_${Date.now()}.mp3`);

        ffmpeg(ytdl(videoUrl, { quality: 'highestaudio' }))
          .audioBitrate(128)
          .save(caminho)
          .on('end', async () => {
            await client.sendFile(msg.from, caminho, 'musica.mp3', `🎵 *${info.videoDetails.title}*\n⏱️ Duração: ${Math.floor(info.videoDetails.lengthSeconds/60)}min`);
            fs.unlinkSync(caminho); // apaga depois de enviar
          });
      } catch (e) { await client.sendText(msg.from, '❌ Erro ao baixar. Tente outro nome.'); }
    }

    // 🎉 COMANDO: PIADA
    if (cmd === 'piada') {
      const piadas = [
        "Por que o livro de matemática está sempre triste? Porque tem muitos problemas 🤣",
        "O que o zero disse para o oito: — Bonito cinto! 😂",
        "Qual é o café mais perigoso? O café-com-bala 😂",
        "Por que o peixe é o animal mais inteligente? Porque vive em cardume 🤣"
      ];
      const sorteada = piadas[Math.floor(Math.random() * piadas.length)];
      await client.sendText(msg.from, `😂 *PIADA:*\n${sorteada}`);
    }

    // 🛡️ COMANDOS DE ADMIN
    if (cmd === 'banir' && (nivel === 'admin' || nivel === 'dono')) {
      const mencionado = msg.mentionedJidList[0];
      if (!mencionado) return await client.sendText(msg.from, '❌ Marque quem quer remover: !banir @usuario');
      await grupo.removeParticipant(mencionado);
      await client.sendText(msg.from, `✅ @${mencionado.split('@')[0]} foi removido do grupo! ⛔`);
    }

    if (cmd === 'admadicionar' && nivel === 'dono') {
      const mencionado = msg.mentionedJidList[0];
      if (!mencionado) return await client.sendText(msg.from, '❌ Marque: !admadicionar @usuario');
      if (!banco.admins.includes(mencionado)) banco.admins.push(mencionado); salvarBanco();
      await client.sendText(msg.from, `✅ @${mencionado.split('@')[0]} agora é ADMIN 🛡️`);
    }

    if (cmd === 'goldadicionar' && nivel === 'dono') {
      const mencionado = msg.mentionedJidList[0];
      if (!mencionado) return await client.sendText(msg.from, '❌ Marque: !goldadicionar @usuario');
      if (!banco.gold.includes(mencionado)) banco.gold.push(mencionado); salvarBanco();
      await client.sendText(msg.from, `✅ @${mencionado.split('@')[0]} agora é MEMBRO GOLD ⭐`);
    }

    // 🚫 BLOQUEIO DE LINKS
    if (banco.bloqueio_links && /https?:\/\/|wa.me|chat.whatsapp.com/.test(corpo)) {
      await client.sendText(msg.from, `⚠️ @${remetente.split('@')[0]}, LINKS SÃO PROIBIDOS AQUI! 🚫`);
      await msg.delete(true); // apaga mensagem
      return;
    }

    // 📌 RESPOSTA PADRÃO
    if (!cmd && corpo !== 'menu') {
      const mensagens = [
        '👋 Oi! Digite *!menu* para ver tudo que eu faço 🤖',
        '✨ Quer ajuda? Manda *!menu* que eu mostro tudo!',
        '🎯 Comandos? É só digitar *!menu* 😉'
      ];
      if (Math.random() < 0.15) await client.sendText(msg.from, mensagens[Math.floor(Math.random() * mensagens.length)]);
    }

  }); // FIM DO ONMESSAGE

})
.catch(erro => console.error('❌ ERRO:', erro));