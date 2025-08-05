export const Login = async (data: { email: string; password: string }) => {
  const res = await fetch('http://localhost:5000/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'server failed');
  }
  return await res.json();
};
