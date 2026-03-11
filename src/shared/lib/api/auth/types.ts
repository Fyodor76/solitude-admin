export interface RegisterRequest {
  login: string
  username?: string
  email?: string
  password: string
  phoneNumber?: string
  role?: string
}

export interface RegisterResponse {
  avatarUrl: null
  createdAt: string
  email: null
  id: string
  isActive: true
  lastLoginAt: null
  login: string
  phoneNumber: null
  role: Roles
  updatedAt: Date
  username: null
}

enum ROLES_ENUM {
  USER = 'user',
  ADMIN = 'admin',
}

export type Roles = (typeof ROLES_ENUM)[keyof typeof ROLES_ENUM]

export interface LoginRequest {
  login: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    login: string
  }
}

export interface LogoutResponse {
  message: string
}

export interface RefreshRequest {
  refreshToken: string
}

export interface RefreshResponse {
  data: {
    accessToken: string
    refreshToken: string
  }
}
