import { NextApiRequest, NextApiResponse } from "next";

import { decodeJwt} from "jose";
import { validateClaimsAndSignature } from "./utils/authHelper";






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
   

   // let accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyJ9.eyJhdWQiOiJjYzU0ZWI1ZS1jZWZhLTRmNzAtYjVjOC0yY2I3YTM0YjIxMDQiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vNjIzNjY1MzQtMWVjMy00OTYyLTg4NjktOWI1NTM1Mjc5ZDBiL3YyLjAiLCJpYXQiOjE2NzI2NTA0MzMsIm5iZiI6MTY3MjY1MDQzMywiZXhwIjoxNjcyNjU1MDk2LCJhaW8iOiJBWFFBaS84VEFBQUFoWkcwQ0tBaXVXK2tSaGhHVTU1b0VsZlpXOTdmS2tNRE10SGxRaXVWZ2tzLzZTTDZPN2l6cm9rOUFQRTd3YTR1KzFtZ2ZyVU56K0RqU1hpaGlUZFdDVDJwOFF6VGdoMFFYS0UrcWF2bXB6LzYvUEFlUnpLYVRzUmxLRFJUcUV4TWlTSW8xQk9hV1UwNjNtbFVmc0xYeFE9PSIsImF6cCI6ImNjNTRlYjVlLWNlZmEtNGY3MC1iNWM4LTJjYjdhMzRiMjEwNCIsImF6cGFjciI6IjIiLCJncm91cHMiOlsiMmQ3ZjFjMGQtNTc4NC00ZjgxLThiYjItOGYzYTc5ZjhmOTQ5Il0sIm5hbWUiOiJMb3RzYmVyZywgTGFycyBBdWd1c3QiLCJvaWQiOiIxMDNmOWFkMi0wZjZiLTQ4OWMtYWQ0NC1iM2NlYmUyNTExZGIiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJMYXJzLkF1Z3VzdC5Mb3RzYmVyZ0BuYXYubm8iLCJyaCI6IjAuQVNBQU5HVTJZc01lWWttSWFadFZOU2VkQzE3clZNejZ6bkJQdGNnc3Q2TkxJUVFnQURrLiIsInNjcCI6ImRlZmF1bHRhY2Nlc3MiLCJzdWIiOiJ5dmRoejk5WEJvdHRHTmRrWE1UWE1BcW43enREU1dKMVEzRDdaWjVSMFpJIiwidGlkIjoiNjIzNjY1MzQtMWVjMy00OTYyLTg4NjktOWI1NTM1Mjc5ZDBiIiwidXRpIjoiTU1VZFduUjFCVS1RN1lXWWtnYXdBQSIsInZlciI6IjIuMCIsIk5BVmlkZW50IjoiTDE1MjQyMyIsImF6cF9uYW1lIjoiZGV2LWdjcDpuYXZkaWc6cG9ydGFsIn0.WapUnABxz22yb6O0B9VCoUEhe9bj6IE9nGd2W_pI3_CVH3KzTSFwR1cZyCpoS5beYMPbEiA49qUVmkfk5-XrYodhtrYRjEM381GNSH2mCsvTIqKjRxm6cCqzRJS81SQPQF-weH97i-hXAxwtG7PvIpgMeNoNM0odbeRp5jSzUCn1oh9Z6xsw66wxx9dGb5pVe6Dq15ki55TH6GdYuQ9k9nPnl7buJzkMSL686myz5Xn-NJqZV0IdD7xUqa2mmUKwaMrxMOfeOd6K4bYSBr_KwECnWES13Fhs2abkDwjU6Yt1jprojzTS1OOAgVGEAG-oARr9RJVS4qu8WaCM29y98A";

    let claims = decodeJwt(accessToken);

    let userInfo = {
                       name: claims.name,
                       navIdent: claims.NAVident
                   }
    res.status(200).json(userInfo);
};

const getAccessTokenFromBearerToken = (bearerToken: String) => {
    const bearerString = "Bearer ";
    return bearerToken.substring(bearerString.length);
}
