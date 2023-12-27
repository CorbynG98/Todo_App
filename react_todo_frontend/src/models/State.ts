type State = {
  username: string | undefined | null;
  token: string | undefined | null;
  isLoggedIn: boolean;
  apiType: string;
  cookieName: string;
};
export type { State };
