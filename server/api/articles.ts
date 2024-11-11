import {MongoClient} from 'mongodb';
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
        const {page, limit} = event.req.url && event.req.url.includes('?')
            ? Object.fromEntries(new URLSearchParams(event.req.url.split('?')[1]).entries())
            : {page: '1', limit: '10'};

        const parsedPage = parseInt(page, 10);
        const parsedLimit = parseInt(limit, 10);

        const skip = (Number(page) - 1) * Number(limit);

        const db = await connectDb();
       const collection = db.collection('web_pages');

        // Fetch articles with pagination
        const articles: Article[] = await collection.find<Article>({})
            .skip(skip)
            .limit(Number(limit))
            .toArray();

        const totalCount = await collection.countDocuments();

        const pagination: Pagination = {
            page: Number(page),
            limit: Number(limit),
            totalCount,
            totalPages: Math.ceil(totalCount / Number(limit)),
        };

        // Respond with articles and pagination info
        return {articles, pagination};
    } catch (error) {
        console.error('Error fetching articles:', error);
        return {error: 'Failed to fetch articles'};
    }
})
