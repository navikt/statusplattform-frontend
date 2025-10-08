import { NextApiRequest, NextApiResponse } from "next";
import { validateClaimsAndSignature, getAccessTokenFromBearerToken, requestBearerTokenForBackend } from "./utils/authHelper";

const backendPath = process.env.NEXT_PUBLIC_BACKENDPATH;
const env = process.env.ENV;
const api_key = process.env.NEXT_API_KEY;

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const NO_AUTHORIZATION_HEADER = "No Authorization header";
    const authorizationHeader = req.headers.authorization || NO_AUTHORIZATION_HEADER;
    let apiAccessToken = "";

    if (authorizationHeader !== NO_AUTHORIZATION_HEADER) {
        const userAccessToken = getAccessTokenFromBearerToken(authorizationHeader);
        await validateClaimsAndSignature(userAccessToken);
        apiAccessToken = await requestBearerTokenForBackend(userAccessToken);
    }

    const backendEndpath = req.headers.backendendpath;
    const method = req.headers.method ? String(req.headers.method) : "GET";
    const body = typeof req.headers.body === "string" ? JSON.parse(req.headers.body) : req.headers.body;
    const path = `${backendPath}${backendEndpath}`;
    
    // console.log('requestGateway - backendEndpath:', backendEndpath);
    // console.log('requestGateway - full path:', path);

    let authHeaderType = "Authorization";
    if (env === "local") {
        authHeaderType = "Apikey";
        apiAccessToken = api_key;
    }

    const authHeader = { [authHeaderType]: apiAccessToken };

    try {
        const response = await fetch(path, {
            headers: { ...authHeader, "Content-Type": "application/json" },
            method,
            body: JSON.stringify(body),
        });

        const responseBody = await response.json();

        // Debug logging for ops messages
        if (backendEndpath && backendEndpath.includes('OpsMessage')) {
            console.log('🔍 OpsMessage Request:', { method, path, body });
            console.log('🔍 OpsMessage Response:', JSON.stringify(responseBody, null, 2));
        }

        if (response.ok) {
            res.status(200).json(responseBody);
        } else {
            res.status(response.status).json({ error: responseBody });
        }
    } catch (error) {
        console.error("Error fetching from backend:", error);
        res.status(500).json({ error: "Error fetching data from backend" });
    }
};