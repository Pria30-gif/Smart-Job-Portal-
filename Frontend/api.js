const API_URL = import.meta.env.VITE_API_URL;

export async function fetchFromApi(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, options);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}