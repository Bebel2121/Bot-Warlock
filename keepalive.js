const express = require('express');
const app = express();
const PORTA = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('🤖 BOT ONLINE - Warlock Pro');
});

app.listen(PORTA, () => {
  console.log(`✅ Servidor ligado na porta ${PORTA}`);
});