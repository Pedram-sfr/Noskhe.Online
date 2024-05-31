const express = require("express");
const dotenv = require("dotenv");
const swaggerConfig = require("./src/config/swagger.config");
const AllExceptionHandler = require("./src/common/exception/all-exception.handler");
const NotFoundHandler = require("./src/common/exception/not-found.handler");
const AllRouter = require("./src/app.routes");
const path = require("path")
const cors = require("cors")
const { Cron } = require("croner")
dotenv.config();
async function main(){
    const app = express();
    port = process.env.PORT
    require("./src/config/mongoose.config");
    require("./src/common/utils/initRedis");
    app.use(cors({origin: true,exposedHeaders: true}))
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.get('/', (req, res) => {
        res.status(200).json('Welcome, your app is working well');
      })
    app.use(express.static("public"));
    app.set("view engin","ejs");
    app.set('views',path.join(__dirname,'views'));
    swaggerConfig(app);
    app.use(AllRouter)
    AllExceptionHandler(app);
    NotFoundHandler(app)
    app.listen(port, ()=>{
        console.log(`server: http://localhost:${port}`);
    })
    // const job = Cron(
    //     '0/5 * * * * *', //every 5 second
    //     function(){
    //         console.log("test cron");
    //     },
    //     {timezone: 'Asia/Tehran'}
    // )
    // console.log(job._states);
}
main();