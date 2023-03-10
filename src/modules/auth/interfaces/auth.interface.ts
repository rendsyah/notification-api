// Define Auth Tokens Interface
export interface IAuthTokens {
    sub: number;
    username: string;
}

// Define Result Auth Tokens Interface
export interface IResultAuthTokens {
    userId: number;
    username: string;
    refreshToken?: string;
}

// Define Auth Response Interface
export interface IAuthResponse {
    message?: string;
    access_token?: string;
    refresh_token?: string;
}
