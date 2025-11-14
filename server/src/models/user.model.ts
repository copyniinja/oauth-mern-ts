import mongoose, { Model } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password?: string;
  profileImage?: string;
  providers: IProviders[];
  role: "ADMIN" | "SELLER" | "CUSTOMER";
}

interface IProviders {
  type: "credentials" | "google" | "facebook";
  providerId?: string;
}

// Sub Schema
const providerSchema = new mongoose.Schema<IProviders>(
  {
    type: {
      type: String,
      required: true,
    },
    providerId: {
      type: String,
    },
  },
  {
    _id: false,
  }
);

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    unique: [true, "Email already registered."],
    required: [true, "Email is required"],
  },
  password: {
    type: String,
  },
  profileImage: {
    type: String,
  },
  providers: {
    type: [providerSchema],
    required: true,
  },
  role: {
    type: String,
    default: "CUSTOMER",
    enum: {
      values: ["ADMIN", "SELLER", "CUSTOMER"],
      message: "{VALUE} is not supported",
    },
  },
});

const User: Model<IUser> = mongoose.model("User", userSchema);

export default User;
