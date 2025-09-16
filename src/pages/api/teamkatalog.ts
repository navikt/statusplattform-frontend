import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {

    let teamkatalogPath = process.env.TEAMKATALOG_API + "/team?status=ACTIVE%2CPLANNED%2CINACTIVE"

    const resp = await fetch(teamkatalogPath)
    await resp.json()
        .then(body => {
            if (body) {
                res.status(200).json(body.content)
            }
            else {
                res.send("Cant connect with team katalog api")
            }

        })
        .catch(e => {
            // console.log(e)
            res.status(resp.status).send(e)
        })
};

