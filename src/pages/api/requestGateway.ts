import { NextApiRequest, NextApiResponse } from "next";



const backendPath = process.env.NEXT_PUBLIC_BACKENDPATH
const CLIENT_ID = process.env.AZURE_APP_CLIENT_ID
const CLIENT_SECRET = process.env.AZURE_APP_CLIENT_SECRET
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

    await requestBearerTokenForBackend(authorizationHeader);

    //For dev:
    //let authorizationHeader = process.env.NEXT_AUTH_TOKEN


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


const requestBearerTokenForBackend = async (bearerToken: String) => {
    const fetch = require("node-fetch");
    const https = require('https');
    const bearerString = "Bearer ";
    const accessToken = bearerToken.substring(bearerString.length)
    const url = "https://login.microsoftonline.com/"+TENANT+"/oauth2/v2.0/token";


    const httpsAgent = new https.Agent({
        rejectUnauthorized: false,
    })

    console.log("Tenant:" + TENANT )
    
    console.log("ClientId:" + CLIENT_ID )
    console.log("Client Secret:" + CLIENT_SECRET )
    console.log("AccessToken: "+ accessToken)
    console.log("Env: "+ ENV);
    




    const resp = await fetch(
        url,
        {
            method: 'POST',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            scope: "api://"+ENV+"-gcp.navdig.portalserver/.default",
            assertion: accessToken,
            grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
            requested_token_use: "on_behalf_of"
        },
      )
    await resp.json()
    .then(body => {
        if (body) {
            console.log("SUCCSESFULLY GOT bearer token")
           console.log(body)
        }

    })
    .catch(e => {
        console.log(e)

    })
}




