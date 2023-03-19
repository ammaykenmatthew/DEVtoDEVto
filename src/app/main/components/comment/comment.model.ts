export interface Comment {
  username: string;
  date: string;
  text: string;
  votes: number;
  comments?: Array<Comment>;
}
