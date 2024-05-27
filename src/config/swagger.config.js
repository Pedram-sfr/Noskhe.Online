const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

function swaggerConfig(app) {
    const swaggerDocument = swaggerJsDoc({
        swaggerDefinition: {
            openapi: "3.0.1",
            info:{
                title: "Noskhe Online",
                description: "online Pharmacy",
                version: "0.0.1"
            },
            components:{
                securitySchemes:{
                    BearerAuth:{
                        type: "http",
                        scheme:"bearer",
                        bearerFormat: "JWT"
                    }
                }
            },
            security:[{BearerAuth : []}]
        },
        apis: [process.cwd() + "/src/**/*.swagger.js"]
    })  
    const swagger = swaggerUi.setup(swaggerDocument,{});
    app.use("/swagger-doc",swaggerUi.serve,swagger);
}

module.exports = swaggerConfig