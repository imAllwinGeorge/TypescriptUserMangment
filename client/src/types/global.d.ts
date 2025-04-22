export type UserType = {
    _id:string
    firstName: string
    lastName: string
    phone: string
    email: string
    password: string
    isAdmin: boolean
    isBlocked: boolean
}

export type LoginType = {
    accessToken: string
    user: UserType
    message: string
}

export type ResponseType = {
    message?: string
}
export type SliceUser = {
    user: {
        user: UserType
    }
}
export type SliceAdmin = {
    user: {
        admin: UserType
    }
}
export type ErrorType = {
    firstName?: string;
    secondName?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
  };
export type ChildrenProps = {
    children: React.ReactNode
}
