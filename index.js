// 🚀 BOT WARLOCK - CÓDIGO FORÇADO APARECER
require('./keepalive');
const { create } = require('venom-bot');
const fs = require('fs');
const path = require('path');

// ⚙️ CONFIGURAÇÕES
const CONFIG = {
  dono: '5521991847707@c.us', // COLOQUE SEU NÚMERO
  prefixo: '!',
  versao: '5.0'
};

// 🚀 INICIAR - CÓDIGO EM BLOCO GRANDE
create({
  session: 'bot-warlock-vendas',
  multidevice: true,
  logQR: false,
  useCode: true, // ✅ OBRIGA APARECER O CÓDIGO
  disableSpins: true,
  headless: "new"
})
.then(client => {

  // 📥 AQUI VAI APARECER, NÃO TEM COMO ESCONDER
  client.on('code', (codigo) => {
    // VAI APARECER UM BLOCO ENORME NO MEIO DA TELA
    console.log('\n\n\n');
    console.log('##################################################');
    console.log('##                                            ##');
    console.log('##      SEU CÓDIGO É ESSE:  ' + codigo + '      ##');
    console.log('##                                            ##');
    console.log('##  ABRA SEU WHATSAPP > APARELHOS CONECTADOS  ##');
    console.log('##  > CONECTAR > USAR CÓDIGO EM VEZ DE CÂMERA ##');
    console.log('##                                            ##');
    console.log('##################################################');
    console.log('\n\n\n');
  });

  client.on('ready', () => {
    console.log('🟢 CONECTADO! PRONTO PARA USAR!');
  });

  // AQUI TODO O RESTO DOS COMANDOS...
  client.onMessage(async (msg) => {
    if (!msg.isGroupMsg || !msg.body) return;
    if (msg.body.toLowerCase().trim() === `${CONFIG.prefixo}menu`) {
      await client.sendText(msg.from, `🤖 *BOT WARLOCK* 🤖\n✅ FUNCIONANDO!`);
    }
  });

})
.catch(erro => {
  console.log('❌ ERRO:', erro);
  setTimeout(() => process.exit(1), 3000);
});