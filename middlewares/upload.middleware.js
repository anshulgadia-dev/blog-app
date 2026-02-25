import multer from "multer";

const storage = multer.diskStorage({
    destination : function (req,file,cb){
        cb(null,"./uploads")
    },
    filename : function (req,file,cb){
        const file_name = `${Date.now()}-${file.originalname}`
        cb(null,file_name)
    }
})

const upload = multer({storage});

export default upload;