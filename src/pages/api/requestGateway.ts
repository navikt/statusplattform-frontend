import { NextApiRequest, NextApiResponse } from "next";



const backendPath = process.env.NEXT_PUBLIC_BACKENDPATH

const createRequest = (path,method, headers)  => new Request(path, {
    method: method,
    headers: headers
})

export default async (req: NextApiRequest, res: NextApiResponse) => {
    console.log("IN TEST API")
    console.log(req.headers)
    let authorizationHeader = req.headers && req.headers.authorization?  req.headers.authorization: "No Authorization header"
    //let authorizationHeader = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6ImpTMVhvMU9XRGpfNTJ2YndHTmd2UU8yVnpNYyJ9.eyJhdWQiOiIzNTY0ZjY0OC1jZmRjLTRiZTUtOTVjOC1lMTQxMzYxN2EwNjIiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vNjIzNjY1MzQtMWVjMy00OTYyLTg4NjktOWI1NTM1Mjc5ZDBiL3YyLjAiLCJpYXQiOjE2NTM4OTYwMzQsIm5iZiI6MTY1Mzg5NjAzNCwiZXhwIjoxNjUzOTAxMzU5LCJhaW8iOiJBWFFBaS84VEFBQUFkeVdlWXdrWEhzNG9vK0VsWVl6UDg3eElIekdEM2lKUFRhL2dZSm45b0ZsNmFlSFV1a1ZSVEhhdlBKQ0VJRkVTQTlIdlVTQUo2emFGaWVWMFF4ck91a1kzbzBmd0x0NGIxQzZVcmd0ZHJOSjZhcVAxbW9jZUVabzdRaE04YXhiM056VHhDU084NVljMHROdzhWVXZIaXc9PSIsImF6cCI6IjM1NjRmNjQ4LWNmZGMtNGJlNS05NWM4LWUxNDEzNjE3YTA2MiIsImF6cGFjciI6IjIiLCJncm91cHMiOlsiMmQ3ZjFjMGQtNTc4NC00ZjgxLThiYjItOGYzYTc5ZjhmOTQ5Il0sIm5hbWUiOiJMb3RzYmVyZywgTGFycyBBdWd1c3QiLCJvaWQiOiIxMDNmOWFkMi0wZjZiLTQ4OWMtYWQ0NC1iM2NlYmUyNTExZGIiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJMYXJzLkF1Z3VzdC5Mb3RzYmVyZ0BuYXYubm8iLCJyaCI6IjAuQVNBQU5HVTJZc01lWWttSWFadFZOU2VkQzBqMlpEWGN6LVZMbGNqaFFUWVhvR0lnQURrLiIsInNjcCI6ImRlZmF1bHRhY2Nlc3MiLCJzdWIiOiJFUUY5ZTc1UXRoNElBb0NsOWVGa0ZaVjF3Y01MYkJqRTg2THU4UzRPSkJrIiwidGlkIjoiNjIzNjY1MzQtMWVjMy00OTYyLTg4NjktOWI1NTM1Mjc5ZDBiIiwidXRpIjoiNDh2YnZJc2R6MHFhQ21QXzRqY25BQSIsInZlciI6IjIuMCIsIk5BVmlkZW50IjoiTDE1MjQyMyIsImF6cF9uYW1lIjoicHJvZC1nY3A6bmF2ZGlnOnBvcnRhbCJ9.gI-gBtOdL85v3-dSuME-OlBbBSA8sfL-dv-BsZINrnQB9yoes-arTkQAJekWXhByHb6o2IxMS2KWR2NeTj9X53AOPWkpXfcMSm2F4p4ULuaVLX2WTEi4OAuk_boifuCJ3XcpWWRz9ALmHsb7MFQwyfrVvuHkSBxPY3QYO191TvM5JptdpNObWGaSWhYk-k5OJdAW-fha02PmxVgO--SnehoTOmz_4xPExuECD9cWwJi3XIOPvsodUstMN6d0H23bNv50itSxuDRrRkm9wRT0GwAezmNUkJzBy7OEw62yZiTj4kU7y3fazrrz3m5FSy9rv71BMlIFC3sIIzv5xdLJkA"
    let backendEndpath = req.headers.backendendpath
    let method = req.headers.method
    let body = req.headers.body

    console.log(backendEndpath)
    console.log(method)
    console.log(authorizationHeader)

    let path = backendPath + backendEndpath
    console.log("Full path: "+ path)


    const fetch = require("node-fetch");
    const https = require('https');

    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });


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
    .catch(e => console.log(e))
























    /*
    let backEndRequest = createRequest(path, method, headers)

    let response = await fetch(backEndRequest)

    await response.json()
        .then(body => {
            if (body) {
                console.log("SUCCSESFULLY READ USERDATA")
                res.status(200).json(body)
            }
            else {
                res.send("Cant read userdate")
            }

        })
        .catch(e => console.log(e))

        */

};






