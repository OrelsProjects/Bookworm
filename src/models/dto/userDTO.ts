import User from "../user";
export type UserDTO = Omit<User, "token">;
