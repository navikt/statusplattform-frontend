import { NextApiRequest, NextApiResponse } from "next";
import https from "https";







export default async (req: NextApiRequest, res: NextApiResponse) => {


    console.log("IN TEAMKATALOG API")

    // let teamkatalogPath = "https://teamkatalog-api.dev.intern.nav.no/team?status=ACTIVE%2CPLANNED%2CINACTIVE"
    let teamkatalogPath= process.env.TEAMKATALOG_API + "/team?status=ACTIVE%2CPLANNED%2CINACTIVE"
    let method = "GET"
    let ENV = process.env.ENV

    let path = teamkatalogPath + "A122938"


    const fetch = require("node-fetch");
    let https  = require('https')
    // console.log(ENV)
    const httpsAgent = new https.Agent({
        rejectUnauthorized: false,
    })


    const resp = await fetch(
        teamkatalogPath,
        {
            agent: httpsAgent,
            method: method,
        },
    )
    await resp.json()
        .then(body => {
            if (body) {
                console.log(body)
                res.status(200).json(body.content)
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

