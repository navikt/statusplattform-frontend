import { NextApiRequest, NextApiResponse } from "next"
import { NOMPersonPhone } from "../../types/types"

export default async (req: NextApiRequest, res: NextApiResponse) => {
    let shoutOutUrl = process.env.SHOUT_OUT_URL + "/api/v1/number"
    const newNumberData: NOMPersonPhone = req.body

    const resp = await fetch(shoutOutUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: req.headers.authorization as string,
        },
        body: JSON.stringify(newNumberData),
    })

    await resp
        .json()
        .then((body) => {
            if (body) {
                res.status(200).json(body.content)
            } else {
                res.send("Cant connect with shout-out api")
            }
        })
        .catch((e) => {
            console.log(e)
            res.status(resp.status).send(e)
        })
}
