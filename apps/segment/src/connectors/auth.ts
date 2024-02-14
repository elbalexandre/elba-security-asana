export const validateToken = async (token: string) => {
  const response = await fetch(`https://api.segmentapis.com/echo?message=valid`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.status;
};
