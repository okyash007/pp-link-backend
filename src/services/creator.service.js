import { getDb } from "../utils/mongoDb.js";
import { ObjectId } from "mongodb";

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
            from: "tip-pages",
            let: { creatorId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$creator", "$$creatorId"]
                  }
                }
              }
            ],
            as: "tipPage",
          },
        },
        {
          $project: {
            username: 1,
            image: 1,
            banner_image: 1,
            creator_id: 1,
            email: 1,
            socials: 1,
            tipPage: { $arrayElemAt: ["$tipPage", 0] },
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

export const getCreatorWithOverlayByUsername = async (username) => {
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
            from: "overlays",
            let: { creatorId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$creator", "$$creatorId"]
                  }
                }
              }
            ],
            as: "overlay",
          },
        },
        {
          $project: {
            username: 1,
            image: 1,
            banner_image: 1,
            creator_id: 1,
            email: 1,
            socials: 1,
            overlay: { $arrayElemAt: ["$overlay", 0] },
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

export const getCreatorWithLinkTreeByUsername = async (username) => {
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
            from: "link-trees",
            let: { creatorId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$creator", "$$creatorId"]
                  }
                }
              }
            ],
            as: "linkTree",
          },
        },
        {
          $project: {
            username: 1,
            image: 1,
            banner_image: 1,
            creator_id: 1,
            email: 1,
            socials: 1,
            linkTree: { $arrayElemAt: ["$linkTree", 0] },
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