export interface RegisterResponse {
  status: number;
  message: string;
  data: any[]; // You can specify a more specific type for 'data' if needed
}

//user_modals

// Define an interface for the user document
export interface IUser {
  avatar: {
    url: string;
    localPath: string;
  };
  username: string;
  email: string;
  role: string;
  password: string;
  loginType: string;
  isEmailVerified: boolean;
  refreshToken?: string;
  forgotPasswordToken?: string;
  forgotPasswordExpiry?: Date;
  emailVerificationToken?: string;
  emailVerificationExpiry?: Date;
}

// Define methods available on the user instance
export interface IUserMethods {
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
  generateTemporaryToken(): {
    unHashedToken: string;
    hashedToken: string;
    tokenExpiry: number;
  };
}
