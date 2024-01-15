import User from "../user";

export class UserDTO {
  user_id: string;
  email: string;
  display_name?: string;
  profile_picture_url?: string;
  bio?: string;
  birth_date?: string;
  gender?: string;
  is_deleted?: boolean;

  constructor(user: User) {
    this.user_id = user.id;
    this.email = user.email;
    this.display_name = user.displayName;
    this.profile_picture_url = user.profilePictureUrl;
    this.bio = user.bio;
    this.birth_date = user.birthDate;
    this.gender = user.gender;
  }
}
