import { ObjectId } from "mongodb";
import { getDb } from "../lib/db";

export interface IBrand {
  _id?: ObjectId;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Brand {
  static collection = "brands";

  static async create(brandData: Omit<IBrand, "_id" | "createdAt" | "updatedAt">) {
    const db = await getDb();
    const now = new Date();

    const brand: IBrand = {
      ...brandData,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection(this.collection).insertOne(brand);
    return { ...brand, _id: result.insertedId };
  }

  static async findById(id: string) {
    const db = await getDb();
    return db.collection<IBrand>(this.collection).findOne({ _id: new ObjectId(id) });
  }

  static async findByName(name: string) {
    const db = await getDb();
    return db.collection<IBrand>(this.collection).findOne({ name });
  }

  static async findAll() {
    const db = await getDb();
    return db.collection<IBrand>(this.collection).find().toArray();
  }

  static async update(id: string, data: Partial<IBrand>) {
    const db = await getDb();
    const updateData = {
      ...data,
      updatedAt: new Date(),
    };

    return db.collection(this.collection).updateOne({ _id: new ObjectId(id) }, { $set: updateData });
  }

  static async delete(id: string) {
    const db = await getDb();
    return db.collection(this.collection).deleteOne({ _id: new ObjectId(id) });
  }
}
