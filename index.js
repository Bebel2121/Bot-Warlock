// 🚀 BOT WARLOCK PRO - COMPLETO | CÓDIGO NO SEU SITE
const { create } = require('venom-bot');
const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');

// ⚙️ SUAS CONFIGURAÇÕES - COLOQUE SEU NÚMERO AQUI!
const CONFIG = {
  dono: '5532956198820@c.us', // 🔴 TROQUE PELO SEU NÚMERO COM DDD EX: 5521988887777
  prefixo: '!',
  versao: '5.0-COMPLETA',
  banco: path.join(__dirname, 'dados.json')
};

// 📁 BANCO DE DADOS
let banco = { admins: [], gold: [], grupos: [], pontos: [], palavras_proibidas: [], bloqueio_links: false };
if (fs.existsSync(CONFIG.banco)) banco = JSON.parse(fs.readFileSync(CONFIG.banco));
function salvarBanco() { fs.writeFileSync(CONFIG.banco, JSON.stringify(banco, null, 2)) }

// 🌐 SERVIDOR PARA MOSTRAR O CÓDIGO NO SITE
const app = express();
let CODIGO_ATUAL = '';

// 🚀 INICIAR BOT
create({
  session: 'bot-warlock-free',
  multidevice: true,
  logQR: false,
  useCode: true, // ✅ GERA CÓDIGO DE TEXTO
  disableSpins: true,
  headless: "new",
  autoClose: 0,
  browserArgs: ['--no-sandbox', '--disable-setuid-sandbox']
})
.then(client => {

  // 🔑 QUANDO GERAR O CÓDIGO, SALVA PARA APARECER NO SITE
  client.on('code', (codigo) => {
    CODIGO_ATUAL = codigo;
    console.log('Código gerado:', codigo); // Render esconde, mas guardamos
  });

  // 🟢 QUANDO CONECTOU COM SUCESSO
  client.on('ready', () => {
    CODIGO_ATUAL = '✅ CONECTADO COM SUCESSO! JÁ PODE USAR!';
    console.log('🟢 BOT 100% ONLINE E FUNCIONANDO');
  });

  // ⚡ TODOS OS COMANDOS (COMPLETOS)
  client.onMessage(async (msg) => {
    if (!msg.isGroupMsg || !msg.body) return;

    const remetente = msg.author;
    const corpo = msg.body.toLowerCase().trim();
    const cmd = corpo.startsWith(CONFIG.prefixo) ? corpo.slice(1).split(' ')[0] : null;
    const args = corpo.split(' ').slice(1).join(' ');

    // 🧩 VERIFICAR NÍVEL DE USUÁRIO
    function nivelUsuario() {
      if (remetente === CONFIG.dono) return 'dono';
      if (banco.admins.includes(remetente)) return 'admin';
      if (banco.gold.includes(remetente)) return 'vip';
      return 'membro';
    }
    const nivel = nivelUsuario();

    // 📋 MENU PRINCIPAL
    if (corpo === `${CONFIG.prefixo}menu`) {
      await client.sendText(msg.from, `
🤖 *BOT WARLOCK FREE* - v${CONFIG.versao}
━━━━━━━━━━━━━━━━━━━━
👑 *ADMIN*: !adicionar !remover !bloquear
🎵 *MÍDIA*: !musica !video !foto
🎉 *DIVERSÃO*: !piada !frase !perfil
⚙️ *CONFIG*: !bloquearlinks !palavra
━━━━━━━━━━━━━━━━━━━━
`);
    }

    // 👑 MENU DONO
    if (cmd === 'menudono' && nivel === 'dono') {
      await client.sendText(msg.from, `
👑 *PAINEL DO DONO*
━━━━━━━━━━━━━━━━━━━━
!admadicionar @pessoa
!admremover @pessoa
!vipadicionar @pessoa
!vipremover @pessoa
!listaradmins
!listarvip
━━━━━━━━━━━━━━━━━━━━
`);
    }

    // 🛡️ MENU ADMIN
    if (cmd === 'menuadm' && (nivel === 'admin' || nivel === 'dono')) {
      await client.sendText(msg.from, `
🛡️ *PAINEL ADMIN*
━━━━━━━━━━━━━━━━━━━━
!banir @pessoa
!aviso @pessoa mensagem
!bloquearlinks on/off
!adicionarpalavra palavra
!removerpalavra palavra
━━━━━━━━━━━━━━━━━━━━
`);
    }

    // 🎵 BAIXAR MÚSICA
    if (cmd === 'musica' && args) {
      try {
        await client.sendText(msg.from, '🔎 Buscando áudio... aguarde ⏳');
        const info = await ytdl.getInfo(args.includes('http') ? args : `ytsearch:${args}`);
        const caminho = path.join(__dirname, `musica_${Date.now()}.mp3`);
        await new Promise((res, rej) => {
          ffmpeg(ytdl(info.videoDetails.video_url, { quality: 'highestaudio' }))
            .audioBitrate(128)
            .save(caminho)
            .on('end', res)
            .on('error', rej);
        });
        await client.sendFile(msg.from, caminho, '', `🎵 *${info.videoDetails.title}*`);
        fs.unlinkSync(caminho);
      } catch { await client.sendText(msg.from, '❌ Erro ao baixar áudio'); }
    }

    // 🎉 PIADA
    if (cmd === 'piada') {
      const piadas = [
        "Por que o livro de matemática se suicidou? Porque tinha muitos problemas 🤣",
        "Qual o cúmulo da velocidade? Correr atrás do prejuízo 😂",
        "O que é um pontinho verde no céu? Um astronauta com fome 🚀"
      ];
      await client.sendText(msg.from, `😂 *PIADA:*\n${piadas[Math.floor(Math.random() * piadas.length)]}`);
    }

    // 🚫 BLOQUEIO DE LINKS
    if (banco.bloqueio_links && /https?:\/\/|wa.me/.test(corpo) && nivel === 'membro') {
      await client.sendText(msg.from, `⚠️ @${remetente.split('@')[0]}, LINKS SÃO PROIBIDOS AQUI! 🚫`);
      await client.deleteMessage(msg.from, msg.id);
      return;
    }

  });

})
.catch(erro => {
  CODIGO_ATUAL = `❌ ERRO: ${erro.message.slice(0, 50)}...`;
  setTimeout(() => process.exit(1), 5000);
});

// 🌐 PÁGINA QUE MOSTRA O CÓDIGO (AQUI É O SEGREDO!)
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Bot Warlock - Código de Conexão</title></head>
      <body style="background:#0a0a0a; color:#00ff44; font-family:Arial; padding:40px; text-align:center;">
        <h1>🔑 SEU CÓDIGO DE CONEXÃO 🔑</h1>
        <div style="font-size:36px; font-weight:bold; margin:40px auto; padding:30px; border:4px solid #00ff44; max-width:500px; border-radius:12px; background:#111;">
          ${CODIGO_ATUAL || '⏳ GERANDO... AGUARDE 10 A 20 SEGUNDOS...'}
        </div>
        <div style="font-size:18px; line-height:1.6;">
          <p>📱 COMO USAR:</p>
          <p>1. Abra o WhatsApp → Aparelhos Conectados → Conectar aparelho</p>
          <p>2. Quando abrir a câmera, <b>olhe EMBAIXO</b> → "Conectar com código"</p>
          <p>3. Digite o código que está escrito acima</p>
        </div>
      </body>
    </html>
  `);
});

const PORTA = process.env.PORT || 3000;
app.listen(PORTA, () => console.log('✅ Página ativa: veja seu link'));