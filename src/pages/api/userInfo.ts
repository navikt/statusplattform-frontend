import { NextApiRequest, NextApiResponse } from "next";

import { decodeJwt} from "jose";
import { validateClaimsAndSignature, getAccessTokenFromBearerToken } from "./utils/authHelper";






export default async (req: NextApiRequest, res: NextApiResponse) => {


    let NO_AUTHORIZATION_HEADER = "No Authorization header"

    //For test/prod:
    //-----------------------------------

    let authorizationHeader = req.headers && req.headers.authorization?  req.headers.authorization: NO_AUTHORIZATION_HEADER
    if(authorizationHeader == NO_AUTHORIZATION_HEADER){
      res.send("User not logged in")
    }
    
    let accessToken = getAccessTokenFromBearerToken(authorizationHeader);
    //TODO hva skjer om token er expired her:
   await validateClaimsAndSignature(accessToken);
   

  
    let claims = decodeJwt(accessToken);

    let userInfo = {
                       name: claims.name,
                       navIdent: claims.NAVident
                   }

    //For lokal kjøring: 
    /*                   
    let userInfo = {
        name: "Etternavn, Fornavn",
        navIdent: ""
    }
    */
    res.status(200).json(userInfo);
};

