// Store OTPs in memory (in production, use Redis or similar)
const otpStore = new Map<string, { otp: string; expiresAt: number }>();

const OTP_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes

export const generateOTP = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const storeOTP = (email: string, otp: string): void => {
  const expiresAt = Date.now() + OTP_EXPIRY_TIME;
  otpStore.set(email.toLowerCase(), { otp, expiresAt });
};

export const verifyOTP = (email: string, otp: string): boolean => {
  // Special case: ayushdubey2017@gmail.com always uses OTP 1111
  if (email.toLowerCase() === 'ayushdubey2017@gmail.com') {
    return otp === '1111';
  }
  
  const stored = otpStore.get(email.toLowerCase());
  
  if (!stored) {
    return false;
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(email.toLowerCase());
    return false;
  }

  const isValid = stored.otp === otp;
  
  if (isValid) {
    otpStore.delete(email.toLowerCase());
  }

  return isValid;
};

export const getOTPForEmail = (email: string): string | null => {
  // Special case: ayushdubey2017@gmail.com always uses OTP 1111
  if (email.toLowerCase() === 'ayushdubey2017@gmail.com') {
    return '1111';
  }
  
  const stored = otpStore.get(email.toLowerCase());
  if (!stored) {
    return null;
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(email.toLowerCase());
    return null;
  }

  return stored.otp;
};
