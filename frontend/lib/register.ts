export async function registerUsers(data: {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
}) {
  const payload = {
    full_name: data.fullName,
    phone_number: data.phoneNumber,
    email: data.email,
    password: data.password,
  };
  const res = await fetch('http://localhost:5000/users/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to register');
  }
  return await res.json();
}
