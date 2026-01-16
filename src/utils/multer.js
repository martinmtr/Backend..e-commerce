import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./public/img");
    } ,
    filename: (req, file, callback) => {
        const newFileName = Date.now() + "-" + file.originalname;
        callback(null, newFileName);
    }
});


export const uploader = multer({storage});