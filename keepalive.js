const express = require('express');
const app = express();
const PORTA = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('🤖 BOT WARLOCK - ONLINE 24 HORAS ✅');
});

app.listen(PORTA, () => console.log('✅ Sistema ativo'));