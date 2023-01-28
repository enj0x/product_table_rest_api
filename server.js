import express from 'express';
import color from 'chalk';
import jsdb from './db/jsdb.js';

const app = express();

const HOST = 'localhost'; // 127.0.0.1
const PORT = 3000;
const BASE_URL = `http://${HOST}:${PORT}`;

app.use(express.static('./public'));
app.use(express.json()); //  


app.get('/createProduct', (req, res) => {
  jsdb.createProduct(req, res, product);
})

app.get('/getProducts', (req, res) => {
  jsdb.getProducts(req, res);
})

app.get('/getProduct/:idx', (req, res) => {
  jsdb.getProduct(req, res, req.params.idx);
})

app.get('/deleteProduct/:idx', (req, res) => {
  jsdb.deleteProduct(req, res, req.params.idx);
})





app.listen(PORT, HOST, () => {
  console.log(color.yellow(`SERVER IS RUNNING AT: ${BASE_URL}`));
  console.log(color.magenta('TO CLOSE: CTRL + C'));
});