
import { NextApiRequest, NextApiResponse } from "next";

import { decodeJwt} from "jose";
import { validateClaimsAndSignature, getAccessTokenFromBearerToken } from "./utils/authHelper";

const env = process.env.NEXT_PUBLIC_ENV




export default async (req: NextApiRequest, res: NextApiResponse) => {
    if(env == "local"){
        //For lokal kjøring:
        let userInfo = {
            name: "LOKAL, BRUKER",
            navIdent: "L152423"
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

    let userInfo = {
                       name: claims.name,
                       navIdent: claims.NAVident
                   }
                   
    res.status(200).json(userInfo);
};

