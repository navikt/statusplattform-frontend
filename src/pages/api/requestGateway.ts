import { NextApiRequest, NextApiResponse } from "next";



const backendPath = process.env.NEXT_PUBLIC_BACKENDPATH

const createRequest = (path,method, headers)  => new Request(path, {
    method: method,
    headers: headers
})

export default async (req: NextApiRequest, res: NextApiResponse) => {
    console.log("IN TEST API")

    let headers = req.headers
    let backendEndpath = headers.backendendpath
    let method = req.headers.method
    let body = req.headers.body

    console.log(backendEndpath)
    console.log(method)

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






