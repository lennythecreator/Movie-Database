import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function GET(request) {
  const cookieStore = cookies();
  const token = cookieStore.get('Set-Cookie');

  if (!token) {
    return new Response('No token found', { status: 401 });
  }

  try {
    // Verify the JWT token
    const decodedToken = jwt.verify(token.value, process.env.JWT_SECRET);

    // Get user ID from the database
    const user = await getUserByEmail(decodedToken.sub);

    if (!user) {
      return new Response('User not found', { status: 404 });
    }

    // Return  user data
    return new Response(JSON.stringify(user));
  } catch (error) {
    return new Response('Invalid token', { status: 401 });
  }
}

async function getUserByEmail(email) {
  // Get the user  from the database
  const res = await fetch(``http://localhost/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
    }),
  });

  const user = await res.json();

  return user.response.items[0];
}

