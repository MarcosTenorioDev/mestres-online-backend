export interface User {
    id: string;
    externalId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    role: string | null;
    isPaid:boolean;
}
export interface UserCreate {
    externalId: string;
    firstName: string;
    lastName: string;
    email: string;
}
export interface UserUpdate {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string | null;
    phone?: string | null;
}
export interface UserUpdateByClerk {
    id?: string;
    externalId?: string;
    firstName: string;
    lastName: string;
    email: string;
}

export interface UserRepository {
    create(data: UserCreate): Promise<User>;
    findByEmail(email:string):Promise<User | null>;
    userUpdateByClerk(data: UserUpdateByClerk): Promise<UserUpdateByClerk>;
    findUserByExternalId(externalId: string): Promise<User | null>;
    findUserByExternalOrId(id: string): Promise<User | null>;
    delete(id: string): Promise<void>;
    userUpdate(data: UserUpdate): Promise<UserUpdate>;
}