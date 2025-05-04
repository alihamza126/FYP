import { ObjectId } from "mongodb";
import { getDb } from "../lib/db";

export type PageType = "MAIN" | "LIST" | "PRODUCT";

export interface IPageVisit {
  _id?: ObjectId;
  time: Date;
  pageType: PageType;
  pagePath?: string;
  deviceResolution?: string;
  productID?: string;
  createdAt: Date;
}

export class PageVisit {
  static collection = "pageVisits";

  static async create(visitData: Omit<IPageVisit, "_id" | "createdAt">) {
    const db = await getDb();
    const now = new Date();

    const visit: IPageVisit = {
      ...visitData,
      createdAt: now,
    };

    const result = await db.collection(this.collection).insertOne(visit);
    return { ...visit, _id: result.insertedId };
  }

  static async findByProductId(productId: string) {
    const db = await getDb();
    return db.collection<IPageVisit>(this.collection).find({ productID: productId }).toArray();
  }

  static async getTrafficStats(startDate: Date, endDate: Date) {
    const db = await getDb();
    const pipeline = [
      {
        $match: {
          time: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: {
            pageType: "$pageType",
            date: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$time",
              },
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.date": 1,
        },
      },
    ];

    return db.collection(this.collection).aggregate(pipeline).toArray();
  }

  static async getDeviceStats(startDate: Date, endDate: Date) {
    const db = await getDb();
    const pipeline = [
      {
        $match: {
          time: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: "$deviceResolution",
          count: { $sum: 1 },
        },
      },
    ];

    return db.collection(this.collection).aggregate(pipeline).toArray();
  }
}
