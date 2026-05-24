// 🚀 BOT WARLOCK - QR CODE GARANTIDO
require('./keepalive');
const { create } = require('venom-bot');
const qrcode = require('qrcode-terminal');

// ⚙️ CONFIGURAÇÕES
const CONFIG = {
  dono: '5521991847707@c.us', // COLOQUE SEU NÚMERO
  prefixo: '!',
  versao: '5.0'
};

// 🚀 INICIO - VAI MOSTRAR O QR CODE CLARO
create({
  session: 'bot-vendas',
  multidevice: true,
  logQR: false, // DESATIVA O OCULTO
  disableSpins: true
})
.then(client => {
  console.log('\n\n✅✅✅ BOT LIGADO! AGORA É SÓ LER O QR CODE ABAIXO ⬇️⬇️⬇️\n');

  // 📷 MOSTRA O QR CODE DE FORÇA, BEM GRANDE
  client.on('qr', qr => {
    console.log('\n\n\n==================== QR CODE ====================');
    qrcode.generate(qr, { small: false });
    console.log('=================================================\n\n');
    console.log('📱 COMO LER: Print a tela > WhatsApp > Aparelhos Conectados > 3 pontos > Ler da imagem\n\n');
  });

  client.on('ready', () => {
    console.log('\n🟢🟢🟢 CONECTADO COM SUCESSO! BOT 100% FUNCIONANDO 🟢🟢🟢\n');
  });

  // ⚡ TODOS OS COMANDOS AQUI MESMO
  client.onMessage(async (msg) => {
    if (!msg.isGroupMsg || !msg.body) return;

    const corpo = msg.body.toLowerCase().trim();
    const cmd = corpo.startsWith(CONFIG.prefixo) ? corpo.slice(1).split(' ')[0] : null;

    if (corpo === `${CONFIG.prefixo}menu`) {
      await client.sendText(msg.from, `
🤖 *BOT WARLOCK PRO*
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

    if (cmd === 'piada') {
      const piadas = ["Por que o livro de matemática é triste? Tem muitos problemas 🤣", "O que o 0 disse pro 8: Nossa, que cinto lindo! 😂"];
      await client.sendText(msg.from, `😂 *PIADA:*\n${piadas[Math.floor(Math.random() * piadas.length)]}`);
    }

    if (cmd === 'frase') {
      const frases = ["A persistência leva ao sucesso 💪", "Faça o seu melhor ✨"];
      await client.sendText(msg.from, `💬 *FRASE:*\n${frases[Math.floor(Math.random() * frases.length)]}`);
    }
  });

})
.catch(erro => {
  console.log('\n❌ ERRO:', erro);
});