export class UserResponseDto {
  id: string;
  login: string;
  version: number;
  createdAt: number;
  updatedAt: number;

  constructor(user: any) {
    this.id = user.id;
    this.login = user.login;
    this.version = user.version;
    this.createdAt = Math.floor(new Date(user.createdAt).getTime() / 1000);
    this.updatedAt = Math.floor(new Date(user.updatedAt).getTime() / 1000);
  }
}
