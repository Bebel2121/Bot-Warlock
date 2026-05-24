// 🚀 BOT WARLOCK - CÓDIGO VISÍVEL EM TEXTO PURO
require('./keepalive');
const { create } = require('venom-bot');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');

// ⚙️ CONFIGURAÇÕES
const CONFIG = {
  dono: '5521991847707@c.us', // COLOQUE SEU NÚMERO
  prefixo: '!',
  versao: '5.0-COMPLETA',
  banco: path.join(__dirname, 'dados.json')
};

// 📁 BANCO DE DADOS
let banco = { admins: [], gold: [], grupos: {}, pontos: {}, palavras_proibidas: [], bloqueio_links: false };
if (fs.existsSync(CONFIG.banco)) banco = JSON.parse(fs.readFileSync(CONFIG.banco));
function salvarBanco() { fs.writeFileSync(CONFIG.banco, JSON.stringify(banco, null, 2)) }

// 🚀 INICIAR - AGORA VAI APARECER O CÓDIGO DE 8 DÍGITOS
create({
  session: 'bot-warlock-free',
  multidevice: true,
  logQR: false,
  disableSpins: true,
  useCode: true, // ✅ ATIVA O CÓDIGO DE TEXTO
  headless: "new"
})
.then(client => {

  // 📥 AQUI VAI APARECER O CÓDIGO CLARO E LIMPO
  client.on('code', (codigo) => {
    console.log('\n\n\n\n\n');
    console.log('==================================================');
    console.log('🔑 🔑 🔑 CÓDIGO DE CONEXÃO 🔑 🔑 🔑');
    console.log('==================================================');
    console.log(`📌 CÓDIGO: ${codigo}`); // <--- AQUI O CÓDIGO PURO
    console.log('==================================================');
    console.log('📖 COMO USAR NO SEU IPHONE:');
    console.log('1. WhatsApp > Aparelhos Conectados > Conectar aparelho');
    console.log('2. Quando abrir a câmera, olhe EMBAIXO: "Conectar com número ou código"');
    console.log('3. Digite o código que está escrito acima!');
    console.log('==================================================');
    console.log('\n\n\n');
  });

  // 🟢 QUANDO CONECTAR
  client.on('ready', () => {
    console.log('\n🟢🟢🟢 CONECTADO COM SUCESSO! BOT 100% FUNCIONANDO 🟢🟢🟢\n');
  });

  // ⚡ TODOS OS COMANDOS (COMPLETO PARA VENDER)
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
  setTimeout(() => process.exit(1), 5000);
});