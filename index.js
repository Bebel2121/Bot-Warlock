// 🚀 BOT WARLOCK - CÓDIGO FORÇADO NA TELA (SEM ESPERAR)
const { create } = require('venom-bot');
const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');

// ⚙️ SUAS CONFIGURAÇÕES - COLOQUE SEU NÚMERO AQUI!
const CONFIG = {
  dono: '5521999999999@c.us', // 🔴 COLOQUE SEU NÚMERO AQUI
  prefixo: '!',
  versao: '5.0-COMPLETA',
  banco: path.join(__dirname, 'dados.json')
};

// 📁 BANCO DE DADOS
let banco = { admins: [], gold: [], grupos: [], pontos: [], palavras_proibidas: [], bloqueio_links: false };
if (fs.existsSync(CONFIG.banco)) banco = JSON.parse(fs.readFileSync(CONFIG.banco));
function salvarBanco() { fs.writeFileSync(CONFIG.banco, JSON.stringify(banco, null, 2)) }

// 🌐 SERVIDOR
const app = express();
let CODIGO_ATUAL = '⏳ CARREGANDO... AGUARDE E ATUALIZE';

// 🚀 INICIAR - FORÇA CÓDIGO NA HORA
create({
  session: 'bot-warlock-vendas',
  multidevice: true,
  logQR: false,
  useCode: true, // ✅ GERA CÓDIGO DE TEXTO
  disableSpins: true,
  headless: "new",
  autoClose: 0,
  refreshQR: 1000, // ⚡ ATUALIZA MUITO RÁPIDO
  browserArgs: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu'
  ]
})
.then(client => {

  // 🔑 ASSIM QUE GERAR, COLOCA NA TELA NA HORA
  client.on('code', (codigo) => {
    CODIGO_ATUAL = `🔥 SEU CÓDIGO: ${codigo} 🔥`;
    console.log('Código gerado:', codigo);
  });

  // 🟢 CONECTOU
  client.on('ready', () => {
    CODIGO_ATUAL = '✅ CONECTADO! PRONTO PARA USAR!';
    console.log('🟢 BOT ONLINE');
  });

  // ⚡ TODOS OS COMANDOS
  client.onMessage(async (msg) => {
    if (!msg.isGroupMsg || !msg.body) return;

    const remetente = msg.author;
    const corpo = msg.body.toLowerCase().trim();
    const cmd = corpo.startsWith(CONFIG.prefixo) ? corpo.slice(1).split(' ')[0] : null;
    const args = corpo.split(' ').slice(1).join(' ');

    // 🧩 NIVEL
    function nivelUsuario() {
      if (remetente === CONFIG.dono) return 'dono';
      if (banco.admins.includes(remetente)) return 'admin';
      if (banco.gold.includes(remetente)) return 'vip';
      return 'membro';
    }
    const nivel = nivelUsuario();

    // 📋 MENU
    if (corpo === `${CONFIG.prefixo}menu`) {
      await client.sendText(msg.from, `🤖 *BOT WARLOCK PRO* 🤖\n✅ FUNCIONANDO!\n\n!menu, !musica, !piada, !banir`);
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
      } catch { await client.sendText(msg.from, '❌ Erro') }
    }

    // 🚫 BLOQUEIO DE LINKS
    if (banco.bloqueio_links && /https?:\/\//.test(corpo)) {
      await client.sendText(msg.from, `⚠️ @${remetente.split('@')[0]}, SEM LINKS! 🚫`);
      await client.deleteMessage(msg.from, msg.id);
    }
  });

})
.catch(erro => {
  CODIGO_ATUAL = `❌ ERRO: ${erro.message.slice(0,30)}`;
  setTimeout(() => process.exit(1), 2000);
});

// 🌐 PÁGINA COM CÓDIGO GRANDE
app.get('/', (req, res) => {
  res.send(`
    <html>
      <body style="background:#000; color:#0f0; font-family:Arial; padding:20px; text-align:center;">
        <h1>🔑 SEU CÓDIGO DE CONEXÃO 🔑</h1>
        <div style="font-size:40px; font-weight:bold; margin:30px auto; padding:25px; border:4px solid #0f0; max-width:500px; border-radius:10px;">
          ${CODIGO_ATUAL}
        </div>
        <p style="font-size:18px;">📱 WhatsApp → Aparelhos Conectados → Conectar → <b>Conectar com código</b></p>
        <p style="color:red; font-weight:bold;">⚠️ ATUALIZE A PÁGINA SEMPRE QUE MUDAR</p>
      </body>
    </html>
  `);
});

const PORTA = process.env.PORT || 3000;
app.listen(PORTA, () => console.log('✅ Servidor ativo'));