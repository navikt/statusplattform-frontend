
import { NextApiRequest, NextApiResponse } from "next";

import { decodeJwt} from "jose";
import { validateClaimsAndSignature, getAccessTokenFromBearerToken } from "./utils/authHelper";

const env = process.env.ENV




export default async (req: NextApiRequest, res: NextApiResponse) => {
    if(env == "local"){
        //For lokal kjøring:
        let userInfo = {
            name: "LOKAL, BRUKER",
            navIdent: "J162994",
            email: "jonas.juvet@nav.no",
            adminAccess: true
        }
        res.status(200).json(userInfo);
        return;
    }

    let NO_AUTHORIZATION_HEADER = "No Authorization header"


    //For test/prod:
    //-----------------------------------

    let authorizationHeader = req.headers && req.headers.authorization?  req.headers.authorization: NO_AUTHORIZATION_HEADER
    if(authorizationHeader == NO_AUTHORIZATION_HEADER){
        let userInfo = {status: "user not logged in"};
        res.status(200).json(userInfo);
        return
    }
    
    let accessToken = getAccessTokenFromBearerToken(authorizationHeader);
    //TODO hva skjer om token er expired her:
   await validateClaimsAndSignature(accessToken);


  
    let claims = decodeJwt(accessToken);
    const ADMIN_GROUP_ID = "caa1c79e-c174-4084-bb48-7f03b8da43d1"
    const OPS_GROUP_ID = "48523717-9e5e-4ad5-bb62-914425c35e37"
    const groups = (claims.groups as string[]) || []
    const adminAccess = groups.includes(ADMIN_GROUP_ID) || groups.includes(OPS_GROUP_ID)
    let userInfo = {
                       name: claims.name,
                       navIdent: claims.NAVident,
                       email: claims.preferred_username,
                       adminAccess
                   }
                   
    res.status(200).json(userInfo);
};

