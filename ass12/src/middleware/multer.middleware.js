import { processFile, processArray, processFields } from "../utils/multer/local.multer.js";

export const localMulterMiddleware = ({
  isRequired = true,
  customPath = "general",
  multerMiddleware,
  validation = [],
}) => {
  return async (req, res, next) => {
    multerMiddleware(req, res, async (error) => {
      if (error) {
        next(new Error(error.message, [{ cause: { status: 400 } }]));
      } 
      else {
        if (isRequired && !(req.file  ||  req.files?.length || (typeof req.files == "object") )) {
        next(new Error("File is required", [{ cause: { status: 400 } }]));
      }
        try {
          if (req.file) {
           req.file.path = await processFile({customPath, validation, file: req.file });
          }
          if (req.files?.length) {
           const paths = await processArray({customPath, validation, files: req.files });
           req.files.push(paths)
          } else if (
            req.files &&
            typeof req.files == "object" &&
            Object.keys(req.files)?.length
          ) {
            const paths = await processFields({customPath, validation, files: req.files });
            req.files.push(paths)
          }

          next();
        } catch (error) {
          next(error);
        }
      }
    });
  };
};