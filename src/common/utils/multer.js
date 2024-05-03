const path = require("path");
const fs = require("fs")
const multer = require("multer");
const createHttpError = require("http-errors");
function createroute(req){
    const date = new Date();
    const year = date.getFullYear().toString();
    const month = date.getMonth().toString();
    const day = date.getDay().toString();
    const directory = path.join(__dirname,"..","..","..","public","uploads",((req.baseUrl).split("/")[2]).toString(),year,month,day);
    req.body.fileUploadPath = path.join("uploads",((req.baseUrl).split("/")[2]).toString(),year,month,day);
    fs.mkdirSync(directory,{recursive:true});
    return directory
}
const storage = multer.diskStorage({
    destination : (req,file,cb)=>{
        if(file?.originalname){
            // console.log()
            const filePath = createroute(req);
            return cb(null,filePath)
        }
        cb(null,null)
    },
    filename : (req,file,cb)=>{
        if(file.originalname){
            const ext = path.extname(file.originalname);
            const fileName = String(new Date().getTime() + ext);
            req.body.filename = fileName
            return cb(null,fileName)
        }
        cb(null,null)
    }
});
function fileFilter(req,file,cb){
    const ext = path.extname(file.originalname)
    const mimetypes = [".jpeg",".jpg",".png",".webp",".gif"]

    if(mimetypes.includes(ext)){
        return cb(null,true)
    }
    return cb(createHttpError.BadRequest("فرمت ارسال شده صحیح نمیباشد"))
}
function videoFilter(req,file,cb){
    const ext = path.extname(file.originalname)
    const mimetypes = [".mp4",".mkv",".mov",".mpg",".avi"]

    if(mimetypes.includes(ext)){
        return cb(null,true)
    }
    return cb(createHttpError.BadRequest("فرمت ارسال شده صحیح نمیباشد"))
}
const maxSize = 1 * 1000 * 1000
const videoMaxSize = 300 * 1000 * 1000
const uploadFile = multer({storage,limits: {fileSize: maxSize},fileFilter});
const uploadVideo = multer({storage,limits: {fileSize: videoMaxSize},videoFilter});

module.exports = {
    uploadFile,uploadVideo
}