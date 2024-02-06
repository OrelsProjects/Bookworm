import { UserDTO } from "./dto/userDTO";

class User {
  userId: string;
  email: string;
  displayName?: string;
  profilePictureUrl?: string;
  bio?: string;
  birthDate?: string;
  gender?: string;
  token: string;

  constructor(
    userId: string,
    email: string,
    token: string,
    displayName?: string,
    profilePictureUrl?: string,
    bio?: string,
    birthDate?: string,
    gender?: string
  ) {
    this.userId = userId;
    this.displayName = displayName;
    this.email = email;
    this.token = token;
    this.profilePictureUrl = profilePictureUrl;
    this.bio = bio;
    this.birthDate = birthDate;
    this.gender = gender;
  }
}

export const FromResponseUser = (userDto: UserDTO, token: string) =>
  new User(
    userDto.userId,
    userDto.email,
    token,
    userDto.displayName,
    userDto.profilePictureUrl,
    userDto.bio,
    userDto.birthDate,
    userDto.gender
  );

export type CreateUser = Omit<User, "token">;

export default User;
