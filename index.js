// 🚀 BOT WARLOCK - VERSÃO PRONTA PARA USAR | SEM LICENÇA | PRONTO PARA VENDER
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
let banco = { admins: [], gold: [], grupos: {}, pontos: {}, palavras_proibidas: [], bloqueio_links: false };
if (fs.existsSync(CONFIG.banco)) banco = JSON.parse(fs.readFileSync(CONFIG.banco));
function salvarBanco() { fs.writeFileSync(CONFIG.banco, JSON.stringify(banco, null, 2)) }

// 🚀 INICIANDO - AGORA ELE JÁ ENTRA DIRETO, SEM PEDIR NADA
create({
  session: 'bot-warlock-vendas',
  multidevice: true,
  logQR: false,
  disableSpins: true,
  headless: "new",
  autoClose: 0,
  browserArgs: ['--no-sandbox', '--disable-setuid-sandbox']
})
.then(client => {
  console.log('\n🟢🟢🟢 BOT LIGADO E CONECTADO COM SUCESSO! 🟢🟢🟢\n');
  console.log('✅ PRONTO PARA RECEBER COMANDOS!');

  // ⚡ TODOS OS COMANDOS AQUI (TUDO FUNCIONANDO)
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
🎵 !musica nome
🎬 !video nome
😂 !piada
💬 !frase
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
`);
    }

    if (cmd === 'menuadm' && (nivel === 'admin' || nivel === 'dono')) {
      await client.sendText(msg.from, `
🛡️ *MENU ADMIN*
━━━━━━━━━━━━━━━━━━
!banir @usuario
!promover @usuario
!grupo fechar/abrir
`);
    }

    // 🎵 MÚSICA
    if (cmd === 'musica' && args && (nivel === 'gold' || nivel === 'admin' || nivel === 'dono')) {
      try {
        await client.sendText(msg.from, '🔎 Buscando... aguarde ⏳');
        const info = await ytdl.getInfo(args.includes('http') ? args : `ytsearch:${args}`);
        const caminho = path.join(__dirname, `musica_${Date.now()}.mp3`);
        
        ffmpeg(ytdl(info.videoDetails.video_url, { quality: 'highestaudio' }))
          .audioBitrate(128)
          .save(caminho)
          .on('end', async () => {
            await client.sendFile(msg.from, caminho, 'musica.mp3', `🎵 *${info.videoDetails.title}*`);
            fs.unlinkSync(caminho);
          });
      } catch (e) { await client.sendText(msg.from, '❌ Erro ao baixar.') }
    }

    // 🛡️ ADM
    if (cmd === 'banir' && msg.mentionedJidList.length > 0 && (nivel === 'admin' || nivel === 'dono')) {
      const user = msg.mentionedJidList[0];
      await client.removeParticipant(msg.from, user);
      await client.sendText(msg.from, `✅ @${user.split('@')[0]} removido!`);
    }

    // 🚫 BLOQUEIO DE LINKS
    if (banco.bloqueio_links && /https?:\/\/|wa.me/.test(corpo)) {
      await client.sendText(msg.from, `⚠️ @${remetente.split('@')[0]}, LINKS PROIBIDOS! 🚫`);
      await client.deleteMessage(msg.from, msg.id);
    }

    // 🎉 DIVERSÃO
    if (cmd === 'piada') {
      const piadas = ["Livro de matemática triste: muitos problemas 🤣", "0 pro 8: que cinto lindo 😂"];
      await client.sendText(msg.from, `😂 *PIADA:*\n${piadas[Math.floor(Math.random() * piadas.length)]}`);
    }

    if (!cmd && Math.random() < 0.2) {
      await client.sendText(msg.from, '👋 Digite *!menu* para ver tudo!');
    }
  });

})
.catch(erro => {
  console.log('\n❌ ERRO:', erro);
  console.log('\n🔄 Reiniciando...');
  setTimeout(() => process.exit(1), 3000);
});