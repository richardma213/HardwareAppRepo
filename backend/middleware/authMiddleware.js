import jwt from "jsonwebtoken";

/** Authentication middleware for validating jwt access tokens
 * 
 * The middleware checks the 'Authorization' header for a bearer token and
 * verifies its using the server's JWT secret, then attaches the decoded 
 * data down to req.user. 
 * 
 * Returns 401 error if no auth header is provided, or if token is invalid or expired
 * 
 * @param req - incoming http request 
 * @param res - http response object
 * @param next - callback to pass control to next middleware (succeed authentication)
 */
export function authMiddleware(req, res, next){
    
    const auth_header = req.headers.authorization;
    
    if (!auth_header){
        return res.status(401).json({message: "no token"});
    }

    const token = auth_header.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();

    } catch {
        res.status(401).json({message: "invalid token!"});
        
    }
}