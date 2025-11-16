import mongoose, { Schema, Types } from "mongoose";

export interface IToken {
  userId: Types.ObjectId;
  token: string;
  expiresAt: Date; // token expiration date
}

const tokenSchema = new Schema<IToken>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
  token: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

// Delete the token after it expires
tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Token = mongoose.models.token || mongoose.model("token", tokenSchema);

export default Token;
