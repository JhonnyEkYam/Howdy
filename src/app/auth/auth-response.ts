export interface AuthResponse {
    data: {
        _user_id: number,
        _user: string,
        _email: string,
        _access_token: string,
        _expires_in: number,
    }
}
