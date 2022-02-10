export interface AuthResponse {
    user: {
        user_id: number,
        user: string,
        email: string,
        access_token: string,
        expires_in: number,
    }
}
