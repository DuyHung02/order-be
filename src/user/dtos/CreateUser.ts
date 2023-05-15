import { Role } from "../entity/Role";

export class CreateUser {
  id: number;
  email: string;
  password: string;
  roles: Role[];
  token: string;
}
