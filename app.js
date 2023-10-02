const express = require("express");
const app = express();
const sqlite3 = require("sqlite3");
const cors = require("cors");
const multer = require("multer");
const fileUpload = require("express-fileupload");
const bcrypt = require("bcrypt");

//for session and its storage
const session = require("express-session");
const sqlite = require("better-sqlite3");
const cookieParser = require("cookie-parser");
app.locals.moment = require("moment");
app.locals.moment.locale("en");

const SqliteStore = require("better-sqlite3-session-store")(session);

const sessiondb = new sqlite("sessions.db");

app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded({ extended: true })); //Parse URL-encoded bodies
app.use(fileUpload());
app.use(express.static("public"));

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(cookieParser()); // Allows server to read, save and access cookies

//Connect to the database or create one if it doesn't exist
var db = new sqlite3.Database(
  "./db/UnWasted.db",
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err && err.code === "SQLITE_CANTOPEN") {
      createDatabase();
    } else if (err) {
      console.error(err.message);
    } else {
      console.log("Connected to the database.");
    }
  }
);

//Creates a new database if one doesn't exist
function createDatabase() {
  var newdb = new sqlite3.Database("./db/UnWasted.db", (err) => {
    if (err) {
      console.log("Getting error " + err);
      // eslint-disable-next-line no-undef
      exit(1);
    }
  });
}

//Creates the tables for the database
db.run(
  `CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,
  fullname TEXT NOT NULL,
  password TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone_no INTEGER,
  address TEXT,
  logo TEXT,
  products_given INTEGER DEFAULT 0
);`,
  function (err) {
    if (err) {
      console.log("Error creating users table:", err);
    } else {
      console.log("Users table created successfully");
    }
  }
);

db.run(
  `CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  product_name TEXT NOT NULL,
  information TEXT NOT NULL,
  expiration_date DATETIME NOT NULL,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  stock INTEGER NOT NULL,
  image Text NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users(id)
);`,
  function (err) {
    if (err) {
      console.log("Error creating products table:", err);
    } else {
      console.log("Products table created successfully");
    }
  }
);

db.run(
  `CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  order_code TEXT NOT NULL,
  date_ordered TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(product_id) REFERENCES products(id),
  FOREIGN KEY(user_id) REFERENCES users(id)
);`,
  function (err) {
    if (err) {
      console.log("Error creating orders table:", err);
    } else {
      console.log("Orders table created successfully");
    }
  }
);

db.run(
  `CREATE TABLE IF NOT EXISTS contacts (
id INTEGER PRIMARY KEY AUTOINCREMENT,
user_id INTEGER NOT NULL,
date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
message TEXT NOT NULL,
FOREIGN KEY(user_id) REFERENCES users(id)
);`,
  function (err) {
    if (err) {
      console.log("Error creating contacts table:", err);
    } else {
      console.log("Contacts table created successfully");
    }
  }
);

db.run(
  `CREATE TABLE IF NOT EXISTS cart (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(product_id) REFERENCES products(id)
);`,
  function (err) {
    if (err) {
      console.log("Error creating cart table:", err);
    } else {
      console.log("Cart table created successfully");
    }
  }
);

// ALTER TABLE users ADD COLUMN isAdmin BOOLEAN DEFAULT 0;

app.use(
  session({
    store: new SqliteStore({
      client: sessiondb,
      expired: {
        clear: true,
        intervalMs: 86400000, //ms = 15min
      },
    }),
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 86400000 },
    unset: "destroy",
  })
);

//Registers user to database
app.post("/register", (req, res) => {
  const fullname = req.body.fullname;
  const password = req.body.password;
  const email = req.body.email;
  const phone_no = req.body.phone_no;
  const address = req.body.address;
  const type = req.body.type;
  var imageName = null;

  if (type === "Donator") {
    const { image } = req.files;

    // If no image submitted, exit
    if (!image) return res.sendStatus(400);

    // Move the uploaded image to our upload folder
    image.mv(__dirname + "/public/Images/CompanyLogos/" + image.name);
    imageName = image.name;
  }

  //hash password
  const hashedPassword = hashPassword(password);

  db.run(
    `INSERT INTO users (fullname, password, email, phone_no, address, logo, type) 
    VALUES ("${fullname}", "${hashedPassword}", "${email}", "${phone_no}", "${address}", "${
      type == "Donator" ? imageName : null
    }", "${type}")`,
    (err) => {
      if (err) {
        console.log(err.message);
      }
    }
  );
  console.log(
    "Account registered: " + fullname + " " + password + " " + email,
    " ",
    phone_no,
    " "
  );
  res.status(200).redirect("/login");
});

//Hashing
const saltRounds = 10;

const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

const comparePassword = (password, hashedPassword) => {
  const match = bcrypt.compareSync(password, hashedPassword);
  return match;
};

//Checks login information and either redirects to login page or to home page depending on a successful login
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const hashedPassword = hashPassword(password);
  console.log("Hashlenmiş Şifre:", hashedPassword);

  db.get(`SELECT * FROM Users WHERE email = "${email}"`, (err, row) => {
    if (err) {
      console.log(err.message);
    } else {
      try {
        if (row.email != null && comparePassword(password, row.password)) {
          console.log("Login successful: " + row.email + " " + row.password);
          req.session.userid = row.id;
          console.log(req.session.userid);
          console.log(req.session);
          req.session.save();
          res.status(200).redirect("/");
        } else {
          throw err;
        }
      } catch (err) {
        console.log("Login failed, mail or password is wrong.");
        console.log(err.message);
        res.status(404).redirect("/login");
      }
    }
  });
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      res.send(false);
    }
    res.clearCookie();
    return res.send(true);
  });
});

app.get("/getcookie", (req, res) => {
  console.log("getcook userid: " + req.session.userid);
  res.status(200).send(req.session.userid.toString());
});

app.put("/profile", (req, res) => {
  var id = req.session.userid;
  console.log("put prof id: " + id);
  var email = req.body.email;
  var password = req.body.password;
  var fullname = req.body.fullname;
  var phone_no = req.body.phone_no;
  var address = req.body.address;
  var logo = req.body.logo;
  var type = req.body.type;
  db.get(`SELECT * FROM users WHERE id = "${id}"`, (err, row) => {
    if (err) {
      console.log("Profile with given ID doesn't exist.");
      console.log(err.message);
    } else {
      email = updateValue(row.email, email);
      password = updateValue(row.password, password);
      fullname = updateValue(row.fullname, fullname);
      phone_no = updateValue(row.phone_no, phone_no);
      address = updateValue(row.address, address);
      logo = updateValue(row.logo, logo);
      type = updateValue(row.type, type);
    }
  });
  console.log(
    `"${email}" "${password}" "${fullname}" "${phone_no}" "${address}" "${logo}" "${type}"`
  );
  db.run(
    `UPDATE users SET email = "${email}", password = "${password}", fullname = "${fullname}", phone_no = "${phone_no}",
    address = "${address}", logo = "${logo}", type = "${type}" WHERE id = "${id}"`,
    (err) => {
      if (err) {
        console.log("Couldn't update profile.");
        console.log(err.message);
      }
    }
  );
  console.log("Profile updated successfully.");
  res.send(app.get(`/profile/${id}`));
});

function updateValue(currentValue, newValue) {
  if (newValue == "undefined" || newValue == null) {
    console.log(currentValue);
    return currentValue;
  } else {
    console.log(newValue);
    return newValue;
  }
}

app.get("/profile", (req, res) => {
  var id = req.session.userid;
  var query = `SELECT * FROM users WHERE id = "${id}"`;
  db.get(query, (err, row) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).send(row);
    }
  });
});

app.get("/profile/:id", (req, res) => {
  var id = req.params.id;
  var query = `SELECT * FROM users WHERE id = "${id}"`;
  db.get(query, (err, row) => {
    if (err) {
      console.log(err);
    } else {
      res.send(row);
    }
  });
});

app.post("/addproduct", (req, res) => {
  const productname = req.body.productname;
  const expirationdate = req.body.expirationdate;
  const stock = req.body.stock;
  const information = req.body.information;
  const { image } = req.files;

  // If no image submitted, exit
  if (!image) return res.sendStatus(400);

  // Move the uploaded image to our upload folder
  image.mv(__dirname + "/public/Images/ProductImages/" + image.name);

  //Automatically add donator's id to the database
  console.log("add product userid: " + req.body.userid);
  const userid = req.body.userid;
  console.log("useridsession: " + req.session.userid);
  db.run(
    `INSERT INTO products (user_id, product_name, expiration_date, stock, information, image) VALUES (?, ?, ?, ?, ?, ?)`,
    [userid, productname, expirationdate, stock, information, image.name],
    (err) => {
      if (err) {
        console.log(err.message);
        res.status(500).send("Product could not be added.");
      } else {
        res.status(200).send("Product added successfully.");
      }
    }
  );
});

app.post("/addcart", (req, res) => {
  const productId = req.body.productId;
  const userid = req.session.userid;
  console.log("useridsession: " + req.session.userid);
  db.run(
    `INSERT INTO cart (user_id, product_id) VALUES (?, ?)`,
    [userid, productId],
    (err) => {
      if (err) {
        console.log(err.message);
        res.status(500).send("Product could not be added to cart.");
      } else {
        res.status(200).send("Product added successfully to cart.");
      }
    }
  );
});

app.get("/cartItem", (req, res) => {
  var id = req.session.userid;
  var query = `SELECT * FROM cart WHERE user_id = "${id}"`;
  db.all(query, (err, row) => {
    if (err) {
      console.log(err);
    } else {
      res.send(row);
    }
  });
});

app.post("/deleteCartItem", (req, res) => {
  var id = req.body.cartid;
  var query = `DELETE FROM cart WHERE id = "${id}"`;

  db.run(query, (err) => {
    if (err) {
      console.log(err);
      res.status(404).send("Product can not delete from Cart");
    } else {
      res.status(200).send("Product deleted successfully from Cart");
    }
  });
});

app.post("/deleteproduct", (req, res) => {
  const productid = req.body.productid;
  db.run(`DELETE FROM products WHERE id = "${productid}"`, (err) => {
    if (err) {
      console.log(err.message);
      res.status(500).send("Product could not be deleted.");
    } else {
      res.status(200).send("Product deleted successfully.");
    }
  });
});

//Displays all products in stock
app.get("/products", (req, res) => {
  var query = `SELECT * FROM products WHERE stock > 0`;
  db.all(query, (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      console.log(rows);
      /*
      rows.forEach((row) => {
        console.log(row);
      });
      */
      res.send(rows);
    }
  });
});

app.get("/singleproduct/:id", (req, res) => {
  const id = req.params.id;
  var query = `SELECT * FROM products WHERE id = ${id}`;
  db.all(query, (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      console.log(rows);
      /*
      rows.forEach((row) => {
        console.log(row);
      });
      */
      res.send(rows);
    }
  });
});

app.get("/myproducts", (req, res) => {
  const userid = req.session.userid;
  var query = `SELECT * FROM products WHERE user_id = ${userid}`;
  db.all(query, (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      console.log(rows);
      /*
      rows.forEach((row) => {
        console.log(row);
      });
      */
      res.send(rows);
    }
  });
});

//Displays all orders of the user
app.get("/orders", (req, res) => {
  const userid = req.session.userid;
  console.log("orders userid: " + userid);
  var query = `SELECT * FROM orders WHERE user_id = "${userid}"`;
  db.all(query, (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      console.log(rows);
      /*
      rows.forEach((row) => {
        console.log(row);
      });
      */
      res.status(200).send(rows);
    }
  });
});

app.post("/addorder", (req, res) => {
  const productid = req.body.productid;
  const ordercode = req.body.ordercode;
  const userid = req.session.userid;
  const currentDate = req.app.locals.moment().format("YYYY-MM-DD HH:mm:ss");
  console.log("Current Date: " + currentDate);
  console.log("userid: " + userid);
  console.log("productid: " + productid);
  db.run(
    `INSERT INTO orders (user_id, product_id, order_code, date_ordered) VALUES (?, ?, ?, ?)`,
    [userid, productid, ordercode, currentDate],
    (err) => {
      if (err) {
        console.log(err.message);
        res.status(500).send("Order could not be added.");
      } else {
        //Reduce stock by 1 if order is successful and if the product is not removed

        var query3 = `UPDATE products SET stock = stock - 1 WHERE id = "${productid}" AND stock > 0`;
        db.run(query3, (err) => {
          if (err) {
            console.log("Error while decreasing stock:");
            console.log(err.message);
          }
        });
      }
    }
  );
  res.status(200).send("Order added successfully.");
});

app.post("/cancelorder", (req, res) => {
  const productid = req.body.productid;
  //Automatically add user's id to the database
  const userid = req.session.userid;
  console.log("userid: " + userid);
  console.log("productid: " + productid);

  deleteOrder(productid, userid, function (isOrderDeleted) {
    if (isOrderDeleted) {
      //Increase stock by 1 if order is deleted
      var query = `UPDATE products SET stock = stock + 1 WHERE id = "${productid}"`;
      db.run(query, (err) => {
        if (err) {
          console.log("Error while increasing stock:");
          console.log(err.message);
          res.status(500).send("An error has occurred");
        } else {
          //Checks for changes in the database
          db.get("SELECT changes() as changes", (err, row) => {
            console.log("Rows deleted:", row.changes);
            if (err) {
              console.log("Error while checking for stock changes:");
              console.log(err.message);
              res.status(500).send("Stock could not be increased.");
            } else if (row.changes > 0) {
              res.status(200).send("Stock increased successfully.");
            } else {
              res.status(500).send("Stock could not be increased.");
            }
          });
        }
      });
    } else {
      res.status(500).send("There is no order to cancel.");
    }
  });
});

app.post("/completeorder", (req, res) => {
  const productid = req.body.productid;
  //Automatically add user's id to the database
  const userid = req.session.userid;
  console.log("userid: " + userid);
  console.log("productid: " + productid);

  deleteOrder(productid, userid, (isOrderDeleted) => {
    if (isOrderDeleted) {
      //Remove product if stock is equal to zero

      var query2 = `DELETE FROM products WHERE id = "${productid}" AND stock = 0 
     AND NOT EXISTS (
         SELECT * FROM orders 
         LEFT JOIN products ON orders.product_id = products.id 
         WHERE products.id = "${productid}"
         AND orders.user_id = "${userid}"
         LIMIT 2
     )`;
      db.run(query2, (err) => {
        if (err) {
          console.log("Error while deleting product:");
          console.log(err.message);
        } else {
          //Checks for changes in the database
          db.get("SELECT changes() as changes", (err, row) => {
            console.log("Rows deleted:", row.changes);
            if (err) {
              console.log("Error while checking for changes:");
              console.log(err.message);
              res.status(500).send("Order could not be completed.");
            } else if (row.changes > 0) {
              res.status(200).send("Product deleted successfully.");
            } else {
              res.status(500).send("Order completed successfully");
            }
          });
        }
      });
    } else {
      res.status(500).send("Order could not be deleted.");
    }
  });
});

// Deletes from orders database if there's an entry with given id's
function deleteOrder(productid, userid, callback) {
  console.log("userid in deleteOrder: " + userid);
  console.log("productid in deleteOrder: " + productid);
  db.run(
    `DELETE FROM orders WHERE user_id = "${userid}" AND product_id = "${productid}"`,
    function (err) {
      if (err) {
        console.log("Order could not be deleted");
        console.log(err.message);
        var isOrderDeleted = false;
        callback(isOrderDeleted);
      } else if (this.changes > 0) {
        console.log("Order deleted");
        var isOrderDeleted = true;
        callback(isOrderDeleted);
      } else {
        console.log("Order not found");
        var isOrderDeleted = false;
        callback(isOrderDeleted);
      }
    }
  );
}

// Find the top 5 donators and send them in descending order
app.get("/topdonators", (req, res) => {
  db.all(
    `SELECT * FROM users WHERE type = "donator" OR type = "Donator" ORDER BY products_given DESC LIMIT 5`,
    (err, rows) => {
      if (err) {
        console.log("Error while finding top 5 domators:");
        console.log(err);
      } else {
        console.log(rows);
        /*
      rows.forEach((row) => {
        console.log(row);
      });
      */
        res.status(200).send(rows);
      }
    }
  );
});

app.post("/contacts", (req, res) => {
  const userid = req.session.userid;
  const message = req.body.message;

  db.run(
    `INSERT INTO contacts (user_id, message) VALUES (?,?)`,
    [userid, message],
    (err) => {
      if (err) {
        console.log(err);
        res.status(404).send("Message can not send " + err);
      } else {
        console.log(err);
        res.status(200).send("Message sent successfully");
      }
    }
  );
});

app.post("/answercontact", (req, res) => {
  const contactid = req.body.contactid;
  const feedback = req.body.feedback;

  db.run(
    `UPDATE contacts SET feedback = ?, status = 'SOLVED' WHERE id = ?`,
    [feedback, contactid],
    (err) => {
      if (err) {
        console.log(err);
        res.status(404).send("Feedback can not be saved " + err);
      } else {
        console.log(err);
        res.status(200).send("Feedback saved successfully");
      }
    }
  );
});

app.get("/contacts", (req, res) => {
  const userid = req.session.userid;
  const query = `SELECT * FROM contacts WHERE user_id = ${userid}`;
  db.all(query, (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      console.log(rows);
      res.status(200).send(rows);
    }
  });
});

app.get("/allcontacts", (req, res) => {
  const query = `SELECT * FROM contacts`;
  db.all(query, (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      console.log(rows);
      res.status(200).send(rows);
    }
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
