import { Types } from "mongoose";
import { IUser } from "../../models/user.model";

declare global {
  namespace Express {
    interface User extends IUser {
      _id: Types.ObjectId;
    }

    interface Request {
      userId: Types.ObjectId;
      role: "ADMIN" | "CUSTOMER" | "SELLER";
      user?: User;
    }
  }
}
