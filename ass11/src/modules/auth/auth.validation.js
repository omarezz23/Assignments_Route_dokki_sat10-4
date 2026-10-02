import { email, z } from "zod";
import { GenderEnum } from "../../common/enum/enum.gender.js";
import { generalValidationFields, matchfeilds } from "../../common/validation.js";

export const loginSchema = (lang) => {
    return z.object({
    email : generalValidationFields.email(lang),
    password :generalValidationFields.password(lang)
})
}

// .refine((data) =>  {
//     return data.email.includes("@gmail.com")
// }, {
//     message: "Only Gmail addresses are allowed",
//     path: ["email"]
// });

export const login = (lang)=>{
    return z.object({
    body : loginSchema(lang),
    // query : z.strictObject({
    //     lang : z.string().length(2).optional().default("en"),
    // }),
})
}

export const signup = (lang)=>{
  return z.object({ 
    body : loginSchema(lang).safeExtend({
    fullName :generalValidationFields.fullName(lang),
    confirmpassword : generalValidationFields.confirmpassword(lang),
    phone : generalValidationFields.phone(lang),
    // gender :z.union([
    //     z.literal(GenderEnum.MALE),
    //     z.literal(GenderEnum.FEMALE),
    // ])
    gender : generalValidationFields.gender(lang)
}).superRefine((data, ctx) => {
    console.log({data, ctx});
    matchfeilds("password", "confirmpassword", data, ctx , lang);
    
})
})
}



//   if (data.fullName.includes("n")) {
//     ctx.addIssue({
//       code: "custom",
//       path: ["fullName"],
//       message: "FullName contains invalid characters",
//     });
//   }


// .refine((data) =>  {
//     return data.password === data.confirmpassword
// },{
//     message : "passwords do not match",
//     path : ["confirmpassword"]
// })