import { NextApiRequest, NextApiResponse } from "next";



const backendPath = process.env.NEXT_PUBLIC_BACKENDPATH

const createRequest = (path,method, headers)  => new Request(path, {
    method: method,
    headers: headers
})

export default async (req: NextApiRequest, res: NextApiResponse) => {
    console.log("IN REQUEST GATEWAY")
    let authorizationHeader = req.headers && req.headers.authorization?  req.headers.authorization: "No Authorization header"

    let backendEndpath = req.headers.backendendpath
    let method = req.headers.method
    let body = req.headers.body



    let path = backendPath + backendEndpath


    const fetch = require("node-fetch");
    const https = require('https');

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






