import { NextResponse } from "next/server";

const ACCESS_MAX_AGE_SECONDS = 60 * 15;
const REFRESH_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

const baseOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
};

export function setAccessCookie(response: NextResponse, token: string): void {
    response.cookies.set("access_token", token, { ...baseOptions, maxAge: ACCESS_MAX_AGE_SECONDS });
}

export function setRefreshCookie(response: NextResponse, token: string): void {
    response.cookies.set("refresh_token", token, { ...baseOptions, maxAge: REFRESH_MAX_AGE_SECONDS });
}

export function clearAuthCookies(response: NextResponse): void {
    response.cookies.set("access_token", "", { ...baseOptions, maxAge: 0 });
    response.cookies.set("refresh_token", "", { ...baseOptions, maxAge: 0 });
}