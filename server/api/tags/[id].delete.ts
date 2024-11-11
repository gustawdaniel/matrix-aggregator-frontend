import {connectDb} from "~/server/db";
import {ObjectId} from "mongodb";

export default defineEventHandler(async (event) => {
    const params = event.context.params;
    if (!params || !params.id) {
        throw new Error('Missing required parameter: id');
    }

    const tagId = params.id;

    const db = await connectDb();
    const tagsCollection = db.collection('tags');
    await tagsCollection.deleteOne({_id: new ObjectId(tagId)});
    return {success: true};
});
