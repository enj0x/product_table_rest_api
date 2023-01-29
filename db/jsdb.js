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
  const sql = 'SELECT * FROM products';
  db.query(sql, (err, results) => {
      if(err) throw err;
      console.log('Produkte wurden geladen');
      res.send(results);
  });
};

const getProductById = (req, res) => {
    const id = req.params.id;
    const sql = `SELECT * FROM products WHERE id = ${id}`;
    db.query(sql, (err, result) => {
        if(err) throw err;
        res.send(result);
    });
  };

const addProduct = (req, res) => {
  const product = req.body; 
  const sql = 'INSERT INTO products SET ?';
  db.query(sql, product, (err, result) => {
    if(err) {
      return res.status(500).send({
      success: false,
      msg: 'Something went wrong.',
      })
    } else {
      console.log('Product added');
      return res.status(500).send({
        success: true,
        msg: 'Product added',
      });
    }
  })     
}

const updateProductById = (req, res) => {
  const id = req.params.id;
  const {productname, description, quantity, price} = req.body; 
  const sql = `UPDATE products SET productname = '${productname}', description = '${description}', quantity = ${quantity}, price = ${price} WHERE id = ${id}`;
  db.query(sql, (err, result) => {
    if(err) {
      return res.status(500).send({
      success: false,
      msg: 'Something went wrong.',
      })
    } else {
      console.log(`Product ${id} updated`);
      return res.status(500).send({
        success: true,
        msg: `Product ${id} updated`,
      })
    }
  });
}
  
const deleteProductById = (req, res) => {
  const id = req.params.id;
  const sql = `DELETE FROM products WHERE id = ${id}`;
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
  getProductById,
  updateProductById,
  deleteProductById
};
