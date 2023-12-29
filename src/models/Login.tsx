export interface LoginData {
    username: number | null,
    password: string,
    school_code: number | null,
    global: false
}

export interface LoginProps {
    handleLoginMock?: () => void
}