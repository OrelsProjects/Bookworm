class User {
  id: string;
  email: string;
  displayName: string;
  profilePictureUrl?: string;
  bio?: string;
  birthDate?: string;
  gender?: string;
  token: string;

  constructor(
    id: string,
    displayName: string,
    email: string,
    token: string,
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

export const FromResponseUser = (session: any) =>
  new User(
    session.userSub ?? "",
    "",
    session?.tokens?.accessToken?.payload?.email?.toString() ??
      session?.tokens?.idToken?.payload?.email?.toString() ??
      "",
    session.tokens?.accessToken?.toString() ?? ""
  );

export default User;
