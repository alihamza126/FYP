import { ObjectId } from "mongodb";
import { getDb } from "../lib/db";

export interface ICategory {
  _id?: ObjectId;
  parentID?: string;
  name: string;
  url: string;
  iconUrl?: string;
  iconSize?: number[];
  createdAt: Date;
  updatedAt: Date;
}

export class Category {
  static collection = "categories";

  static async create(categoryData: Omit<ICategory, "_id" | "createdAt" | "updatedAt">) {
    const db = await getDb();
    const now = new Date();

    const category: ICategory = {
      ...categoryData,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection(this.collection).insertOne(category);
    return { ...category, _id: result.insertedId };
  }

  static async findById(id: string) {
    const db = await getDb();
    return db.collection<ICategory>(this.collection).findOne({ _id: new ObjectId(id) });
  }

  static async findByUrl(url: string) {
    const db = await getDb();
    return db.collection<ICategory>(this.collection).findOne({ url });
  }

  static async findChildren(parentId: string) {
    const db = await getDb();
    return db.collection<ICategory>(this.collection).find({ parentID: parentId }).toArray();
  }

  static async findAll() {
    const db = await getDb();
    return db.collection<ICategory>(this.collection).find().toArray();
  }

  static async update(id: string, data: Partial<ICategory>) {
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

  static async getTree() {
    const db = await getDb();
    const categories = await db.collection<ICategory>(this.collection).find().toArray();

    const categoryMap = new Map();
    const tree = [];

    // First pass: create a map of all categories
    categories.forEach((category) => {
      categoryMap.set(category._id?.toString(), {
        ...category,
        children: [],
      });
    });

    // Second pass: build the tree
    categories.forEach((category) => {
      const categoryWithChildren = categoryMap.get(category._id?.toString());
      if (category.parentID) {
        const parent = categoryMap.get(category.parentID);
        if (parent) {
          parent.children.push(categoryWithChildren);
        }
      } else {
        tree.push(categoryWithChildren);
      }
    });

    return tree;
  }
}
