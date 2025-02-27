import { DiscriminatedUnion } from "../src/index";

// Define a user authentication state
type AuthState = DiscriminatedUnion<"status", {
    unauthenticated: { redirectUrl: string };
    authenticating: { email: string; progress: number };
    authenticated: { user: { id: string; email: string } };
    error: { message: string; code: number };
}>;

// Example consumer
function handleAuthState(state: AuthState) {
    const { status, redirectUrl, email, progress, user, message, code } = state;

    switch (status) {
        case "unauthenticated":
            console.log(`Please login at ${redirectUrl}`);
            break;
        case "authenticating":
            console.log(`Authenticating ${email}... ${progress}%`);
            break;
        case "authenticated":
            console.log(`Welcome ${user.email}!`);
            break;
        case "error":
            console.log(`Error ${code}: ${message}`);
            break;
    }
}

// Example usage
const state: AuthState = {
    status: "authenticating",
    email: "example@gmail.com",
    progress: 50,
};

handleAuthState(state);