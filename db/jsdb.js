import mysql from 'mysql2';

// Create connection
const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'test_database'
});

db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('MySql Connected...')
  });

const createProduct = (req, res, product) => {
  product = {productName:'testProduct', description:'This is a test product', quantity: 5, price: 29.99};
  let sql = 'INSERT INTO products SET ?';
  let query = db.query(sql, post, (err, result) => {
      if(err) throw err;
      console.log(result);
      res.send('Post 1 added...');
  });
};
  
const getProducts = (req, res) => {
  let sql = 'SELECT * FROM products';
  let query = db.query(sql, (err, results) => {
      if(err) throw err;
      console.log('getProducts in jsdb wurde aufgerufen');
      res.send(results);
  });
};

const getProduct = (req, res, id) => {
    let sql = `SELECT * FROM products WHERE id = ${id}`;
    let query = db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('product sent...');
    });
  };

//NOCH VERARBEITEN

  /*app.get('/updatepost/:id', (req, res, id) => {
      let newTitle = 'Updated Title';
      let sql = `UPDATE products SET title = '${newTitle}' WHERE id = ${id}`;
      let query = db.query(sql, (err, result) => {
          if(err) throw err;
          console.log(result);
          res.send('Post updated...');
      });
  });*/
  
  const deleteProduct = (req, res, id) => {
      let sql = `DELETE FROM products WHERE id = ${id}`;
      let query = db.query(sql, (err, result) => {
          if(err) throw err;
          console.log(result);
          res.send('Post deleted...');
      });
  };





export default {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct
};
