export interface User {
    _id: string;
    email: string;
    name: string;
    role: 'user' | 'admin' | 'super_admin';
    signupMethod: 'OTP' | 'Email/Password' | 'OAuth';
    profile: {
      phone?: string;
      address?: string;
      avatar?: string;
    };
    resorts?: string[];
    bookings?: string[];
    resetPasswordToken?: string;
    resetPasswordExpire?: string;
  }