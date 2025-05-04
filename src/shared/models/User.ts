import { Collection, Db, ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import { getDb } from "../lib/db";

export interface IUser {
  _id?: ObjectId;
  name: string;
  email: string;
  hashedPassword: string;
  role: "ADMIN" | "USER";
  createdAt: Date;
  updatedAt: Date;
}

export class User implements IUser {
  _id?: ObjectId;
  name: string;
  email: string;
  hashedPassword: string;
  role: "ADMIN" | "USER";
  createdAt: Date;
  updatedAt: Date;

  constructor(data: IUser) {
    this._id = data._id;
    this.name = data.name;
    this.email = data.email;
    this.hashedPassword = data.hashedPassword;
    this.role = data.role;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static async getCollection(): Promise<Collection<IUser>> {
    const db = await getDb();
    return db.collection<IUser>("users");
  }

  static async findByEmail(email: string): Promise<User | null> {
    const collection = await this.getCollection();
    const user = await collection.findOne({ email });
    return user ? new User(user) : null;
  }

  static async findById(id: string): Promise<User | null> {
    const collection = await this.getCollection();
    const user = await collection.findOne({ _id: new ObjectId(id) });
    return user ? new User(user) : null;
  }

  static async create(data: Omit<IUser, "_id" | "createdAt" | "updatedAt">): Promise<User> {
    const collection = await this.getCollection();
    const now = new Date();
    const userData: IUser = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(userData);
    return new User({ ...userData, _id: result.insertedId });
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async save(): Promise<void> {
    const collection = await User.getCollection();
    this.updatedAt = new Date();
    if (this._id) {
      await collection.updateOne({ _id: this._id }, { $set: this });
    } else {
      const result = await collection.insertOne(this);
      this._id = result.insertedId;
    }
  }

  async delete(): Promise<void> {
    if (this._id) {
      const collection = await User.getCollection();
      await collection.deleteOne({ _id: this._id });
    }
  }
}
