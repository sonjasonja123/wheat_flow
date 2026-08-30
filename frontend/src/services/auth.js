import { jwtDecode } from 'jwt-decode'; // ispravan import

export const saveAuth = (data) => {
  localStorage.setItem('token', data.token);
  if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
  window.dispatchEvent(new Event('auth-changed'));
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.dispatchEvent(new Event('auth-changed'));
};

export const getUserFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    if (decoded.exp && decoded.exp * 1000 <= Date.now()) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }
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

export const isAuthenticated = () => Boolean(getUserFromToken());
