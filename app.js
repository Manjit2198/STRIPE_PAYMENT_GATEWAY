const express = require("express");
const dotenv  = require("dotenv");
dotenv.config()
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");

const app = express();


//handlebars middleware
app.engine("handlebars", exphbs({defaultLayout:"main"}));
app.set("view engine", "handlebars");

//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))

//set static folder
app.use(express.static(`${__dirname}/public`));

//index route
app.get("/", (req, res)=>{
    res.render("index",{
        stripePublishableKey:process.env.STRIPE_PUBLISHABLE_KEY
    });
})

//charge route
app.post("/charge",(req, res)=>{
    const amount = 333;

    stripe.customers.create({
        email:req.body.stripeEmail,
        source:req.body.stripeToken
    })
    .then(customer=> stripe.charges.create({
        amount,
        description:"Web Development Ebook",
        currency:"inr",
        customer:customer.id
     }))
     .then(charge => res.render("success"));
     
});

const port = process.env.PORT 
app.listen(port, ()=>{
    console.log("server started on port ", port);
})