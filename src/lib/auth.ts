import jwt from 'jsonwebtoken';

export function jwtVerify(token: string){
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        return decoded;
    } catch (error) {
        console.error("JWT verification error:", error);
        return null;
    }
}