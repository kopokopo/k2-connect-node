export const sendRequest = async <T,>(
  url: string,
  options: RequestInit,
): Promise<T> => {
  const headers = {
    ...options.headers,
    Accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded",
  };
  try {
    const req = await fetch(url + "/oauth/token", {
      method: options.method ?? "POST",
      headers,
      body: JSON.stringify(options.body),
    });
    switch (req.status) {
      case 200 || 201:
        return (await req.json()) as T;
      default:
        throw new Error(`${req.statusText}`);
    }
  } catch (e) {
    throw e;
  }
};
