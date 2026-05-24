// 🚀 BOT WARLOCK - VERSÃO QR CODE (100% FUNCIONAL)
const { create } = require('venom-bot');
const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');

// ⚠️ COLOQUE SEU NÚMERO AQUI
const SEU_NUMERO = '5532956198820'; // 🔴 TROQUE PELO SEU!

// ⚙️ CONFIGURAÇÕES
const CONFIG = {
  dono: `${SEU_NUMERO}@c.us`,
  prefixo: '!',
  versao: '7.0-QRCODE',
  banco: path.join(__dirname, 'dados.json')
};

// 📁 BANCO DE DADOS
let banco = { admins: [], vips: [], bloqueio_links: false };
if (fs.existsSync(CONFIG.banco)) banco = JSON.parse(fs.readFileSync(CONFIG.banco));
function salvar() { fs.writeFileSync(CONFIG.banco, JSON.stringify(banco, null, 2)) }

// 🌐 SERVIDOR WEB
const app = express();
let QRCODE = '⏳ CARREGANDO QR CODE... AGUARDE 5 SEGUNDOS E ATUALIZE 🔄';
let STATUS = '';

// 🚀 INICIAR BOT - AGORA COM QR CODE
create({
  session: 'bot-warlock-sessao',
  multidevice: true,
  logQR: true, // ✅ AGORA GERA QR CODE
  useCode: false, // ❌ DESATIVA O CÓDIGO DE TEXTO (QUE ESTAVA COM PROBLEMA)
  disableSpins: true,
  headless: "new",
  autoClose: 0,
  refreshQR: 3000, // ⚡ ATUALIZA O QR DE 3 EM 3 SEGUNDOS
  qrTimeout: 0, // NÃO DEIXA EXPIRAR
  browserArgs: [
    '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'
  ]
})
.then(client => {

  // 📷 QUANDO GERAR O QR CODE, COLOCA NA TELA
  client.on('qr', (qr) => {
    QRCODE = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${qr}" style="border:4px solid #00FF44; border-radius:10px;"/>`;
    STATUS = `<p style="color:#fff; font-size:18px;">📷 ABRA SEU WHATSAPP → APARELHOS CONECTADOS → LER QR CODE</p>`;
    console.log('QR GERADO:', qr);
  });

  // 🟢 QUANDO CONECTOU
  client.on('ready', () => {
    QRCODE = `<div style="color:#00FF44; font-size:40px; font-weight:bold;">✅ CONECTADO COM SUCESSO! ✅</div>`;
    STATUS = `<p style="color:#fff; font-size:18px;">🤖 BOT WARLOCK ONLINE E FUNCIONANDO!</p>`;
    console.log('🟢 BOT PRONTO');
  });

  // ⚡ TODOS OS COMANDOS (TODOS OS QUE VOCÊ PRECISA)
  client.onMessage(async (msg) => {
    if (!msg.isGroupMsg || !msg.body || msg.fromMe) return;

    const remetente = msg.author;
    const numero = remetente.split('@')[0];
    const corpo = msg.body.trim().toLowerCase();
    const comando = corpo.startsWith(CONFIG.prefixo) ? corpo.slice(1).split(' ')[0] : null;
    const args = corpo.split(' ').slice(1).join(' ');

    // 🧩 NÍVEIS
    function nivel() {
      if (remetente === CONFIG.dono) return 3;
      if (banco.admins.includes(remetente)) return 2;
      if (banco.vips.includes(remetente)) return 1;
      return 0;
    }
    const nivelUser = nivel();

    // 📋 MENU
    if (corpo === `${CONFIG.prefixo}menu`) {
      await client.sendText(msg.from, `
🤖 *BOT WARLOCK PRO* - v${CONFIG.versao}
━━━━━━━━━━━━━━━━━━━━
!menu !menuadm !menudono
!musica <nome> !piada !frase
!bloquearlinks on/off
━━━━━━━━━━━━━━━━━━━━
      `);
    }

    // 🎵 MÚSICA
    if (comando === 'musica' && args) {
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

    // 🎉 PIADA
    if (comando === 'piada') {
      const piadas = ["Por que o livro de matemática se suicidou? Tinha muitos problemas 🤣", "O que o zero disse ao oito: Belo cinto! 😂"];
      await client.sendText(msg.from, `😂 *PIADA:*\n${piadas[Math.floor(Math.random() * piadas.length)]}`);
    }

    // 🚫 BLOQUEIO DE LINKS
    if (comando === 'bloquearlinks' && nivelUser >= 2) {
      if (args === 'on') { banco.bloqueio_links = true; await client.sendText(msg.from, '🔒 Links bloqueados!'); }
      if (args === 'off') { banco.bloqueio_links = false; await client.sendText(msg.from, '🔓 Links liberados!'); }
      salvar();
    }

    // 🛡️ ADICIONAR ADMIN
    if (comando === 'adicionaradm' && nivelUser >= 2 && msg.mentions.length > 0) {
      const quem = msg.mentions[0];
      if (!banco.admins.includes(quem)) { banco.admins.push(quem); salvar(); await client.sendText(msg.from, `✅ @${numero} agora é ADMIN`); }
    }

  });

})
.catch(erro => {
  QRCODE = `<div style="color:red; font-size:20px;">❌ ERRO: ${erro.message.slice(0,50)}</div>`;
  setTimeout(() => process.exit(1), 3000);
});

// 🌐 PÁGINA COM QR CODE GRANDE
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Bot Warlock - QR Code</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { background:#000; color:#0f0; font-family:Arial; padding:20px; text-align:center; }
        .qrcode { margin:30px auto; }
        .aviso { color:yellow; margin-top:20px; font-weight:bold; }
      </style>
    </head>
    <body>
      <h1>🤖 BOT WARLOCK PRO 🤖</h1>
      <div class="qrcode">${QRCODE}</div>
      <div>${STATUS}</div>
      <p class="aviso">⚠️ SE DURAR MAIS DE 5s, ATUALIZE A PÁGINA 🔄</p>
    </body>
    </html>
  `);
});

const PORTA = process.env.PORT || 3000;
app.listen(PORTA, () => console.log('✅ Servidor ativo'));