import { getDb } from "../utils/mongoDb.js";

export const getFullCreatorByUsername = async (username) => {
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
  return creator;
};
