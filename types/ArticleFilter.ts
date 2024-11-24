import type {Tag} from "~/types/Tag";

export interface ArticleFilter {
    search?: string;
    tags?: Tag[];
    date?: string;
}
