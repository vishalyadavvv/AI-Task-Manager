const BASE_URL = import.meta.env.VITE_API_URL;
console.log('API BASE URL:', BASE_URL); 

const getToken = () => localStorage.getItem('tf_token');

const buildHeaders = (extra = {}) => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
  ...extra,
});

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: buildHeaders(options.headers),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Request failed: ${res.status}`);
  }

  return data;
}

export const authApi = {
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (name, email, password) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
  me: () => request('/auth/me'),
};

export const tasksApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v))
    ).toString();
    return request(`/tasks${qs ? `?${qs}` : ''}`);
  },
  create: (title, description = '') =>
    request('/tasks', { method: 'POST', body: JSON.stringify({ title, description }) }),
  update: (id, fields) =>
    request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(fields) }),
  delete: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
};
