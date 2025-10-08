import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {

    let teamkatalogPath = process.env.NEXT_PUBLIC_BACKENDPATH + "/rest/teams"

    const resp = await fetch(teamkatalogPath)
    await resp.json()
        .then(body => {
            if (body) {
                // Convert Map<UUID, String> to array of {id, name} objects
                const teamsArray = Object.entries(body).map(([id, name]) => ({
                    id,
                    name
                }))
                res.status(200).json(teamsArray)
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

