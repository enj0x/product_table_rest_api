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


const getProducts = (req, res) => {
  let sql = 'SELECT * FROM products';
  db.query(sql, (err, results) => {
      if(err) throw err;
      console.log('Produkte wurden geladen');
      res.send(results);
  });
};


const getProduct = (req, res) => {
    let id = req.params.id;
    let sql = `SELECT * FROM products WHERE id = ${id}`;
    db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send(result);
    });
  };


const addProduct = (req, res) => {
  let product = req.body; 
  let sql = 'INSERT INTO products SET ?';
  db.query(sql, product, (err, result) => {
    if(err) {
      return res.status(500).send({
      success: false,
      msg: 'Something went wrong.',
      })
    } else {
      return res.status(500).send({
        success: true,
        msg: 'Product added',
      });
    }
  })     
}

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
  
  const deleteProductById = (req, res) => {
    let id = req.params.id;
    let sql = `DELETE FROM products WHERE id = ${id}`;
    db.query(sql, (err, result) => {
      if(err) {
        return res.status(500).send({
          success: false,
          msg: 'Something went wrong.',
        });
      } else {
        console.log(`Produkt: ${id} deleted`,);
        return res.send({
          success: true,
          msg: `Produkt: ${id} deleted`,
        });
      }
    });
  };

  
export default {
  addProduct,
  getProducts,
  getProduct,
  deleteProductById
};
