import { Role } from "@prisma/client";
import jwt from "jsonwebtoken";
import { createHash } from "crypto";

function hashToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
}

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

export interface TokenPayload {
    userId: string;
    role: Role;
}


function generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, ACCESS_SECRET, {
        expiresIn: (process.env.ACCESS_TOKEN_EXPIRES_IN ?? "15m") as jwt.SignOptions["expiresIn"],
    });
}

function generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, REFRESH_SECRET, {
        expiresIn: (process.env.REFRESH_TOKEN_EXPIRES_IN ?? "7d") as jwt.SignOptions["expiresIn"],
    });
}

function verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, ACCESS_SECRET) as TokenPayload;
}

function verifyRefreshToken(token: string): TokenPayload {
    return jwt.verify(token, REFRESH_SECRET) as TokenPayload;
}

export {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    hashToken,
};