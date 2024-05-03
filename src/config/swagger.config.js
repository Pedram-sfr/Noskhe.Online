const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

function swaggerConfig(app) {
    const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";
    const swaggerDocument = swaggerJsDoc({
        swaggerDefinition: {
            openapi: "3.0.1",
            info:{
                title: "Noskhe Online",
                description: "online Pharmacy",
                version: "0.0.1"
            }
        },
        apis: [process.cwd() + "/src/**/*.swagger.js"]
    })  
    const swagger = swaggerUi.setup(swaggerDocument,{customCssUrl: CSS_URL});
    app.use("/swagger-doc",swaggerUi.serve,swagger);
}

module.exports = swaggerConfig