import { getDb } from "../utils/mongoDb.js";

export const getFullCreatorByUsername = async (username) => {
  try {
    const db = getDb();
    const creator = await db
      .collection("creators")
      .aggregate([
        {
          $match: {
            username,
          },
        },
        {
          $lookup: {
            from: "configs",
            localField: "config",
            foreignField: "_id",
            as: "config",
          },
        },
        {
          $unwind: {
            path: "$config",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            username: 1,
            image: 1,
            banner: 1,
            creator_id: 1,
            email: 1,
            config: 1,
          },
        },
      ])
      .toArray();
    if (creator.length === 0) {
      return null;
    }
    return creator[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};
