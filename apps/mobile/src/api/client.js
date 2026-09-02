import { getToken, removeToken } from "../auth/auth";

const API_URL = "http://localhost:3000";

async function authenticatedFetch(url, options = {}) {
  const token = await getToken();

  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    await removeToken();
    throw new Error("SESSION_EXPIRED");
  }

  return response;
}

async function parseResponse(response, fallbackMessage) {
  let data = {};

  try {
    data = await response.json();
  } catch {
    // Some responses, such as 204 DELETE responses, have no body.
  }

  if (!response.ok) {
    throw new Error(data.error || fallbackMessage);
  }

  return data;
}

export async function login(email, password) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await parseResponse(
    response,
    "Login failed",
  );

  return data.data;
}

export async function getPlants() {
  const response = await authenticatedFetch(
    `${API_URL}/api/plants`,
  );

  const data = await parseResponse(
    response,
    "Failed to fetch plants",
  );

  return data.data;
}

export async function getPlantById(id) {
  const response = await authenticatedFetch(
    `${API_URL}/api/plants/${id}`,
  );

  const data = await parseResponse(
    response,
    "Failed to fetch plant",
  );

  return data.data;
}

export async function createPlant(plantData) {
  const response = await authenticatedFetch(
    `${API_URL}/api/plants`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(plantData),
    },
  );

  const data = await parseResponse(
    response,
    "Failed to create plant",
  );

  return data.data;
}

export async function updatePlant(id, plantData) {
  const response = await authenticatedFetch(
    `${API_URL}/api/plants/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(plantData),
    },
  );

  const data = await parseResponse(
    response,
    "Failed to update plant",
  );

  return data.data;
}

export async function deletePlant(id) {
  const response = await authenticatedFetch(
    `${API_URL}/api/plants/${id}`,
    {
      method: "DELETE",
    },
  );

  await parseResponse(
    response,
    "Failed to delete plant",
  );

  return true;
}

