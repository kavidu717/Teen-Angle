import multer from "multer";
import dotenv from "dotenv";
import { S3Client } from "@aws-sdk/client-s3";
import multerS3 from "multer-s3";

dotenv.config();


const s3=new S3Client({

    region: process.env.AWS_REGION as string,
     credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  }

})

    const upload = multer({
  storage: multerS3({
    s3: s3,

    bucket: process.env.AWS_S3_BUCKET_NAME as string,

    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: 
    function (req, file, cb) {
      cb(null,
         { fieldName: file.fieldname });
    },
    key:
     function (req, file, cb) {

      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      
      cb(null, `teenangle/${uniqueSuffix}-${file.originalname}`);
    }
  })
});

export default upload