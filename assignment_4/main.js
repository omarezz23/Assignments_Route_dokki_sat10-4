const { app, server } = require("./server/server.js");
const db = require("./database/db.js");
/////////////////////////////////////////////////////////////////////////////////////////////
//theapis
/////////////////////////////////////////////////////////////////////////////////////////////
/*the prouduct*/
/*2*/
/*point1*/
app.post("/products", async (req, res) => {
  try {
    const { ProductName, Price, StockQuantity, SupplierID } = req.body;

    const [result] = await db.query(
      "INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID) VALUES (?, ?, ?, ?)",
      [ProductName, Price, StockQuantity, SupplierID],
    );

    res.status(201).json({
      message: "Product created successfully",
      id: result.insertId,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////
/*point2*/
app.get("/products", async (req, res) => {
  try {
    const [products] = await db.query("SELECT * FROM Products");

    return res.status(200).json({
      message: "Products retrieved successfully",
      products,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////
/*point3*/
app.get("/products", async (req, res) => {
  try {
    const [products] = await db.query(
      "SELECT * FROM products WHERE ProductID = ?",
      [req.query.ProductID],
    );

    return res.status(200).json({
      message: "THE product is",
      products,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});
///////////////////////////////////////////////////////////////////////////////////////////
/*point4*/
app.put("/products/:id", async (req, res) => {
  try {
    const { ProductName, Price, StockQuantity, SupplierID } = req.body;
    const { id } = req.params;

    const [result] = await db.query(
      `UPDATE Products
       SET ProductName = ?, Price = ?, StockQuantity = ?, SupplierID = ?
       WHERE ProductID = ?`,
      [ProductName, Price, StockQuantity, SupplierID, id],
    );

    const [updatedProduct] = await db.query(
      "SELECT * FROM Products WHERE ProductID = ?",
      [id],
    );
    res.status(200).json({
      message: "Product updated successfully",
      updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
///////////////////////////////////////////////////////////////////////////////////////////
/*point5*/
app.delete("/products", async (req, res) => {
  try {
    const [products] = await db.query(
      "DELETE FROM Products WHERE ProductID = ?",
      [req.query.ProductID],
    );
    return res.status(200).json({
      message: "Product deleted",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});
///////////////////////////////////////////////////////////////////////////////////////////
/*the supplier*/
/*point1*/
app.post("/suppliers", async (req, res) => {
  try {
    const { SupplierName, ContactNumber } = req.body;

    const [result] = await db.query(
      "INSERT INTO suppliers (SupplierName, ContactNumber) VALUES (?, ?)",
      [SupplierName, ContactNumber],
    );

    res.status(201).json({
      message: "supplier added successfully",
      id: result.insertId,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});
///////////////////////////////////////////////////////////////////////////////////////////
/*point2*/
app.get("/suppliers", async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM suppliers");

    return res.status(200).json({
      message: "the suppliers",
      result,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});
///////////////////////////////////////////////////////////////////////////////////////////
/*point3*/
app.put("/suppliers/:id", async (req, res) => {
  try {
    const { SupplierName, ContactNumber } = req.body;
    const { id } = req.params;

    const [result] = await db.query(
      `UPDATE suppliers
       SET SupplierName = ?, ContactNumber = ?
       WHERE SupplierID = ?`,
      [SupplierName, ContactNumber, id],
    );

    const [updatedsupplier] = await db.query(
      "SELECT * FROM suppliers WHERE SupplierID = ?",
      [id],
    );
    res.status(200).json({
      message: "supplier updated successfully",
      updatedsupplier,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
//////////////////////////////////////////////////////////////////////////////////////////
/*point4*/
app.delete("/suppliers", async (req, res) => {
  try {
    const [supp] = await db.query(
      "DELETE FROM suppliers WHERE SupplierID = ?",
      [req.query.SupplierID],
    );
    return res.status(200).json({
      message: "sup deleted",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});
////////////////////////////////////////////////////////////////////////////////////////////
/*thesale*/
/*point1*/
app.post("/sales", async (req, res) => {
  try {
    const { ProductID, QuantitySold, SaleDate } = req.body;

    const [result] = await db.query(
      "INSERT INTO sales (ProductID, QuantitySold,SaleDate) VALUES (?, ?,?)",
      [ProductID, QuantitySold, SaleDate],
    );

    res.status(201).json({
      message: "sale added",
      id: result.insertId,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});
//////////////////////////////////////////////////////////////////////////////////////////
/*point2*/
app.get("/sales", async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM sales");

    return res.status(200).json({
      message: "the sales",
      result,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});
//////////////////////////////////////////////////////////////////////////////////////////
/*point3*/
app.get("/sales/product/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [sales] = await db.query("SELECT * FROM sales WHERE ProductID = ?", [
      id,
    ]);

    if (sales.length === 0) {
      return res.status(404).json({
        message: "No sales found for this product",
      });
    }

    res.status(200).json({
      message: "Sales retrieved successfully",
      sales,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////
/*modification*/
/*/point1*/
app.patch("/products/add-category", async (req, res) => {
  try {
    await db.query(
      "ALTER TABLE Products ADD Category VARCHAR(100) DEFAULT 'General'",
    );
    res.status(200).json({
      message: "Category column added successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////
/*point2*/
app.patch("/products/rm-category", async (req, res) => {
  try {
    await db.query("ALTER TABLE Products DROP COLUMN Category;");
    res.status(200).json({
      message: "Category column rm successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
///////////////////////////////////////////////////////////////////////////////////////////
/*point3*/

app.patch("/suppliers/up-num", async (req, res) => {
  try {
    await db.query(
      "ALTER TABLE suppliers MODIFY COLUMN ContactNumber VARCHAR(15)",
    );
    res.status(200).json({
      message: "num up succedd",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
///////////////////////////////////////////////////////////////////////////////////////////
/*point4*/
app.patch("/products/up-name", async (req, res) => {
  try {
    await db.query(
      "ALTER TABLE Products MODIFY COLUMN ProductName VARCHAR(100) NOT NULL",
    );
    res.status(200).json({
      message: "productname up succedd",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
////////////////////////////////////////////////////////////////////////////////////////////
//6
//post http://localhost:3000/suppliers
/*{

    "SupplierName":"FreshFood",
    "ContactNumber":"0123352626"
}*/

//post http://localhost:3000/products
/*
{
    "ProductName":"milk",
    "Price":15.00,
    "StockQuantity":50 ,
    "SupplierID": 7
}
{
    "ProductName":"bread",
    "Price":10.00,
    "StockQuantity":30 ,
    "SupplierID": 7
}    
{
    "ProductName":"eggs",
    "Price":20.00,
    "StockQuantity":40 ,
    "SupplierID": 7
}
    */

//http://localhost:3000/sales
/*
{
    "ProductID":7,
    "QuantitySold":2,
    "SaleDate": "2025-05-20"
}
*/
////////////////////////////////////////////////////////////////////////////////////////////
//7
/*
put http://localhost:3000/products/9
{
    "ProductName":"eggs",
    "Price":"25.00",
    "StockQuantity":40 ,
    "SupplierID": 7
}
    */

///////////////////////////////////////////////////////////////////////////////////////////
//8
//delete http://localhost:3000/products?ProductID=9
///////////////////////////////////////////////////////////////////////////////////////////
//9
app.get("/sales/report", async (req, res) => {
  try {
    const [report] = await db.query(`
      SELECT ProductID, SUM(QuantitySold) AS TotalQuantitySold
      FROM Sales
      GROUP BY ProductID
    `);

    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});
///////////////////////////////////////////////////////////////////////////////////////////
//10
app.get("/products/report", async (req, res) => {
  try {
    const [report] = await db.query(`
      SELECT ProductName, StockQuantity FROM Products WHERE StockQuantity = (SELECT MAX(StockQuantity)FROM Products)`);

    res.status(200).json({
      message: "the repo is",
      report: report,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
///////////////////////////////////////////////////////////////////////////////////////////
//11
app.get("/supplires/report", async (req, res) => {
  try {
    const [report] = await db.query(`
      SELECT SupplierName FROM Suppliers WHERE SupplierName like 'f%'`);

    res.status(200).json({
      message: "the repo is",
      report: report,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////
//12
app.get("/products/never-sold", async (req, res) => {
  try {
    const [products] = await db.query(`
      SELECT *
      FROM Products
      LEFT JOIN Sales
      ON Products.ProductID = Sales.ProductID
    `);

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});
////////////////////////////////////////////////////////////////////////////////////////////
//13
app.get("/sales2/report", async (req, res) => {
  try {
    const [sales] = await db.query(`
      SELECT 
        Products.ProductName,
        Sales.Quantity,
        Sales.SaleDate
      FROM Sales
      INNER JOIN Products
      ON Sales.ProductID = Products.ProductID
    `);

    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});
//////////////////////////////////////////////////////////////////////////////////////////////
//14 
/*CREATE USER 'store_manager'@'localhost'
IDENTIFIED BY 'StrongPassword123!';

GRANT SELECT, INSERT, UPDATE
ON store.*
TO 'store_manager'@'localhost';

FLUSH PRIVILEGES;*/
/////////////////////////////////////////////////////////////////////////////////////////////
//15 
/*REVOKE UPDATE
ON store.*
FROM 'store_manager'@'localhost';*/
/////////////////////////////////////////////////////////////////////////////////////////////
//16
/*
GRANT DELETE
ON store.Sales
TO 'store_manager'@'localhost';
*/
/////////////////////////////////////////////////////////////////////////////////////////////
app.all("/*dummy", (req, res) => {
  res.status(404).json({ messege: "invaild" });
});
