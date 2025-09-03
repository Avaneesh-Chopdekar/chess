export type RefreshRequest = {
  refreshToken: string;
};

export type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
  userId: string;
};

export type RefreshError = {
  message: string;
};
