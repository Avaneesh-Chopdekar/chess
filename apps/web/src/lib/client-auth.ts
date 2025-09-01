import { createAuthClient } from 'better-auth/react'

// TODO: Fix this later (type safety and env variables)
export const authClient: unknown = createAuthClient({
    baseURL: 'http://localhost:3001',
})