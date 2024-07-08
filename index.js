const express = require("express");
const app = express();
const mysql = require("mysql2");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
app.use(express.json());
app.use(cors());
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
});
function Testing() {
  return 1;
}
Testing();
app.listen(8080, () => {
  console.log("connected to backend");
});

app.get("/", (req, res) => {
  res.json("this is the backend");
});

app.get("/books", (req, res) => {
  const q = "select * from books";
  try {
    connection.query(q, (error, result, metainfo) => {
      if (error) throw res.json(error);

      res.json(result);
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/books", (req, res) => {
  const q = "insert into books (`title`,`descr`,`cover`,`price`) values (?)";
  const values = [
    req.body.title,
    req.body.descr,
    req.body.cover,
    req.body.price,
  ];

  connection.query(q, [values], (error, result) => {
    if (error) return res.json(error);
    return res.json("Book has been created successfully");
  });
});

app.delete("/books/:id", (req, res) => {
  const bookid = req.params.id;
  const query = "delete from books where id = ?";

  connection.query(query, [bookid], (error, result) => {
    if (error) throw res.json(error);

    return res.json("books has been deleted successfully");
  });
});

app.put("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const q =
    "UPDATE books SET title= ?, descr= ?, price= ?, cover= ? WHERE id = ?";

  const values = [
    req.body.title,
    req.body.descr,
    req.body.price,
    req.body.cover,
    bookId,
  ];
  console.log(values);
  connection.query(q, values, (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});
