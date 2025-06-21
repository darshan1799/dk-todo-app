import mongoose, { model, models, Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  provider: { type: String, default: "credentials" },
  password: {
    type: String,
    validate: {
      validator: function (value) {
        if (this.provider == "credentials") {
          return value;
        }
        return true;
      },
    },
  },
});

userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  } catch (err) {
    next("unable to genarate has password");
    throw err;
  }
});

export const userModel = models.users || model("users", userSchema);
