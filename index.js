const express = require("express");
const app = express();
const path = require("path");
const mysql = require("mysql");
const alert = require("alert");
const { v4: uuidv4 } = require('uuid');
var methodOverride = require('method-override');

//mysql conncection 
let connection = mysql.createConnection({
    host: 'localhost',
    user: "root",
    database: "inventory",
    password: "#Kunal8@"
});

app.use(express.urlencoded({ extended: true }));
app.set("view engines", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride('_method'));

app.listen("8080", () => {
    console.log("listening port 8080");
});

//home page 
app.get("/", (req, res) => {
    let q = `select * from products  order by c_time desc limit 5`;
    try {
        connection.query(q, (err, result) => {
            if(err) throw err;
            console.log(result);
            res.render("home.ejs",{result});
        });
    }
    catch (err) {
        console.log(err);
    }
   
});


//*****Display Products operations******

app.get("/products", (req, res) => {
    let q = `select * from products order by c_time asc`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            res.render("products.ejs", { result })

        });

    }
    catch (err) {
        console.log(err);
    }
});

//*****ADD opertaion operations******


//add new product display page request
app.get("/newProduct", (req, res) => {
    res.render("newProduct.ejs");
});

//adding new product final request 
app.post("/newProduct", (req, res) => {
    let product = (req.body.product);
    let id = uuidv4();
    let cost = parseInt(req.body.cost_price);
    let sold = parseInt(req.body.sold_price);
    let stock = parseInt(req.body.stock);
    try {
        let q = `INSERT INTO products (id,product ,stock,cost_price,sold_price,c_time)VALUES ('${id}','${product}',${stock},${cost},${sold},NOW())`;
        connection.query(q, (err, res) => {
            if (err) { console.log(err) }
        });
    }
    catch {
        console.log(err);
    }
    res.redirect("/");

});


//*****update operations******

//update req from home page
app.get("/update", (req, res) => {
    res.redirect("/products");
});
//update req from products 
app.get("/updateform/:id", (req, res) => {
    let id = req.params.id;
    let q = `select * from products where id ='${id}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            // console.log(result);
            res.render("updateform.ejs", { result });
        });
    }
    catch {
        console.log(err);
    }
});

//patch req form updateform window
app.patch("/updateform/:id", (req, res) => {
    let id = req.params.id;
    let { stock } = req.body;
    let q = `update products set stock=${stock} where id='${id}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            res.redirect("/products");
        });
    }
    catch (err) {
        console.log(err);
    }
});


//*****Delete operations******

app.delete("/delete/:id", (req, res) => {
    let id = req.params.id;
    let q = `delete from products where id='${id}'`;

    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            // console.log(result);
            res.redirect("/products");
        });
    }
    catch (err) {
        console.log(err);
    }
});