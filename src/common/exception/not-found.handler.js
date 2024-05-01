function NotFoundHandler(app) {
    app.use((req,res,next) => {
        res.status(404).json({
            statusCode: 404,
            error: {
                message: "Not Found Route"
            }
        })
    })
}

module.exports = NotFoundHandler;