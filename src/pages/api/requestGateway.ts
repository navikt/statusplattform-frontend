import { NextApiRequest, NextApiResponse } from "next";
import jose from "jose";



const backendPath = process.env.NEXT_PUBLIC_BACKENDPATH
const CLIENT_ID = process.env.AZURE_APP_CLIENT_ID
const CLIENT_SECRET = process.env.AZURE_APP_CLIENT_SECRET
const AZURE_APP_JWK = process.env.AZURE_APP_JWK;
const AZURE_OPENID_CONFIG_ISSUER = process.env.AZURE_OPENID_CONFIG_ISSUER;
const ENV = process.env.ENV
const TENANT = process.env.TENANT

const createRequest = (path,method, headers)  => new Request(path, {
    method: method,
    headers: headers
})

export default async (req: NextApiRequest, res: NextApiResponse) => {
    console.log("IN REQUEST GATEWAY")

    //For test/prod:
    let authorizationHeader = req.headers && req.headers.authorization?  req.headers.authorization: "No Authorization header"
    let accessToken = getAccessTokenFromBearerToken(authorizationHeader);


    //For dev:
    //let authorizationHeader = process.env.NEXT_AUTH_TOKEN

    await requestBearerTokenForBackend(accessToken);
    await validateClaimsAndSignature(accessToken);

    let backendEndpath = req.headers.backendendpath
    let method = req.headers.method
    let body = req.headers.body



    let path = backendPath + backendEndpath


    const fetch = require("node-fetch");
    const https = require('https');

    //For dev with local backend:
    //const https = require('http');

    const httpsAgent = new https.Agent({
        rejectUnauthorized: false,
    })


    const resp = await fetch(
        path,
        {
            headers: {'Authorization': authorizationHeader},
            method: method,
            agent: httpsAgent,
            body: body,
        },
      )
    await resp.json()
    .then(body => {
        if (body) {
            console.log("SUCCSESFULLY READ USERDATA")
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

const getAccessTokenFromBearerToken = (bearerToken: String) => {
    const bearerString = "Bearer ";
    return bearerToken.substring(bearerString.length);
}


const requestBearerTokenForBackend = async (accessToken: String) => {
    const fetch = require("node-fetch");
    const https = require('https');

    const url = "https://login.microsoftonline.com/"+TENANT+"/oauth2/v2.0/token";

    let client_id = CLIENT_ID;
    let client_secret =  CLIENT_SECRET;
    let scope='api://'+ ENV +'-gcp.navdig.portalserver/.default'
    let assertion = accessToken;
    let grant_type= 'urn:ietf:params:oauth:grant-type:jwt-bearer';
    let requested_token_use= 'on_behalf_of';

//     let client_id = 'cc54eb5e-cefa-4f70-b5c8-2cb7a34b2104';
//     let client_secret =  'ZBw8Q~6i8zkHHZD09c8YGqZMBja6ARJMvdW-~bAU';
//     let scope='api://dev-gcp.navdig.portalserver/.default'
//     let assertion = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSJ9.eyJhdWQiOiJjYzU0ZWI1ZS1jZWZhLTRmNzAtYjVjOC0yY2I3YTM0YjIxMDQiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vNjIzNjY1MzQtMWVjMy00OTYyLTg4NjktOWI1NTM1Mjc5ZDBiL3YyLjAiLCJpYXQiOjE2NzA4MzI5NTksIm5iZiI6MTY3MDgzMjk1OSwiZXhwIjoxNjcwODM3MjQ2LCJhaW8iOiJBWFFBaS84VEFBQUE5ditQWlJUNW92TVp2VUtWYXd4ZjVJTVgzaThNRW9Ud1RZZlVjc1l2dFZSQ1VaTXpWUWYvZWJkV3o1VDl0OThwd1gzdGV5d29XUGFXSFp3M3A3b1FUNkRIaVFodDN5c1BHSTdjd3IvQkFVS2dNN3ZrejhTUUdFNUFqalR1aHhMOVp6MWhkaDF4R2N0enUyOHlpNlp4SVE9PSIsImF6cCI6ImNjNTRlYjVlLWNlZmEtNGY3MC1iNWM4LTJjYjdhMzRiMjEwNCIsImF6cGFjciI6IjIiLCJncm91cHMiOlsiMmQ3ZjFjMGQtNTc4NC00ZjgxLThiYjItOGYzYTc5ZjhmOTQ5Il0sIm5hbWUiOiJMb3RzYmVyZywgTGFycyBBdWd1c3QiLCJvaWQiOiIxMDNmOWFkMi0wZjZiLTQ4OWMtYWQ0NC1iM2NlYmUyNTExZGIiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJMYXJzLkF1Z3VzdC5Mb3RzYmVyZ0BuYXYubm8iLCJyaCI6IjAuQVNBQU5HVTJZc01lWWttSWFadFZOU2VkQzE3clZNejZ6bkJQdGNnc3Q2TkxJUVFnQURrLiIsInNjcCI6ImRlZmF1bHRhY2Nlc3MiLCJzdWIiOiJ5dmRoejk5WEJvdHRHTmRrWE1UWE1BcW43enREU1dKMVEzRDdaWjVSMFpJIiwidGlkIjoiNjIzNjY1MzQtMWVjMy00OTYyLTg4NjktOWI1NTM1Mjc5ZDBiIiwidXRpIjoiS21OZzN5QkFsMDZrYkE3dk13OHdBQSIsInZlciI6IjIuMCIsIk5BVmlkZW50IjoiTDE1MjQyMyIsImF6cF9uYW1lIjoiZGV2LWdjcDpuYXZkaWc6cG9ydGFsIn0.Z3I0Ew8aGQZQ0fzaQgtOXv1AZqWYFXQONOlN_ZMu_24uXscGC-o-Afew0aLoYXHheWjyLGBcZAl5LZaknb_LDodrPYt0GfZd2pU06waMiIvolSD2kxT_xq4EXZhm8mxkIsamER8-hj8_pzzvVjam5ppBzSfiQ6m2YowtgswV_swq9GuyHO6JenXGpqPwwu7P4pmbzpnZQfHh0I8374jNkUMVNaXnPmZxPnsAlCoyK59vt9tYFk3KsaR80_L2ICDhDrxVegRZz0vQSPIS_zXJxCE4prKL0FFGPCcL1fM6WSxFGckWzr7quf_OTHkIuHwjfiPS8rWnNka6sNm8y-xS7g';
//     let grant_type= 'urn:ietf:params:oauth:grant-type:jwt-bearer';
//     let requested_token_use= 'on_behalf_of';

    console.log(assertion);
//

    let body = 'client_id='+client_id+'&'
    +'client_secret='+client_secret+'&'
    +'scope=' +scope+'&'
    +'assertion=' + assertion+'&'+
    'grant_type=' + grant_type + '&'+
    'requested_token_use='+requested_token_use;

    let resp =  await fetch('https://login.microsoftonline.com/nav.no/oauth2/v2.0/token', {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/x-www-form-urlencoded'
                      },
                      body: body
                  });

    console.log(resp.status); // 200

    if(resp.status == 200){
        let data = await resp.text()
        console.log(data)
    }
}
    


const validateClaimsAndSignature = async (accessToken: String) => {

    const alg = 'RS256'
    const jwk = AZURE_APP_JWK;
    const publicKey = await jose.importJWK(jwk, alg)
    const jwt = accessToken;

    const { payload, protectedHeader } = await jose.jwtVerify(jwt, publicKey, {
    issuer: AZURE_OPENID_CONFIG_ISSUER,
    audience: CLIENT_ID,
    })
    console.log("In validation: --------")
    console.log("jwk: "+ AZURE_APP_JWK)
    console.log("ISSUER: " + AZURE_OPENID_CONFIG_ISSUER)
    console.log("CLIENT_ID" + CLIENT_ID)
    console.log(protectedHeader)
    console.log(payload)
    console.log("----------------------")

}

