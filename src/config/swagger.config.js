const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

function swaggerConfig(app) {
    const swaggerDocument = swaggerJsDoc({
        swaggerDefinition: {
            info:{
                title: "Noskhe Online",
                description: "online Pharmacy",
                version: "0.0.1"
            }
        },
        apis: []
    })  
    const swagger = swaggerUi.setup(swaggerDocument,{});
    app.use("/swagger-doc",swaggerUi.serve,swagger);
}

module.exports = swaggerConfig