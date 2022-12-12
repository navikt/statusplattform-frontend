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


    //For dev:
    //let authorizationHeader = process.env.NEXT_AUTH_TOKEN

    await requestBearerTokenForBackend(authorizationHeader);
    //await requestBearerTokenForBackend2(authorizationHeader)

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

    let client_id = CLIENT_ID;//'cc54eb5e-cefa-4f70-b5c8-2cb7a34b2104';
    let client_secret =  CLIENT_SECRET;//'ZBw8Q~6i8zkHHZD09c8YGqZMBja6ARJMvdW-~bAU';
    let scope='api://'+ ENV +'-gcp.navdig.portalserver/.default'
    let assertion = accessToken; //'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSJ9.eyJhdWQiOiJjYzU0ZWI1ZS1jZWZhLTRmNzAtYjVjOC0yY2I3YTM0YjIxMDQiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vNjIzNjY1MzQtMWVjMy00OTYyLTg4NjktOWI1NTM1Mjc5ZDBiL3YyLjAiLCJpYXQiOjE2NzA4MzI5NTksIm5iZiI6MTY3MDgzMjk1OSwiZXhwIjoxNjcwODM3MjQ2LCJhaW8iOiJBWFFBaS84VEFBQUE5ditQWlJUNW92TVp2VUtWYXd4ZjVJTVgzaThNRW9Ud1RZZlVjc1l2dFZSQ1VaTXpWUWYvZWJkV3o1VDl0OThwd1gzdGV5d29XUGFXSFp3M3A3b1FUNkRIaVFodDN5c1BHSTdjd3IvQkFVS2dNN3ZrejhTUUdFNUFqalR1aHhMOVp6MWhkaDF4R2N0enUyOHlpNlp4SVE9PSIsImF6cCI6ImNjNTRlYjVlLWNlZmEtNGY3MC1iNWM4LTJjYjdhMzRiMjEwNCIsImF6cGFjciI6IjIiLCJncm91cHMiOlsiMmQ3ZjFjMGQtNTc4NC00ZjgxLThiYjItOGYzYTc5ZjhmOTQ5Il0sIm5hbWUiOiJMb3RzYmVyZywgTGFycyBBdWd1c3QiLCJvaWQiOiIxMDNmOWFkMi0wZjZiLTQ4OWMtYWQ0NC1iM2NlYmUyNTExZGIiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJMYXJzLkF1Z3VzdC5Mb3RzYmVyZ0BuYXYubm8iLCJyaCI6IjAuQVNBQU5HVTJZc01lWWttSWFadFZOU2VkQzE3clZNejZ6bkJQdGNnc3Q2TkxJUVFnQURrLiIsInNjcCI6ImRlZmF1bHRhY2Nlc3MiLCJzdWIiOiJ5dmRoejk5WEJvdHRHTmRrWE1UWE1BcW43enREU1dKMVEzRDdaWjVSMFpJIiwidGlkIjoiNjIzNjY1MzQtMWVjMy00OTYyLTg4NjktOWI1NTM1Mjc5ZDBiIiwidXRpIjoiS21OZzN5QkFsMDZrYkE3dk13OHdBQSIsInZlciI6IjIuMCIsIk5BVmlkZW50IjoiTDE1MjQyMyIsImF6cF9uYW1lIjoiZGV2LWdjcDpuYXZkaWc6cG9ydGFsIn0.Z3I0Ew8aGQZQ0fzaQgtOXv1AZqWYFXQONOlN_ZMu_24uXscGC-o-Afew0aLoYXHheWjyLGBcZAl5LZaknb_LDodrPYt0GfZd2pU06waMiIvolSD2kxT_xq4EXZhm8mxkIsamER8-hj8_pzzvVjam5ppBzSfiQ6m2YowtgswV_swq9GuyHO6JenXGpqPwwu7P4pmbzpnZQfHh0I8374jNkUMVNaXnPmZxPnsAlCoyK59vt9tYFk3KsaR80_L2ICDhDrxVegRZz0vQSPIS_zXJxCE4prKL0FFGPCcL1fM6WSxFGckWzr7quf_OTHkIuHwjfiPS8rWnNka6sNm8y-xS7g';
    let grant_type= 'urn:ietf:params:oauth:grant-type:jwt-bearer';
    let requested_token_use= 'on_behalf_of';

    console.log(assertion);


    let body = 'client_id='+client_id+'&'
    +'client_secret='+client_secret+'&'
    +'scope=' +scope+'&'
    +'assertion=' + assertion+'&'+
    'grant_type=' + grant_type + '&'+
    'requested_token_use='+requested_token_use;

    const httpsAgent = new https.Agent({
        rejectUnauthorized: false,
    })
    
    //TODO kallet under kan hende er riktig. men det må sjekkes med oppdatert data
    //DEN funket slik at nå må responsen tolkens
    //TODO bygge opp body på en fornuftig måte

    let resp =  await fetch('https://login.microsoftonline.com/nav.no/oauth2/v2.0/token', {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/x-www-form-urlencoded'
                      },
                      body: body
                  });

    console.log(resp.status); // 200
    console.log(resp.statusText)

    if(resp.status == 200){
        let data = await resp.text()
        console.log(data)
    }
}
    




const requestBearerTokenForBackend2 = async (bearerToken: String) => {
    const fetch = require("node-fetch");
    const https = require('https');
    const bearerString = "Bearer ";
    //const accessToken = bearerToken.substring(bearerString.length)
    const url = "https://login.microsoftonline.com/nav.no/oauth2/v2.0/token";
    //requested_token_use: "on_behalf_of"

    const httpsAgent = new https.Agent({
        rejectUnauthorized: false,
    })

    const accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSJ9.eyJhdWQiOiJjYzU0ZWI1ZS1jZWZhLTRmNzAtYjVjOC0yY2I3YTM0YjIxMDQiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vNjIzNjY1MzQtMWVjMy00OTYyLTg4NjktOWI1NTM1Mjc5ZDBiL3YyLjAiLCJpYXQiOjE2NzA0MTI1OTQsIm5iZiI6MTY3MDQxMjU5NCwiZXhwIjoxNjcwNDE2Njc3LCJhaW8iOiJBWFFBaS84VEFBQUFrcTZmMGVYK08wRmRzcFFBQmlOQ3ZzcTZjNGx6OGY5Q1pGNTdNTGFKcHNQcnRYQks2azl4bVdGajREM0JMZXhCbUNIZ29aVS84a3ZtVFp5c0RpUjA0ekVJVFFpNW9LcWFDVSs4QmpYUEtzOUxpVG9qcXp6dDF4TDgzLzJyOVdZSkVaL2FzMm5aTkhROXhtNlRWa3A0SVE9PSIsImF6cCI6ImNjNTRlYjVlLWNlZmEtNGY3MC1iNWM4LTJjYjdhMzRiMjEwNCIsImF6cGFjciI6IjIiLCJncm91cHMiOlsiMmQ3ZjFjMGQtNTc4NC00ZjgxLThiYjItOGYzYTc5ZjhmOTQ5Il0sIm5hbWUiOiJMb3RzYmVyZywgTGFycyBBdWd1c3QiLCJvaWQiOiIxMDNmOWFkMi0wZjZiLTQ4OWMtYWQ0NC1iM2NlYmUyNTExZGIiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJMYXJzLkF1Z3VzdC5Mb3RzYmVyZ0BuYXYubm8iLCJyaCI6IjAuQVNBQU5HVTJZc01lWWttSWFadFZOU2VkQzE3clZNejZ6bkJQdGNnc3Q2TkxJUVFnQURrLiIsInNjcCI6ImRlZmF1bHRhY2Nlc3MiLCJzdWIiOiJ5dmRoejk5WEJvdHRHTmRrWE1UWE1BcW43enREU1dKMVEzRDdaWjVSMFpJIiwidGlkIjoiNjIzNjY1MzQtMWVjMy00OTYyLTg4NjktOWI1NTM1Mjc5ZDBiIiwidXRpIjoiR1VLZ013ZFY5RWVKbnRlZEgyNmxBQSIsInZlciI6IjIuMCIsIk5BVmlkZW50IjoiTDE1MjQyMyIsImF6cF9uYW1lIjoiZGV2LWdjcDpuYXZkaWc6cG9ydGFsIn0.he3o77WrWVO5xyGucL9sHeQA26FOG7_qE8PtJ_ZIjKzxNSVbhATbLqLxyPl4C91eEibYH1Z0kj27QJ4ESuUh9JCyWysPDUrtVovRT5m94_1ystzJ7YHjlxXYts8HBkmb99bN7n8gnBeHqE59BVbz-LOeyP-jDC3xtKIS8MFG_G1hhQLmIVIuSFc5cjkaBcATNSm8duLcMvuzMEWpMlNtnwVxmXMlPxM3m4_lSMRaf9n-WwW_MYRnJr2dISRaycit4tyDGV0c00Hc60kLaMGx5jgMpSLjgHDsTCLWN-aqnJDkT2b6ZXonCyuqjWe-buyyzalV8udvpwEm5E9z5oFngQ"

    
    let resp =  await fetch(url, {
            method: 'POST',
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'grant_type': 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                'client_id': 'cc54eb5e-cefa-4f70-b5c8-2cb7a34b2104',
                'client_secret': 'ZBw8Q~6i8zkHHZD09c8YGqZMBja6ARJMvdW-~bAU',
                'scope': 'api://dev-gcp.navdig.portalserver/.default',
                'assertion': accessToken,
                'requested_token_use': 'on_behalf_of'
            })
        });
    
        console.log(resp.status); // 200
        console.log(resp.statusText)
    
        if(resp.status == 200){
            console.log("In v2 : ....")
            let data = await resp.text()
            console.log(data)
        }
    }


    //console.log(data)
    //console.log(url)

    /*

    var formBody: string[] = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    let body = formBody.join("&");

    const resp = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: body
    })

   await resp.then(response => {
        if (response) {
            console.log("SUCCSESFULLY GOT bearer token")
           console.log(response)
        }

    })
    .catch(e => {
        console.log(e)

    })


/*
            const resp =  fetch(url, {
                method: 'POST',
                headers:{
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                    'client_id': 'cc54eb5e-cefa-4f70-b5c8-2cb7a34b2104',
                    'client_secret': 'ZBw8Q~6i8zkHHZD09c8YGqZMBja6ARJMvdW-~bAU',
                    'scope': 'api://dev-gcp.navdig.portalserver/.default',
                    'assertion': accessToken,
                    'requested_token_use': 'on_behalf_of'
                })
            });

            await resp.then(response => {
                if (response) {
                    console.log("SUCCSESFULLY GOT bearer token")
                   console.log(response.blob)
                }

            })
            .catch(e => {
                console.log(e)

            })



    /*



            const resp = await fetch( url, {
                    method: 'POST',
                    headers: {
                       'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data),
                })
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


    */





