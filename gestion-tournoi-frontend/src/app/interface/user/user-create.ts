import { Role } from "../../models/role";

export interface UserCreate {
    id?: number;
     nom: string;
  prenom: string;
  email: string;
  password: string;
  role: Role;
}
