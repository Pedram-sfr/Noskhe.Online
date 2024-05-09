const express = require("express");
const dotenv = require("dotenv");
const swaggerConfig = require("./src/config/swagger.config");
const AllExceptionHandler = require("./src/common/exception/all-exception.handler");
const NotFoundHandler = require("./src/common/exception/not-found.handler");
const AllRouter = require("./src/app.routes");
const expressEjsLayouts = require("express-ejs-layouts");
dotenv.config();
async function main(){
    const app = express();
    port = process.env.PORT
    require("./src/config/mongoose.config");
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.get('/home', (req, res) => {
        res.status(200).json('Welcome, your app is working well');
      })
    app.use(express.static("public"));
    app.set("view engin","ejs");
    swaggerConfig(app);
    app.use(AllRouter)
    AllExceptionHandler(app);
    NotFoundHandler(app)
    app.listen(port, ()=>{
        console.log(`server: http://localhost:${port}`);
    })
}
main();