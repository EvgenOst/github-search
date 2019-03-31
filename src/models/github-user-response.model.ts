export interface GithubUserResponseModel {
  total_count: number;
  items: UserModel[];
}

export interface UserModel {
  avatar_url: string;
  html_url: string;
  login: string;
  score: number;
}