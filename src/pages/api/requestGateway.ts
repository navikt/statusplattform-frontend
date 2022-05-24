import { Console } from "console";
import { NextApiRequest, NextApiResponse } from "next";



const backendPath = process.env.BACKENDPATH

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



    const myHeaders = new Headers()
    myHeaders.append("authorization","Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6ImpTMVhvMU9XRGpfNTJ2YndHTmd2UU8yVnpNYyJ9.eyJhdWQiOiIxYzI2N2FjOS1iNTMyLTQyOTUtYmZlOS1hNGIwMDI1NDJkNjEiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vNjIzNjY1MzQtMWVjMy00OTYyLTg4NjktOWI1NTM1Mjc5ZDBiL3YyLjAiLCJpYXQiOjE2NTIyNTc0MTYsIm5iZiI6MTY1MjI1NzQxNiwiZXhwIjoxNjUyMjYzMDE0LCJhaW8iOiJBWFFBaS84VEFBQUFDQzEyZjd1TkhTVGdsckxzT041aTdqREhnU0lCaXFkbStqTDJpQXlFaUhsd241L1l0TU9VRmZ6cEdSUGQwQWJoR1hJT05NNnBROW5GcVdvTHMrTFo2TFV6QTRCYUI5VDBReHZrQTAyWWwzK25NWUYxellHQkdiam5EU0VFSXI4eUZZd3F2RTNBNzVYR0pHTE1mQzBydkE9PSIsImF6cCI6IjFjMjY3YWM5LWI1MzItNDI5NS1iZmU5LWE0YjAwMjU0MmQ2MSIsImF6cGFjciI6IjIiLCJncm91cHMiOlsiMmQ3ZjFjMGQtNTc4NC00ZjgxLThiYjItOGYzYTc5ZjhmOTQ5Il0sIm5hbWUiOiJMb3RzYmVyZywgTGFycyBBdWd1c3QiLCJvaWQiOiIxMDNmOWFkMi0wZjZiLTQ4OWMtYWQ0NC1iM2NlYmUyNTExZGIiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJMYXJzLkF1Z3VzdC5Mb3RzYmVyZ0BuYXYubm8iLCJyaCI6IjAuQVNBQU5HVTJZc01lWWttSWFadFZOU2VkQzhsNkpod3l0WlZDdi1ta3NBSlVMV0VnQURrLiIsInNjcCI6ImRlZmF1bHRhY2Nlc3MiLCJzdWIiOiJGZHh3TnU1S0VLMjNhX1ZvNllVSzEySXlhaElSUV9SckdocnRMZUpKbVI4IiwidGlkIjoiNjIzNjY1MzQtMWVjMy00OTYyLTg4NjktOWI1NTM1Mjc5ZDBiIiwidXRpIjoiU1hzWmRiMjZvMFNzSHRwdExNQlJBQSIsInZlciI6IjIuMCIsIk5BVmlkZW50IjoiTDE1MjQyMyIsImF6cF9uYW1lIjoiZGV2LWdjcDpuYXZkaWc6cG9ydGFsIn0.ANvw02fedR9ITFxsAdaJg__lIg6ihuf3MU9dqutp5boZ8hSfNjoSswVOc96pbSuvxL28R1ErhX2R4ssFqVvvk2O9-pt2pt4R59WS03rWXty88Er526x6TtrWypU0wBxv3H3ExE4eqaY9boyrg9UiRYCnzb2e92RG81_afn6rd6Fq16LDtm6fHZ4krt-RXj_oYnKMf7VtTScPXG-axA6Lii51a7oPvTBa9v-6P-MdeSIWH4JErUtXR2YVF0eIfNSO3xhg4tZtApnA6VGNzISyO7ayOKGlo2p9axAlTYsi9i077FpSgYCmSaN6P9fK2S7pVOodVgo7FJXld82bj5UWgg")
    //myHeaders.append("Content-type", "application/json; charset=UTF-8")
    let backEndRequest
    if(method == "POST"|| method == "PUT"){
        backEndRequest = createRequestWithBody(path, method, myHeaders, body)
    }
    else{
        backEndRequest = createRequest(path, method, myHeaders)
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
