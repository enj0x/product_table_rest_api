import express from 'express';
import color from 'chalk';
import jsdb from './db/jsdb.js';

const app = express();

const HOST = 'localhost'; // 127.0.0.1
const PORT = 3000;
const BASE_URL = `http://${HOST}:${PORT}`;

app.use(express.static('./public'));
app.use(express.json()); //  


app.post('/product', (req, res) => {
  jsdb.addProduct(req, res);
})

app.get('/product', (req, res) => {
  jsdb.getProducts(req, res);
})

app.get('/product/:id', (req, res) => {
  jsdb.getProductById(req, res);
})

app.put('/product/:id', (req, res) => {
  jsdb.updateProductById(req, res);
})

app.delete('/product/:id', (req, res) => {
    jsdb.deleteProductById(req, res);  
})



app.listen(PORT, HOST, () => {
  console.log(color.yellow(`SERVER IS RUNNING AT: ${BASE_URL}`));
  console.log(color.magenta('TO CLOSE: CTRL + C'));
});