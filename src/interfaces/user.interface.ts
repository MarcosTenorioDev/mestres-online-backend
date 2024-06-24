export interface User {
    id: string;
    externalId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    role: string | null;
}
export interface UserCreate {
    externalId: string;
    firstName: string;
    lastName: string;
    email: string;
}

export interface UserRepository {
    create(data: UserCreate): Promise<User>;
    findByEmail(email:string):Promise<User | null>;
}