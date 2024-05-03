const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

function swaggerConfig(app) {
    const SwaggerUIBundle = require('swagger-ui-dist').SwaggerUIBundle
    const ui = SwaggerUIBundle({
        url: "https://petstore.swagger.io/v2/swagger.json",
        dom_id: '#swagger-ui',
        presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIBundle.SwaggerUIStandalonePreset
        ],
        layout: "StandaloneLayout"
    })
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
    const swagger = swaggerUi.setup(swaggerDocument,{customCssUrl: CSS_URL,ui});
    app.use("/swagger-doc",swaggerUi.serve,swagger);
}

module.exports = swaggerConfig