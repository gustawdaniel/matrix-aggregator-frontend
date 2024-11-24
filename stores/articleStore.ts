import {ref} from "vue";
import type {WithId} from "mongodb";
import type {Article} from "~/types/Article";
import type {Pagination} from "~/types/Pagination";
import type {ArticleFilter} from "~/types/ArticleFilter";

export const useArticleStore = defineStore("articles", () => {
    // State
    const articles = ref<WithId<Article>[]>([]);
    const error = ref<string | null>(null);
    const isFetching = ref(false);
    const filter = ref<ArticleFilter>({});

    const pagination = ref<Pagination>({
        page: 1,
        limit: 12,
        totalCount: 0,
        totalPages: 1,
    });

    // Get articles (without triggering HTTP request)
    const setPaginationPage = (page: number) => {
        pagination.value.page = page;
    };

    const setFilter = (newFilter: ArticleFilter) => {
        filter.value = newFilter;
    }

    const fetchArticles = async (page: number = pagination.value.page) => {
        try {
            isFetching.value = true;
            const response = await fetch(
                `/api/articles?${new URLSearchParams({
                    page: page.toString(),
                    limit: pagination.value.limit.toString(),
                    ...filter.value.date ? {date: filter.value.date} : {},
                    ...filter.value.search ? {search: filter.value.search} : {},
                    ...filter.value.tags && (filter.value.tags.length) ? {tags: filter.value.tags.map(tag => tag._id).join(",")} : {},
                }).toString()}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    // Add query parameters for pagination
                },
            );
            const data = await response.json();
            articles.value = data.articles;
            pagination.value = data.pagination;
            error.value = null;
        } catch (err) {
            console.error("Error fetching articles:", err);
            if (err instanceof Error) {
                error.value = err.message;
            } else {
                error.value = "An unknown error occurred";
            }
        } finally {
            isFetching.value = false;
        }
    };

    return {
        filter,
        setFilter,

        pagination,
        setPaginationPage,

        articles,
        error,
        isFetching,
        fetchArticles,
    };
});