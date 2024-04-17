export async function createAccount(username: string, password: string) {
  const rawResponse = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/users`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    }
  );

  return {
    jsonResponse: await rawResponse.json(),
    responseCode: rawResponse.status,
  };
}

export async function loginAccount(username: string, password: string) {
  const rawResponse = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/users/login`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    }
  );

  return {
    jsonResponse: await rawResponse.json(),
    responseCode: rawResponse.status,
  };
}

export async function deleteAccount(idToken: string) {
  const rawResponse = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/users/delete`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${idToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );

  return {
    jsonResponse: await rawResponse.json(),
    responseCode: rawResponse.status,
  };
}
