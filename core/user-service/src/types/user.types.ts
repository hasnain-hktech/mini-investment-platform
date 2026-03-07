// 1. What arrives in the signup request body
export interface SignupDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// 2. What arrives in the signin request body
export interface SigninDto {
  email: string;
  password: string;
}

// 3. What we return to the client after signup (never return the password)
export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}
