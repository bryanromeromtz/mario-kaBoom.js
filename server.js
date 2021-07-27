const express = require('express');
const app = express();
const path = require('path');

// Setting
app.set('port', 3000);

// Middlewares
app.use(express.static(path.join(__dirname, 'public')))

console.log(__dirname);

// Routes
app.get('/', (req, res) => {
  res.send('bienvenidos');
})

app.listen(app.get('port'), () => {
  console.log(`Aplicacion escuchada en el puerto ${app.get('port')}`);

})