// 🚀 BOT WARLOCK - VERSÃO DEFINITIVA | CÓDIGO NA TELA GARANTIDO
const { create } = require('venom-bot');
const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');

// ⚠️ COLOQUE SEU NÚMERO AQUI (COM DDD, EXATO ASSIM: 5521988887777)
const SEU_NUMERO = '5532956198820'; // 🔴 TROQUE AQUI PELO SEU!

// ⚙️ CONFIGURAÇÕES GERAIS
const CONFIG = {
  dono: `${SEU_NUMERO}@c.us`,
  prefixo: '!',
  versao: '6.0-DEFINITIVA',
  banco: path.join(__dirname, 'dados.json')
};

// 📁 SISTEMA DE BANCO DE DADOS
let banco = {
  admins: [], vips: [], grupos: {}, pontos: {},
  palavras_proibidas: [], bloqueio_links: false, anti_flood: false
};
if (fs.existsSync(CONFIG.banco)) {
  try { banco = JSON.parse(fs.readFileSync(CONFIG.banco)); }
  catch (e) { console.log('Banco novo criado'); }
}
function salvar() { fs.writeFileSync(CONFIG.banco, JSON.stringify(banco, null, 2)); }

// 🌐 SERVIDOR WEB (AQUI MOSTRA O CÓDIGO)
const app = express();
let STATUS = '⏳ INICIANDO... AGUARDE 10 SEGUNDOS E ATUALIZE';

// 🚀 INICIALIZAÇÃO DO BOT - CONFIGURAÇÃO OTIMIZADA PARA RENDER
create({
  session: 'bot-warlock-sessao-oficial',
  multidevice: true,
  logQR: false,
  useCode: true, // ✅ FORÇA CÓDIGO DE TEXTO
  disableSpins: true,
  headless: "new",
  autoClose: 0,
  qrTimeout: 0,
  refreshQR: 2000,
  browserArgs: [
    '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage',
    '--disable-gpu', '--no-first-run', '--no-zygote'
  ]
})
.then(client => {

  // 🔑 QUANDO O CÓDIGO FOR GERADO, APARECE NA TELA
  client.on('code', (codigo) => {
    STATUS = `
    <div style="background:#000; padding:30px; border-radius:15px; border:3px solid #00FF44;">
      <h2>🔥 SEU CÓDIGO DE CONEXÃO 🔥</h2>
      <div style="font-size:42px; font-weight:bold; color:#00FF44; margin:20px 0; letter-spacing:5px;">
        ${codigo}
      </div>
      <p style="font-size:16px; color:#fff;">📱 ABRA SEU WHATSAPP ➜ APARELHOS CONECTADOS ➜ CONECTAR ➜ USAR CÓDIGO</p>
    </div>
    `;
    console.log('Código gerado:', codigo);
  });

  // 🟢 QUANDO TIVER CONECTADO COM SUCESSO
  client.on('ready', () => {
    STATUS = `
    <div style="background:#000; padding:30px; border-radius:15px; border:3px solid #00FF44;">
      <h1 style="color:#00FF44;">✅ BOT CONECTADO E ONLINE! ✅</h1>
      <p style="color:#fff; font-size:18px;">Tudo pronto! Agora é só usar os comandos nos grupos.</p>
    </div>
    `;
    console.log('🟢 BOT WARLOCK 100% FUNCIONANDO');
  });

  // ⚡ RECEBIMENTO DE MENSAGENS E COMANDOS
  client.onMessage(async (msg) => {
    if (!msg.isGroupMsg || !msg.body || msg.fromMe) return;

    const remetente = msg.author;
    const numero = remetente.split('@')[0];
    const corpo = msg.body.trim().toLowerCase();
    const comando = corpo.startsWith(CONFIG.prefixo) ? corpo.slice(1).split(' ')[0] : null;
    const args = corpo.split(' ').slice(1).join(' ');

    // 🧩 VERIFICA NÍVEL DE USUÁRIO
    function nivel() {
      if (remetente === CONFIG.dono) return 3; // DONO
      if (banco.admins.includes(remetente)) return 2; // ADMIN
      if (banco.vips.includes(remetente)) return 1; // VIP
      return 0; // MEMBRO
    }
    const nivelUser = nivel();

    // 📋 MENU PRINCIPAL
    if (corpo === `${CONFIG.prefixo}menu`) {
      await client.sendText(msg.from, `
🤖 *BOT WARLOCK PRO* - v${CONFIG.versao}
━━━━━━━━━━━━━━━━━━━━
👑 *ADMINISTRAÇÃO*
!banir !desbanir !aviso !limpar
🎵 *MÍDIA E DOWNLOADS*
!musica <nome/link> !video <nome/link> !foto <nome>
🎉 *DIVERSÃO E UTILIDADES*
!piada !frase !calcular !pesquisar !perfil
⚙️ *CONFIGURAÇÕES*
!bloquearlinks !palavra !antiflood
━━━━━━━━━━━━━━━━━━━━
Digite !menuadm para funções de administrador
      `);
    }

    // 🛡️ MENU ADMIN
    if (comando === 'menuadm' && nivelUser >= 2) {
      await client.sendText(msg.from, `
🛡️ *PAINEL DE ADMINISTRAÇÃO*
━━━━━━━━━━━━━━━━━━━━
!adicionaradm @pessoa
!removeradm @pessoa
!listaradms

!bloquearlinks on / off
!adicionarpalavra <palavra>
!removerpalavra <palavra>
!antiflood on / off
━━━━━━━━━━━━━━━━━━━━
      `);
    }

    // 👑 MENU DONO
    if (comando === 'menudono' && nivelUser === 3) {
      await client.sendText(msg.from, `
👑 *PAINEL DO DONO*
━━━━━━━━━━━━━━━━━━━━
!adicionarvip @pessoa
!removervip @pessoa
!listarvips
!reiniciar
!parar
━━━━━━━━━━━━━━━━━━━━
      `);
    }

    // 🚫 SISTEMA DE BLOQUEIO DE LINKS
    if (banco.bloqueio_links && /https?:\/\/|wa.me|www\./.test(corpo) && nivelUser === 0) {
      await client.sendText(msg.from, `⚠️ @${numero}, LINKS SÃO PROIBIDOS NO GRUPO! 🚫`);
      await client.deleteMessage(msg.from, msg.id);
      return;
    }

    // 🎵 BAIXAR MÚSICA (YOUTUBE)
    if (comando === 'musica' && args) {
      try {
        await client.sendText(msg.from, '🔎 Buscando áudio... aguarde ⏳');
        const busca = args.includes('http') ? args : `ytsearch:${args}`;
        const info = await ytdl.getInfo(busca);
        const caminho = path.join(__dirname, `audio_${Date.now()}.mp3`);

        await new Promise((res, rej) => {
          ffmpeg(ytdl(info.videoDetails.video_url, { quality: 'highestaudio' }))
            .audioBitrate(128)
            .save(caminho)
            .on('end', res)
            .on('error', rej);
        });

        await client.sendFile(msg.from, caminho, '', `🎵 *${info.videoDetails.title}*`);
        fs.unlinkSync(caminho);
      } catch (e) {
        await client.sendText(msg.from, '❌ Erro ao baixar. Tente outro nome ou link.');
      }
    }

    // 🎉 PIADA ALEATÓRIA
    if (comando === 'piada') {
      const piadas = [
        "Por que o livro de matemática se suicidou? Porque tinha muitos problemas 🤣",
        "O que o zero disse para o oito? — Bonito cinto! 😂",
        "Qual é o cúmulo da velocidade? Correr atrás do prejuízo! 🚀",
        "Por que o jacaré é grande, verde e achatado? Porque se ele fosse pequeno, vermelho e redondo era um tomate! 🍅"
      ];
      const escolhida = piadas[Math.floor(Math.random() * piadas.length)];
      await client.sendText(msg.from, `😂 *PIADA:*\n${escolhida}`);
    }

    // 💬 FRASE ALEATÓRIA
    if (comando === 'frase') {
      const frases = [
        "A persistência é o caminho do êxito. ✨",
        "Só é lutador quem sabe lutar consigo mesmo. 💪",
        "O sucesso é a soma de pequenos esforços repetidos dia após dia. 🌟",
        "Acredite em si mesmo e tudo será possível. 🚀"
      ];
      const escolhida = frases[Math.floor(Math.random() * frases.length)];
      await client.sendText(msg.from, `💬 *FRASE:*\n${escolhida}`);
    }

    // 🛡️ ADICIONAR ADMIN
    if (comando === 'adicionaradm' && nivelUser >= 2 && msg.mentions.length > 0) {
      const quem = msg.mentions[0];
      if (!banco.admins.includes(quem)) {
        banco.admins.push(quem);
        salvar();
        await client.sendText(msg.from, `✅ @${quem.split('@')[0]} agora é ADMIN!`);
      }
    }

    // 🗑️ REMOVER ADMIN
    if (comando === 'removeradm' && nivelUser >= 2 && msg.mentions.length > 0) {
      const quem = msg.mentions[0];
      banco.admins = banco.admins.filter(a => a !== quem);
      salvar();
      await client.sendText(msg.from, `❌ @${quem.split('@')[0]} não é mais admin.`);
    }

    // 🔗 ATIVAR/DESATIVAR BLOQUEIO DE LINKS
    if (comando === 'bloquearlinks' && nivelUser >= 2) {
      if (args === 'on') { banco.bloqueio_links = true; await client.sendText(msg.from, '🔒 Bloqueio de links ATIVADO!'); }
      if (args === 'off') { banco.bloqueio_links = false; await client.sendText(msg.from, '🔓 Bloqueio de links DESATIVADO!'); }
      salvar();
    }

  });

})
.catch(erro => {
  STATUS = `
  <div style="background:#ff0000; padding:30px; border-radius:15px; color:white;">
    <h2>❌ ERRO AO INICIAR</h2>
    <p>${erro.message.slice(0, 100)}</p>
    <p>🔄 ATUALIZE A PÁGINA EM 10 SEGUNDOS</p>
  </div>
  `;
  setTimeout(() => process.exit(1), 5000);
});

// 🌐 PÁGINA PRINCIPAL - ONDE VOCÊ VÊ O CÓDIGO
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Bot Warlock - Conexão</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin:0; padding:0; box-sizing:border-box; font-family: Arial, sans-serif; }
        body { background-color: #0a0a0a; color: #ffffff; padding: 20px; text-align: center; }
        .container { max-width: 600px; margin: 0 auto; }
        h1 { color: #00FF44; margin: 30px 0; font-size: 28px; }
        .status { margin: 20px 0; }
        .instrucoes { margin-top: 40px; text-align: left; background: #111; padding:20px; border-radius:10px; border:1px solid #333; }
        .instrucoes h3 { color:#00FF44; margin-bottom:10px; }
        .aviso { color: #FFCC00; margin-top:20px; font-weight:bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🤖 BOT WARLOCK PRO 🤖</h1>
        <div class="status">${STATUS}</div>

        <div class="instrucoes">
          <h3>📝 COMO CONECTAR:</h3>
          <p>1️⃣ Abra o WhatsApp no seu celular</p>
          <p>2️⃣ Vá em <b>Aparelhos Conectados</b> ➜ <b>Conectar aparelho</b></p>
          <p>3️⃣ Quando abrir a câmera, <b>olhe BEM EMBAIXO</b> e clique em: <i>"Conectar com código"</i></p>
          <p>4️⃣ Digite o código que está escrito em VERDE acima</p>
        </div>

        <p class="aviso">⚠️ SEMPRE ATUALIZE A PÁGINA SE O CÓDIGO NÃO APARECER NA HORA 🔄</p>
      </div>
    </body>
    </html>
  `);
});

// 🚀 INICIAR SERVIDOR
const PORTA = process.env.PORT || 3000;
app.listen(PORTA, () => console.log(`✅ Servidor rodando na porta ${PORTA}`));