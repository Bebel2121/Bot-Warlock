const manterLigado = require('./keepalive');
const { create } = require('@wppconnect-team/wppconnect');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');

// 🔒 LICENÇA - COLOQUE OS DADOS AQUI
const LICENCA = {
  chave: 'PRO-157252-681284-36',
  dono_autorizado: '5521991847707c.us', // SEU NÚMERO AQUI
  valido_ate: '2030-05-24',
  versao: '3.0-PRO'
};

// ✅ VERIFICAÇÃO DE LICENÇA
const hoje = new Date().toISOString().split('T')[0];
if (LICENCA.chave !== 'PRO-157252-681284-36' || LICENCA.dono_autorizado === '5521991847707@c.us' || hoje > LICENCA.valido_ate) {
  console.log('❌ LICENÇA INVÁLIDA OU EXPIRADA!');
  process.exit(1);
}

// ⚙️ CONFIGURAÇÕES
const CONFIG = {
  dono: LICENCA.dono_autorizado,
  prefixo: '!',
  banco: path.join(__dirname, 'dados.json'),
  versao: LICENCA.versao
};

// 📁 BANCO DE DADOS
let banco = { admins: [], gold: [], grupos: {}, pontos: {}, palavras_proibidas: [], bloqueio_links: false };
if (fs.existsSync(CONFIG.banco)) banco = JSON.parse(fs.readFileSync(CONFIG.banco));
function salvarBanco() { fs.writeFileSync(CONFIG.banco, JSON.stringify(banco, null, 2)) }

// 🚀 INICIAR BOT
create({
  session: 'bot-warlock-pro',
  catchAll: true,
  deviceName: 'Bot Warlock PRO',
  logQR: true, // MOSTRA QR CODE NO LOG
  useChrome: true
})
.then(client => {
  console.log('✅ BOT LIGADO COM SUCESSO! 🤖');
  console.log('📷 AGORA É SÓ LER O QR CODE QUE VAI APARECER LOGO ABAIXO ⬇️');

  // ⚡ RECEBER MENSAGENS
  client.onMessage(async (msg) => {
    if (!msg.isGroupMsg || !msg.body) return;
    const grupo = await msg.getChat();
    const remetente = msg.author;
    const corpo = msg.body.toLowerCase().trim();
    const cmd = corpo.startsWith(CONFIG.prefixo) ? corpo.slice(1).split(' ')[0] : null;
    const args = corpo.split(' ').slice(1).join(' ');

    // 🧩 VERIFICAR NÍVEL
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
!grupo fechar/abrir
`);
    }

    if (cmd === 'menugold' && (nivel === 'gold' || nivel === 'admin' || nivel === 'dono')) {
      await client.sendText(msg.from, `
⭐ *MENU GOLD*
━━━━━━━━━━━━━━━━━━
!musica nome
!pesquisa termo
!clima cidade
!figurinha (mande imagem)
!traduz pt/en texto
`);
    }

    // 🎵 COMANDO MÚSICA
    if (cmd === 'musica' && (nivel === 'gold' || nivel === 'admin' || nivel === 'dono')) {
      if (!args) return await client.sendText(msg.from, '❌ Digite: !musica nome da música');
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
      } catch (e) { await client.sendText(msg.from, '❌ Erro ao baixar. Tente outro nome.'); }
    }

    // 🎉 COMANDO PIADA
    if (cmd === 'piada') {
      const piadas = ["Por que o livro de matemática está triste? Porque tem muitos problemas 🤣", "O que o zero disse pro oito: Bonito cinto! 😂"];
      await client.sendText(msg.from, `😂 *PIADA:*\n${piadas[Math.floor(Math.random() * piadas.length)]}`);
    }

    // 🛡️ COMANDOS ADM
    if (cmd === 'banir' && (nivel === 'admin' || nivel === 'dono')) {
      const mencionado = msg.mentionedJidList[0];
      if (!mencionado) return await client.sendText(msg.from, '❌ Marque: !banir @usuario');
      await grupo.removeParticipant(mencionado);
      await client.sendText(msg.from, `✅ @${mencionado.split('@')[0]} removido! ⛔`);
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
      await client.sendText(msg.from, `✅ @${mencionado.split('@')[0]} agora é GOLD ⭐`);
    }

    // 🚫 BLOQUEIO DE LINKS
    if (banco.bloqueio_links && /https?:\/\/|wa.me|chat.whatsapp.com/.test(corpo)) {
      await client.sendText(msg.from, `⚠️ @${remetente.split('@')[0]}, LINKS SÃO PROIBIDOS! 🚫`);
      await msg.delete(true);
    }

    // RESPOSTA PADRÃO
    if (!cmd && corpo !== 'menu') {
      if (Math.random() < 0.2) await client.sendText(msg.from, '👋 Digite *!menu* para ver tudo o que eu faço!');
    }

  });

})
.catch(erro => {
  console.error('❌ ERRO NO BOT:', erro);
  process.exit(1);
});