import { http, HttpResponse } from "msw";

interface Credentials {
  email: string;
  password: string;
}

export const handlers = [
  http.post("/api/auth/login", async ({ request }) => {
    const credentials = (await request.json()) as Credentials;

    if (
      credentials.email === "test@example.com" &&
      credentials.password === "password123"
    ) {
      return HttpResponse.json({ token: "fake_token" }, { status: 200 });
    } else {
      return new HttpResponse(null, { status: 401 });
    }
  }),
  http.post("/api/auth/register", async ({ request }) => {
    const credentials = (await request.json()) as Credentials;

    if (
      credentials.email === "test@example.com" &&
      credentials.password === "password123"
    ) {
      return HttpResponse.json({ token: "fake_token" }, { status: 200 });
    } else {
      return new HttpResponse(null, { status: 401 });
    }
  }),
];
