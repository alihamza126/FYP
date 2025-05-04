import { ObjectId } from "mongodb";
import { getDb } from "../lib/db";

export interface IProductSpec {
  specGroupID: string;
  specValues: string[];
}

export interface IProduct {
  _id?: ObjectId;
  name: string;
  isAvailable: boolean;
  desc?: string;
  specialFeatures: string[];
  images: string[];
  categoryID: string;
  optionSets: string[];
  price: number;
  salePrice?: number;
  specs: IProductSpec[];
  brandID: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Product {
  static collection = "products";

  static async create(productData: Omit<IProduct, "_id" | "createdAt" | "updatedAt">) {
    const db = await getDb();
    const now = new Date();

    const product: IProduct = {
      ...productData,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection(this.collection).insertOne(product);
    return { ...product, _id: result.insertedId };
  }

  static async findById(id: string) {
    const db = await getDb();
    return db.collection<IProduct>(this.collection).findOne({ _id: new ObjectId(id) });
  }

  static async findByCategory(categoryId: string) {
    const db = await getDb();
    return db.collection<IProduct>(this.collection).find({ categoryID: categoryId }).toArray();
  }

  static async findByBrand(brandId: string) {
    const db = await getDb();
    return db.collection<IProduct>(this.collection).find({ brandID: brandId }).toArray();
  }

  static async update(id: string, data: Partial<IProduct>) {
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

  static async search(query: string) {
    const db = await getDb();
    return db
      .collection<IProduct>(this.collection)
      .find({
        $or: [{ name: { $regex: query, $options: "i" } }, { desc: { $regex: query, $options: "i" } }],
      })
      .toArray();
  }
}
