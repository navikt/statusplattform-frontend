const apiPath = "/api/requestGateway"

export const createApiRequest = (endpath: string, method: string, body? :string) =>{
    let headers = new Headers()
    headers.append("backendendpath", endpath)
    headers.append("method", method)
    body && headers.append("body", body) 


    return new Request(apiPath, {
        headers: headers
    })
}