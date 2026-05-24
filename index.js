// 🚀 BOT WARLOCK - CÓDIGO FORÇADO PARA APARECER
require('./keepalive');
const { create } = require('venom-bot');

create({
  session: 'bot-warlock-free',
  multidevice: true,
  logQR: false,
  useCode: true, // ✅ OBRIGA A GERAR CÓDIGO DE TEXTO
  disableSpins: true,
  headless: "new",
  // 🚨 ISSO FAZ APARECER MESMO QUE O RENDER TENTE ESCONDER
  logger: {
    level: 'debug',
    info: (text) => {
      if (text.includes('code') || text.includes('Código')) {
        // VAI APARECER COMO ERRO, MAS É O CÓDIGO!
        console.error('=========================================');
        console.error('SEU CÓDIGO: ', text.split(': ')[1]);
        console.error('=========================================');
      }
    }
  }
})
.then(client => {
  console.log('🟢 CONECTADO! PRONTO!');
  client.onMessage(async (msg) => {
    if (msg.body === '!menu') await client.sendText(msg.from, '✅ FUNCIONANDO!');
  });
})
.catch(e => console.log('ERRO:', e));