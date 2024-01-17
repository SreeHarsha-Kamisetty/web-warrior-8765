const express = require("express");
const cors = require("cors");
const { connection } = require("./db");
const { paymentRouter } = require("./routes/payment.route");


const app = express();

app.use(express.json());
app.use(cors());
app.use("/payments",paymentRouter);

app.get("/",(req,res)=>{
    res.send("home");
})
app.listen(8080,async()=>{
    try {
        await connection
        console.log("connected to DB");
        console.log(`Server is running at http://localhost:8080`);
    } catch (error) {
        console.log(error);
    }
})