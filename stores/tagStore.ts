import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useFetch } from '#app';
import type {Tag} from "~/types/Tag";



export const useTagStore = defineStore('tags', () => {
    // State
    const tags = ref<Tag[]>([]);
    const error = ref<string | null>(null);
    const isFetching = ref(false);

    // Get tags (without triggering HTTP request)
    const getTags = () => {
        return tags.value;
    };

    // Fetch tags from the API
    const fetchTags = async () => {
        isFetching.value = true;
        try {
            const {data, execute} = await useFetch<Tag[]>('/api/tags');
            await execute()
            console.log('response',data.value);
            tags.value = data.value ?? [];
        } catch (err) {
            console.error('Error fetching tags:', err);
        } finally {
            isFetching.value = false;
        }
    };

    // Add a new tag
    const addTag = async (newTagName: string, newTagColor: string): Promise<Tag | null> => {
        if (!newTagName.trim()) {
            error.value = 'Tag name is required.';
            return null;
        }

        const newTag: Omit<Tag, '_id'> = {
            name: newTagName.trim(),
            color: newTagColor,
        };

        try {
            const {data, execute} = await useFetch<Tag>('/api/tags', {
                method: 'POST',
                body: JSON.stringify(newTag),
            });

            // Clear inputs and error
            error.value = null;
            // Refresh the tags list after adding
            await fetchTags();

            return data.value;
        } catch (err) {
            console.error('Error adding tag:', err);
            error.value = 'Failed to add tag.';
        }

        return null;
    };

    // Remove a tag
    const removeTag = async (tagId: string) => {
        try {
            await useFetch(`/api/tags/${tagId}`, {
                method: 'DELETE',
            });

            // Refresh the tags list after removal
            await fetchTags();
        } catch (err) {
            console.error('Error removing tag:', err);
        }
    };

    // Return state and actions
    return {
        tags,
        error,
        isFetching,
        getTags,
        fetchTags,
        addTag,
        removeTag,
    };
});
