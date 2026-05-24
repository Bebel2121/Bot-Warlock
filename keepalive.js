const express = require('express');
const app = express();
const PORTA = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('🤖 BOT WARLOCK PRO - ONLINE 24H!');
});

app.listen(PORTA, () => {
  console.log(`✅ Servidor de conexão rodando na porta ${PORTA}`);
});