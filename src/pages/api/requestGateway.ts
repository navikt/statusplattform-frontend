import { Console } from "console";
import { NextApiRequest, NextApiResponse } from "next";
import { backendPath } from "..";



const createRequest = (path,method, headers)  => new Request(path, {
    method: method,
    headers: headers
})


const createRequestWithBody = (path,method, headers, body)  => new Request(path, {
    method: method,
    headers: headers,
    body: body
})

export default async (req: NextApiRequest, res: NextApiResponse) => {

    
    let headers = req.headers

    let method = req.headers.method
    let backendEndpath = headers.backendendpath
    let body = headers.body
    let path = backendPath + backendEndpath

    console.log("IN REQUEST GATEWAY BUILDER")




    let backEndRequest
    if(method == "POST"|| method == "PUT"){
        backEndRequest = createRequestWithBody(path, method, headers, body)
    }
    else{
        backEndRequest = createRequest(path, method, headers)
    }

    let response = await fetch(backEndRequest)

    await response.json()
        .then(body => {
            if (body) {
                console.log("***** SUCCSESFULLY HANDLED REQUEST *****")
                res.status(200).json(body)
            }
            else {
                res.send("***** REQUEST FAILED *****")
            }

        })
        .catch(e => console.log(e))


}
