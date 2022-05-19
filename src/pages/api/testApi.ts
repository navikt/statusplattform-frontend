import { NextApiRequest, NextApiResponse } from "next";



const backendPath = process.env.BACKENDPATH

const createRequest = (path,method ,headers)  => new Request(path, {
    method: method,
    headers: headers
  })

export default async (req: NextApiRequest, res: NextApiResponse) => {
    console.log("IN TEST API");
    let headers = req.headers
    let backendEndpath = headers.backendendpath
    let method = req.headers.method
    //const { ip } = req.cookies
    console.log(backendEndpath)
    console.log(method)
 
    let path = backendPath + backendEndpath;

    //let method = req.headers.method;
    
    let backEndRequest = createRequest(path, method, headers);

    
    
    let response = await fetch(backEndRequest)
     await response.json().then(body => {
    
        if (body) {
            console.log("SUCCSESFULLY READ USERDATA")
            res.status(200).json(body)
        }
        else {
            res.send("Cant read userdate")
        }

    }).catch(e => console.log(e))


};




  
