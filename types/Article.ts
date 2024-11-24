import type { ArticleMetadata } from "~/types/ArticleMetadata";
import type { TagAssignment } from "~/types/Tag";

export interface Article {
  markdown: string;
  metadata: ArticleMetadata;
  html: string;
  tags?: TagAssignment[];
}
