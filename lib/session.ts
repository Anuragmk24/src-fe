import jwt from 'jsonwebtoken';

export function getSession(token: string) {
  if (!token) {
    return null; // Return null if no token is provided
  }

  try {
    // Decode and verify the token using the secret key
    const decoded = jwt.verify(token, 'secret');

    // Return the decoded token data (i.e., session info)
    return decoded;
  } catch (error) {
    // Handle any errors that may occur during verification
    console.error('Token verification failed:', error);
    return null; // Return null if token verification fails
  }
}
