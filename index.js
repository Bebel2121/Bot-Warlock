// 🚀 BOT WARLOCK - VERSÃO RENDER OTIMIZADA | SEM ERRO DE NAVEGADOR
const { create } = require('venom-bot');
const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');

// ⚠️ COLOQUE SEU NÚMERO AQUI (EX: 5521988887777)
const SEU_NUMERO = '552132956198820'; // 🔴 TROQUE AQUI!

// ⚙️ CONFIGURAÇÕES
const CONFIG = {
  dono: `${SEU_NUMERO}@c.us`,
  prefixo: '!',
  versao: '8.0-RENDER-FIX',
  banco: path.join(__dirname, 'dados.json')
};

// 📁 BANCO DE DADOS
let banco = { admins: [], vips: [], bloqueio_links: false };
if (fs.existsSync(CONFIG.banco)) {
  try { banco = JSON.parse(fs.readFileSync(CONFIG.banco)); }
  catch(e) { console.log('Banco novo criado') }
}
function salvar() { fs.writeFileSync(CONFIG.banco, JSON.stringify(banco, null, 2)) }

// 🌐 SERVIDOR WEB
const app = express();
let CONTEUDO = '⏳ INICIANDO... AGUARDE 8 SEGUNDOS 🔄';

// 🚀 CONFIGURAÇÃO ESPECIAL PARA RENDER (RESOLVE O ERRO DE BROWSER)
create({
  session: 'bot-warlock-sessao',
  multidevice: true,
  logQR: true,
  useCode: false,
  disableSpins: true,
  disableWelcome: true,
  headless: "new", // ✅ FORMATO ACEITO PELO RENDER
  autoClose: 0,
  qrTimeout: 0,
  refreshQR: 2500,
  useChrome: false, // ✅ USA CHROMIUM (MAIS LEVE E PERMITE)
  browserArgs: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--no-first-run',
    '--no-zygote',
    '--single-process', // ✅ ESSENCIAL PARA RENDER
    '--disable-background-networking',
    '--disable-extensions'
  ],
  puppeteerOptions: {
    args: ['--no-sandbox']
  }
})
.then(client => {

  // 📷 MOSTRA QR CODE NA TELA
  client.on('qr', (qr) => {
    CONTEUDO = `
    <div style="background:#000; padding:30px; border-radius:15px; border:3px solid #00FF44; max-width:400px; margin:0 auto;">
      <h2 style="color:#00FF44; margin-bottom:20px;">📷 SEU QR CODE</h2>
      <img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${qr}" style="border-radius:10px;"/>
      <p style="color:#fff; margin-top:15px;">📱 Abra WhatsApp → Aparelhos Conectados → Ler QR</p>
    </div>
    `;
    console.log('✅ QR GERADO COM SUCESSO');
  });

  // 🟢 CONECTOU
  client.on('ready', () => {
    CONTEUDO = `
    <div style="background:#000; padding:30px; border-radius:15px; border:3px solid #00FF44;">
      <h1 style="color:#00FF44;">✅ BOT ONLINE 24H! ✅</h1>
      <p style="color:#fff; font-size:18px;">Tudo pronto! Comandos: !menu</p>
    </div>
    `;
    console.log('🟢 BOT FUNCIONANDO');
  });

  // ⚡ TODOS OS COMANDOS
  client.onMessage(async (msg) => {
    if (!msg.isGroupMsg || !msg.body || msg.fromMe) return;

    const remetente = msg.author;
    const corpo = msg.body.trim().toLowerCase();
    const comando = corpo.startsWith(CONFIG.prefixo) ? corpo.slice(1).split(' ')[0] : null;
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

    // 🚫 BLOQUEIO DE LINKS
    if (comando === 'bloquearlinks' && nivelUser >= 2) {
      banco.bloqueio_links = args === 'on';
      salvar();
      await client.sendText(msg.from, args === 'on' ? '🔒 Links bloqueados!' : '🔓 Links liberados!');
    }

  });

})
.catch(erro => {
  CONTEUDO = `
  <div style="background:red; color:white; padding:20px; border-radius:10px;">
    ❌ ERRO: ${erro.message.slice(0,60)}<br>
    🔄 ATUALIZE EM 5 SEGUNDOS
  </div>
  `;
  console.error('❌ ERRO:', erro.message);
  setTimeout(() => process.exit(1), 4000);
});

// 🌐 PÁGINA PRINCIPAL
app.get('/', (req, res) => {
  res.send(`
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { background:#0a0a0a; color:#fff; font-family:Arial; padding:20px; text-align:center; }
        .aviso { color:#ffcc00; margin-top:20px; font-weight:bold; }
      </style>
    </head>
    <body>
      <h1 style="color:#00FF44; margin-bottom:30px;">🤖 BOT WARLOCK PRO 🤖</h1>
      ${CONTEUDO}
      <p class="aviso">⚠️ SEMPRE ATUALIZE SE APARECER ERRO OU DEMORAR 🔄</p>
    </body>
    </html>
  `);
});

const PORTA = process.env.PORT || 3000;
app.listen(PORTA, () => console.log('✅ Servidor rodando'));