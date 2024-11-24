export interface Tag {
  _id: string;
  name: string;
  color: string;
}

export interface TagAssignment {
  tag_id: string;
  significance: number;
}
