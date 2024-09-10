import { Schema, model } from "mongoose";

export interface IUser {
  _id?: string;
  email: string;
  username: string;
  password: string;
  availableMoney: number;
  purchasedItems: string[];
  cartItems: { [key: string]: number };  
  profileImage?: string; 
  profileImageUrl?: string; 
  
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  availableMoney: { type: Number, default: 5000 },
  purchasedItems: [
    { type: Schema.Types.ObjectId, ref: "product", default: [] },
  ],
  cartItems: {
    type: Map,
    of: Number,
    default: {}
  },
  profileImage: { type: String, required: false },
  profileImageUrl: { type: String, required: false },
});


export const UserModel = model<IUser>("user", UserSchema);
