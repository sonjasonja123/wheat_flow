import { jwtDecode } from 'jwt-decode'; // ispravan import

export const saveAuth = (data) => {
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
};

export const getUserFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return {
      id: decoded.id,
      roleId: decoded.roleId
    };
  } catch {
    return null;
  }
};

export const getRole = () => {
  const user = getUserFromToken();
  return user?.roleId;
};
