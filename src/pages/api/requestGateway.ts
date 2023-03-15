import { NextApiRequest, NextApiResponse } from "next";
import { validateClaimsAndSignature, getAccessTokenFromBearerToken, requestBearerTokenForBackend } from "./utils/authHelper";




const backendPath = process.env.NEXT_PUBLIC_BACKENDPATH


const env = process.env.NEXT_PUBLIC_ENV
const api_key = process.env.NEXT_API_KEY


export default async (req: NextApiRequest, res: NextApiResponse) => {


    let NO_AUTHORIZATION_HEADER = "No Authorization header"


    let authorizationHeader = req.headers && req.headers.authorization?  req.headers.authorization: NO_AUTHORIZATION_HEADER
    let apiAccessToken = ""
    if(authorizationHeader != NO_AUTHORIZATION_HEADER){
        let userAccessToken = getAccessTokenFromBearerToken(authorizationHeader);
        await validateClaimsAndSignature(userAccessToken);
        apiAccessToken = await requestBearerTokenForBackend(userAccessToken);
    }

    let backendEndpath = req.headers.backendendpath
    let method = req.headers.method
    let body = req.headers.body

    let path = backendPath + backendEndpath

    const fetch = require("node-fetch");
    const https = env == dev?  require('http') : require('https');


    const httpsAgent = new https.Agent({
        rejectUnauthorized: false,
    })

    let authHeaderType = 'Authorization';

    if(env == "local"){
        authHeaderType = 'Apikey';
        apiAccessToken = api_key;
    }

    let authHeader = {[authHeaderType]: apiAccessToken};



    const resp = await fetch(
        path,
        {
            headers: authHeader,
            method: method,
            agent: httpsAgent,
            body: body,
        },
      )
    await resp.json()
    .then(body => {
        if (body) {
            res.status(200).json(body)
        }
        else {
            res.send("Cant read userdate")
        }

    })
    .catch(e => {
        console.log(e)
        res.status(resp.status).send(e)
    })
};

