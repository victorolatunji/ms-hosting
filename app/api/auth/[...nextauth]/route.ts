// Auth.js route handler. Exposes the GET/POST handlers from the config.
// Place at: /app/api/auth/[...nextauth]/route.ts

import { handlers } from "@/auth";

export const { GET, POST } = handlers;