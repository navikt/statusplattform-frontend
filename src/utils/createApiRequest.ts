const apiPath = "/sp/api/testApi"

export const createApiRequest = (endpath:string, method:string) =>{
        let headers = new Headers();
            headers.append("backendendpath",endpath);
            headers.append("method", method)
            return new Request(apiPath, {
                headers: new Headers(headers),
              });
            
}