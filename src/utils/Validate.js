import * as YUP from "yup";

const userSchema = YUP.object({
  name: YUP.string().required(),
  email: YUP.string().email().required(),
  password: YUP.string().required(),
  confirmpassword: YUP.string()
    .oneOf([YUP.ref("password"), null], "password must match!")
    .required(),
});

const loginSchema = YUP.object({
  email: YUP.string().email().required(),
  password: YUP.string().required(),
});

export { userSchema, loginSchema };
