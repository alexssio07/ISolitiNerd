import { Role } from './role';

export class User {
    ID: number;
    Username: string;
    Password: string;
    Email: string;
    Nickname: string;
    DataRegistrazione: Date;
    ID_Ruolo: Role;
}