const UserService = require("./user.service")
const autoBind = require("auto-bind")
class UserController{
    #service
    constructor(){
        autoBind(this);
        this.#service = UserService
    }
    async profile(req,res,next){
        try {
            const user = req.user
            return res.status(200).json({
                statusCode: 200,
                data: {
                    user
                },
                error: null
            })
        } catch (error) {
            next(error)
        }
    }

}

module.exports = new UserController();