type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type UserRequest = {
  name: string;
  email: string;
  password: string;
};

export type PartialUser = Partial<User>;

export default User;
