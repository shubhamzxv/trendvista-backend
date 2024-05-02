import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cors from "cors";
import paypal from 'paypal-rest-sdk'

//configure env
dotenv.config();

//CONFIG
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': process.env.PAYPAL_CLIENT_ID,
  'client_secret': process.env.PAYPAL_SECRET_KEY
});

//databse config
connectDB();

//rest object
const app = express();

//middelwares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);

app.post('/create-payment', async (req, res) => {
  const {total } = req.body;
  console.log(req.body);
  var create_payment_json = {
    "intent": "sale",
    "payer": {
      "payment_method": "paypal"
    },
    "redirect_urls": {
      "return_url": "http://localhost:3000/success",
      "cancel_url": "http://localhost:3000/cancel"
    },
    "transactions": [{
      "item_list": {
        "items": [{
          "name": "cart_data",
          "sku": "TrendVista",
          "price": `${total}`,
          "currency": "USD",
          "quantity": "1"
        }]
      },
      "amount": {
        "currency": "USD",
        "total": `${total}`
      },
      "description": "This is the payment description."
    }]
  };

  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      throw error;
    } else {
      console.log(payment);
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === 'approval_url') {
          return res.send(payment.links[i].href);
        }
      }
    }
  });

})


app.get('/success', (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;
  const execute_json = {
    payer_id: payerId,

  }
  paypal.payment.execute(paymentId, execute_json, (err, payment) => {
    if (err) {
      console.log(err);
      // throw err;
      res.status(500).send('failed payment');
    } else {
      console.log(JSON.stringify(payment));
      res.send("Payment Successfull")
    }
  })
})

app.get('/error', (req, res) => {
  res.send('Payment Cancelled')
})


//PORT
const PORT = process.env.PORT || 8080;

//run listen
app.listen(PORT, () => {
  console.log(
    `Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan
      .white
  );
});
