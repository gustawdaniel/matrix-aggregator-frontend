import {Document, Filter, MongoClient, ObjectId} from "mongodb";
import type {ArticleMetadata} from "~/types/ArticleMetadata";
import {Article} from "~/types/Article";
import {connectDb} from "~/server/db";

interface Pagination {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
}

export default defineEventHandler(async (event) => {
    try {
        // Read query parameters for pagination
        const {page, limit, search, tags, date} =
            event.req.url && event.req.url.includes("?")
                ? Object.fromEntries(
                    new URLSearchParams(event.req.url.split("?")[1]).entries(),
                )
                : {page: "1", limit: "10", search: '', tags: '', date: ''};

        const parsedPage = parseInt(page, 10);
        const parsedLimit = parseInt(limit, 10);

        const skip = (Number(page) - 1) * Number(limit);

        const db = await connectDb();
        const collection = db.collection("raw_articles");

        const where: Filter<Document>= {};

        if (search) {
            where['metadata.title'] = {$regex: search, $options: 'i'};
        }

        if(date) {
            const regex = new RegExp(`^${date}`);
            where['metadata.article:published_time'] = { $regex: regex };
        }

        if(tags) {
            where['tags'] = {
                $elemMatch: {
                    tag_id: {$in: tags.split(',').map(tag => new ObjectId(tag))}
                }
            }
        }

        // Fetch articles with pagination
        const articles: Article[] = await collection
            .find<Article>(where)
            // .sort({ 'metadata.article:published_time': -1 }) // Use sort as a separate method
            .sort({ 'createdAt': -1 }) // Use sort as a separate method
            .skip(skip)
            .limit(Number(limit))
            .toArray();

        const totalCount = await collection.countDocuments(where);

        const pagination: Pagination = {
            page: Number(page),
            limit: Number(limit),
            totalCount,
            totalPages: Math.ceil(totalCount / Number(limit)),
        };

        // Respond with articles and pagination info
        return {articles, pagination};
    } catch (error) {
        console.error("Error fetching articles:", error);
        return {error: "Failed to fetch articles"};
    }
});
