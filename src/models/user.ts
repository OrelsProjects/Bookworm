class User {
  id: string;
  name: string;
  email: string;
  token: string;

  constructor(id: string, name: string, email: string, token: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.token = token;
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
