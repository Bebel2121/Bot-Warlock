// 🚀 BOT WARLOCK - VERSÃO 100% PARA RENDER
const { create } = require('venom-bot');
const express = require('express');
const fs = require('fs');
const path = require('path');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');

// ⚠️ COLOQUE SEU NÚMERO AQUI!
const SEU_NUMERO = '5532956198820'; // 🔴 TROQUE PELO SEU!

// ⚙️ CONFIGS
const CONFIG = {
  dono: `${SEU_NUMERO}@c.us`,
  prefixo: '!',
  versao: '8.0-OK',
  banco: path.join(__dirname, 'dados.json')
};

// 📁 BANCO
let banco = { admins: [], vips: [], bloqueio_links: false };
if (fs.existsSync(CONFIG.banco)) try { banco = JSON.parse(fs.readFileSync(CONFIG.banco)) } catch (e) {}
function salvar() { fs.writeFileSync(CONFIG.banco, JSON.stringify(banco, null, 2)) }

// 🌐 SERVIDOR
const app = express();
let CONTEUDO = '⏳ INICIANDO... AGUARDE 10s E ATUALIZE 🔄';

// 🚀 INICIO CONFIGURADO PARA RENDER
create({
  session: 'bot-warlock-sessao',
  multidevice: true,
  logQR: true,
  useCode: false,
  disableSpins: true,
  disableWelcome: true,
  headless: "new",
  autoClose: 0,
  qrTimeout: 0,
  refreshQR: 2500,
  useChrome: false,
  browserArgs: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--single-process'
  ]
})
.then(client => {

  // 📷 MOSTRA QR NA TELA
  client.on('qr', qr => {
    CONTEUDO = `
    <div style="background:#000; padding:30px; border-radius:15px; border:3px solid #0F0; max-width:400px; margin:auto;">
      <h2 style="color:#0F0;">📷 SEU QR CODE</h2>
      <img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${qr}" style="border-radius:10px;"/>
      <p style="color:#FFF; margin-top:10px;">📱 WhatsApp → Aparelhos Conectados → Ler QR</p>
    </div>
    `;
  });

  // 🟢 CONECTOU
  client.on('ready', () => {
    CONTEUDO = `
    <div style="background:#000; padding:30px; border-radius:15px; border:3px solid #0F0;">
      <h1 style="color:#0F0;">✅ BOT ONLINE 24H!</h1>
      <p style="color:#FFF;">Pronto! Use !menu nos grupos.</p>
    </div>
    `;
  });

  // ⚡ COMANDOS
  client.onMessage(async msg => {
    if (!msg.isGroupMsg || !msg.body || msg.fromMe) return;

    const remetente = msg.author;
    const corpo = msg.body.trim().toLowerCase();
    const cmd = corpo.startsWith(CONFIG.prefixo) ? corpo.slice(1).split(' ')[0] : null;
    const args = corpo.split(' ').slice(1).join(' ');

    function nivel() {
      if (remetente === CONFIG.dono) return 3;
      if (banco.admins.includes(remetente)) return 2;
      return 0;
    }
    const nivelUser = nivel();

    // 📋 MENU
    if (corpo === `${CONFIG.prefixo}menu`) {
      await client.sendText(msg.from, `
🤖 *BOT WARLOCK PRO*
━━━━━━━━━━━━━━━━
!menu !musica !piada
!bloquearlinks on/off
!adicionaradm @pessoa
━━━━━━━━━━━━━━━━
      `);
    }

    // 🎵 MÚSICA
    if (cmd === 'musica' && args) {
      try {
        await client.sendText(msg.from, '🔎 Buscando...');
        const info = await ytdl.getInfo(`ytsearch:${args}`);
        const caminho = path.join(__dirname, `musica_${Date.now()}.mp3`);
        await new Promise((res, rej) => {
          ffmpeg(ytdl(info.videoDetails.video_url, { quality: 'highestaudio' }))
            .audioBitrate(128).save(caminho).on('end', res);
        });
        await client.sendFile(msg.from, caminho, '', `🎵 *${info.videoDetails.title}*`);
        fs.unlinkSync(caminho);
      } catch { await client.sendText(msg.from, '❌ Erro ao baixar') }
    }

    // 🚫 BLOQUEIO DE LINKS
    if (cmd === 'bloquearlinks' && nivelUser >= 2) {
      banco.bloqueio_links = args === 'on';
      salvar();
      await client.sendText(msg.from, args === 'on' ? '🔒 Links bloqueados!' : '🔓 Links liberados!');
    }

    // 🛡️ ADICIONAR ADMIN
    if (cmd === 'adicionaradm' && nivelUser >= 2 && msg.mentions.length > 0) {
      const quem = msg.mentions[0];
      if (!banco.admins.includes(quem)) { banco.admins.push(quem); salvar(); await client.sendText(msg.from, `✅ @${quem.split('@')[0]} agora é ADMIN`); }
    }

  });

})
.catch(erro => {
  CONTEUDO = `<div style="background:red; color:white; padding:20px;">❌ ERRO: ${erro.message.slice(0,50)}<br>🔄 ATUALIZE</div>`;
  setTimeout(() => process.exit(1), 4000);
});

// 🌐 PÁGINA
app.get('/', (req, res) => {
  res.send(`
    <html>
    <head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="background:#000; color:#fff; font-family:Arial; padding:20px; text-align:center;">
      <h1 style="color:#0F0; margin-bottom:30px;">🤖 BOT WARLOCK PRO 🤖</h1>
      ${CONTEUDO}
      <p style="color:#FF0; margin-top:20px; font-weight:bold;">⚠️ ATUALIZE SEMPRE QUE MUDAR 🔄</p>
    </body>
    </html>
  `);
});

const PORTA = process.env.PORT || 3000;
app.listen(PORTA, () => console.log('✅ Servidor rodando'));