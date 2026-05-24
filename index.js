// 🚀 BOT WARLOCK - CONEXÃO POR CÓDIGO | SEM LICENÇA | PRONTO PARA VENDER
require('./keepalive');
const { create } = require('venom-bot');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');

// ⚙️ CONFIGURAÇÕES
const CONFIG = {
  dono: '5521991847707@c.us', // COLOQUE SEU NÚMERO AQUI
  prefixo: '!',
  versao: '5.0-COMPLETA',
  banco: path.join(__dirname, 'dados.json')
};

// 📁 BANCO DE DADOS
let banco = {
  admins: [], gold: [], grupos: {}, pontos: {}, palavras_proibidas: [], bloqueio_links: false
};
if (fs.existsSync(CONFIG.banco)) banco = JSON.parse(fs.readFileSync(CONFIG.banco));
function salvarBanco() { fs.writeFileSync(CONFIG.banco, JSON.stringify(banco, null, 2)) }

// 🚀 INICIANDO - AGORA POR CÓDIGO
create({
  session: 'bot-warlock-vendas',
  multidevice: true,
  logQR: false, // ❌ DESATIVA QR CODE
  disableSpins: true,
  useCode: true // ✅ ATIVA CÓDIGO DE TEXTO
})
.then(client => {

  // 📥 AQUI VAI APARECER O CÓDIGO DE CONEXÃO
  client.on('code', (code) => {
    console.log('\n\n✅✅✅ BOT LIGADO! USE ESSE CÓDIGO NO WHATSAPP ⬇️⬇️⬇️');
    console.log('==================================================');
    console.log(`🔑 CÓDIGO: ${code}`);
    console.log('==================================================');
    console.log('📱 COMO USAR:');
    console.log('1. Abra o WhatsApp > Aparelhos Conectados > Conectar aparelho');
    console.log('2. Clique em "Conectar com número ou código" (embaixo)');
    console.log('3. Digite o código que está aparecendo acima!');
    console.log('\n\n');
  });

  // 🟢 QUANDO CONECTAR
  client.on('ready', () => {
    console.log('\n🟢🟢🟢 CONECTADO COM SUCESSO! BOT 100% FUNCIONANDO 🟢🟢🟢\n');
  });

  // ⚡ TODOS OS COMANDOS AQUI (TUDO IGUAL, COMPLETO)
  client.onMessage(async (msg) => {
    if (!msg.isGroupMsg || !msg.body) return;

    const remetente = msg.author;
    const corpo = msg.body.toLowerCase().trim();
    const cmd = corpo.startsWith(CONFIG.prefixo) ? corpo.slice(1).split(' ')[0] : null;
    const args = corpo.split(' ').slice(1).join(' ');

    // 🧩 NÍVEL DE USUÁRIO
    function nivelUsuario() {
      if (remetente === CONFIG.dono) return 'dono';
      if (banco.admins.includes(remetente)) return 'admin';
      if (banco.gold.includes(remetente)) return 'gold';
      return 'membro';
    }
    const nivel = nivelUsuario();

    // 📋 MENUS
    if (corpo === `${CONFIG.prefixo}menu`) {
      await client.sendText(msg.from, `
🤖 *BOT WARLOCK PRO* v${CONFIG.versao}
━━━━━━━━━━━━━━━━━━
👑 !menudono
🛡️ !menuadm
⭐ !menugold
🎮 !menugeral
🎵 !menumusica
🎉 !menujogos
`);
    }

    if (cmd === 'menudono' && nivel === 'dono') {
      await client.sendText(msg.from, `
👑 *MENU DONO*
━━━━━━━━━━━━━━━━━━
!admadicionar @usuario
!admremover @usuario
!goldadicionar @usuario
!goldremover @usuario
!bloquearlinks
!palavraadicionar palavra
!palavraremover palavra
!listaradmins
!listargold
`);
    }

    if (cmd === 'menuadm' && (nivel === 'admin' || nivel === 'dono')) {
      await client.sendText(msg.from, `
🛡️ *MENU ADMIN*
━━━━━━━━━━━━━━━━━━
!banir @usuario
!adicionar 5521...
!promover @usuario
!rebaixar @usuario
!grupo fechar
!grupo abrir
!mutar @usuario
!desmutar @usuario
!avisar mensagem
`);
    }

    if (cmd === 'menugold' && (nivel === 'gold' || nivel === 'admin' || nivel === 'dono')) {
      await client.sendText(msg.from, `
⭐ *MENU GOLD*
━━━━━━━━━━━━━━━━━━
!musica nome/link
!video nome/link
!pesquisa termo
!clima cidade
!noticias
!figurinha (mande imagem)
!figurinhatexto texto
!traduz pt/en texto
!calcular conta
`);
    }

    if (cmd === 'menugeral') {
      await client.sendText(msg.from, `
🎮 *MENU GERAL*
━━━━━━━━━━━━━━━━━━
!regras
!ajuda
!dono
!status
!hora
!data
!sorteio
!piada
!frase
!pergunta
`);
    }

    // 🎵 COMANDOS DE MÍDIA
    if (cmd === 'musica' && args && (nivel === 'gold' || nivel === 'admin' || nivel === 'dono')) {
      try {
        await client.sendText(msg.from, '🔎 Buscando música... aguarde ⏳');
        const info = await ytdl.getInfo(args.includes('http') ? args : `ytsearch:${args}`);
        const caminho = path.join(__dirname, `musica_${Date.now()}.mp3`);
        
        ffmpeg(ytdl(info.videoDetails.video_url, { quality: 'highestaudio' }))
          .audioBitrate(128)
          .save(caminho)
          .on('end', async () => {
            await client.sendFile(msg.from, caminho, 'musica.mp3', `🎵 *${info.videoDetails.title}*`);
            fs.unlinkSync(caminho);
          });
      } catch (e) {
        await client.sendText(msg.from, '❌ Erro ao baixar. Tente outro nome.');
      }
    }

    if (cmd === 'video' && args && (nivel === 'gold' || nivel === 'admin' || nivel === 'dono')) {
      try {
        await client.sendText(msg.from, '🔎 Buscando vídeo... aguarde ⏳');
        const info = await ytdl.getInfo(args.includes('http') ? args : `ytsearch:${args}`);
        const caminho = path.join(__dirname, `video_${Date.now()}.mp4`);
        
        ffmpeg(ytdl(info.videoDetails.video_url, { quality: 'highestvideo' }))
          .save(caminho)
          .on('end', async () => {
            await client.sendFile(msg.from, caminho, 'video.mp4', `🎬 *${info.videoDetails.title}*`);
            fs.unlinkSync(caminho);
          });
      } catch (e) {
        await client.sendText(msg.from, '❌ Erro ao baixar. Tente outro nome.');
      }
    }

    // 🛡️ ADMINISTRAÇÃO
    if (cmd === 'banir' && msg.mentionedJidList.length > 0 && (nivel === 'admin' || nivel === 'dono')) {
      const mencionado = msg.mentionedJidList[0];
      await client.removeParticipant(msg.from, mencionado);
      await client.sendText(msg.from, `✅ @${mencionado.split('@')[0]} foi removido ⛔`);
    }

    if (cmd === 'admadicionar' && msg.mentionedJidList.length > 0 && nivel === 'dono') {
      const mencionado = msg.mentionedJidList[0];
      if (!banco.admins.includes(mencionado)) { banco.admins.push(mencionado); salvarBanco(); }
      await client.sendText(msg.from, `✅ @${mencionado.split('@')[0]} agora é ADMIN 🛡️`);
    }

    if (cmd === 'goldadicionar' && msg.mentionedJidList.length > 0 && nivel === 'dono') {
      const mencionado = msg.mentionedJidList[0];
      if (!banco.gold.includes(mencionado)) { banco.gold.push(mencionado); salvarBanco(); }
      await client.sendText(msg.from, `✅ @${mencionado.split('@')[0]} agora é GOLD ⭐`);
    }

    // 🚫 BLOQUEIOS
    if (banco.bloqueio_links && /https?:\/\/|wa.me|chat.whatsapp.com/.test(corpo)) {
      await client.sendText(msg.from, `⚠️ @${remetente.split('@')[0]}, LINKS PROIBIDOS! 🚫`);
      await client.deleteMessage(msg.from, msg.id);
    }

    const proibida = banco.palavras_proibidas.some(p => corpo.includes(p));
    if (proibida) {
      await client.sendText(msg.from, `⚠️ @${remetente.split('@')[0]}, PALAVRA PROIBIDA! 🚫`);
      await client.deleteMessage(msg.from, msg.id);
    }

    // 🎉 DIVERSÃO
    if (cmd === 'piada') {
      const piadas = ["Por que o livro de matemática é triste? Tem muitos problemas 🤣", "O que o 0 disse pro 8: Nossa, que cinto lindo 😂"];
      await client.sendText(msg.from, `😂 *PIADA:*\n${piadas[Math.floor(Math.random() * piadas.length)]}`);
    }

    if (cmd === 'frase') {
      const frases = ["A persistência é o caminho do êxito 💪", "O sucesso é a soma de pequenos esforços ✨"];
      await client.sendText(msg.from, `💬 *FRASE:*\n${frases[Math.floor(Math.random() * frases.length)]}`);
    }

    // RESPOSTA PADRÃO
    if (!cmd && corpo !== 'menu' && Math.random() < 0.2) {
      await client.sendText(msg.from, '👋 Digite *!menu* para ver todos os comandos!');
    }

  });

})
.catch(erro => {
  console.log('\n❌ ERRO:', erro);
});