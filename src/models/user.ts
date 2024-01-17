import { UserDTO } from "./dto/userDTO";

class User {
  id: string;
  email: string;
  displayName?: string;
  profilePictureUrl?: string;
  bio?: string;
  birthDate?: string;
  gender?: string;
  token: string;

  constructor(
    id: string,
    email: string,
    token: string,
    displayName?: string,
    profilePictureUrl?: string,
    bio?: string,
    birthDate?: string,
    gender?: string
  ) {
    this.id = id;
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
    userDto.user_id,
    userDto.email,
    token,
    userDto.display_name,
    userDto.profile_picture_url,
    userDto.bio,
    userDto.birth_date,
    userDto.gender
  );

export default User;
