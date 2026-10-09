import { fileTypeFromBuffer } from "file-type";
import { connections } from "mongoose";
import multer from "multer";
import { randomUUID } from "node:crypto";
import { badReqException } from "../../common/errors/error.exception.js";
import { writeFile } from "fs/promises";
import { resolve } from "node:path";
import { mkdir } from "node:fs/promises";
export const fileValidation = {
  image: ["image/jpeg", "image/png"],
  file: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
};

export const localFileUpload = ({ filesize = 5 } = {}) => {
  const storage = multer.memoryStorage();
  return multer({ storage, limits: { fileSize: filesize * 1024 * 1024 } });
};

export const processFile = async ({ customPath = "general",validation = [], file }) => {
  const result = await fileTypeFromBuffer(file.buffer);
  console.log({ result, file: file });
  if (!validation.includes(result.mime)) {
    throw badReqException("inavild format babee");
  }

  const customFolderPath = resolve(`./uploads/${customPath}`);
  await mkdir(customFolderPath, { recursive: true });
  const uniqeFileNmae = `./uploads/${customPath}/${randomUUID()}.${result.ext}`
  const path = resolve(`./${uniqeFileNmae}`);
  await writeFile(path, file.buffer);
  return uniqeFileNmae;
};

export const processArray = async ({ customPath, validation = [], files }) => {
  const asets = [];
  for (const file of files) {
    const path = await processFile({customPath, validation, file });
    asets.push(path);
  }
  return asets;
};

export const processFields = async ({customPath, validation = [], files }) => {
  const asets = [];
  for (const field of Object.keys(files)) {
    const paths = await processFile({ customPath,validation, file: files[field][0] });
    asets.push({ key: field, paths });
  }
  console.log({ asets });
  return asets;
};



export const multerUpload = ({ validation = [] }) => {
  return async (req, res, next) => {
    if (req.file) {
      await processFile({ validation, file: req.file });
    }
    if (req.files?.length) {
      await processArray({ validation, files: req.files });
    } else if (
      req.files &&
      typeof req.files == "object" &&
      Object.keys(req.files)?.length
    ) {
      await processFields({ validation, files: req.files });
    }
    next();
  };
};

// export const prosseccFile = ({ validation = []  }) => {
//   return async (req, res, next) => {
//     const result = await fileTypeFromBuffer(req.file.buffer);
//     console.log({ result , file : req.file });
//     if (!validation.includes(result.mime)) {
//        throw badReqException("inavild format babee")
//     }
//     const path = resolve(`./uploads/${randomUUID()}.${result.ext}`)
//     await writeFile (path , req.file.buffer)
//     next();
//   };
// };

// async function fileFilter(req, file, cb) {
//   if (validation.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error(`Only ${validation.join(" , ")} files are allowed!`), false);
//   }
// }

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     console.log({ file });
//     cb(null, "./uploads");
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${randomUUID()}-${file.originalname}`);
//   },
// });
