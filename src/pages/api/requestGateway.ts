import { NextApiRequest, NextApiResponse } from "next";
import { importJWK,jwtVerify , JWK, createRemoteJWKSet } from "jose";




const backendPath = process.env.NEXT_PUBLIC_BACKENDPATH
const CLIENT_ID = process.env.AZURE_APP_CLIENT_ID
const CLIENT_SECRET = process.env.AZURE_APP_CLIENT_SECRET
// const AZURE_APP_JWK = JSON.parse(process.env.AZURE_APP_JWK);
const AZURE_OPENID_CONFIG_ISSUER = process.env.AZURE_OPENID_CONFIG_ISSUER;
const JWKS_URI = process.env.AZURE_OPENID_CONFIG_JWKS_URI;
const ENV = process.env.ENV
const TENANT = process.env.TENANT

const createRequest = (path,method, headers)  => new Request(path, {
    method: method,
    headers: headers
})

export default async (req: NextApiRequest, res: NextApiResponse) => {
    console.log("IN REQUEST GATEWAY")

    //For test/prod:
    let authorizationHeader = req.headers && req.headers.authorization?  req.headers.authorization: "No Authorization header"
    let accessToken = getAccessTokenFromBearerToken(authorizationHeader);


    //For dev:
    //let authorizationHeader = process.env.NEXT_AUTH_TOKEN

    //Kommenter ut dissde for å kjøre lokalt:
    await requestBearerTokenForBackend(accessToken);
    await validateClaimsAndSignature(accessToken);

    let backendEndpath = req.headers.backendendpath
    let method = req.headers.method
    let body = req.headers.body



    let path = backendPath + backendEndpath


    const fetch = require("node-fetch");
    const https = require('https');

    //For dev with local backend:
    //const https = require('http');

    const httpsAgent = new https.Agent({
        rejectUnauthorized: false,
    })


    const resp = await fetch(
        path,
        {
            headers: {'Authorization': authorizationHeader},
            method: method,
            agent: httpsAgent,
            body: body,
        },
      )
    await resp.json()
    .then(body => {
        if (body) {
            console.log("SUCCSESFULLY READ USERDATA")
            res.status(200).json(body)
        }
        else {
            res.send("Cant read userdate")
        }

    })
    .catch(e => {
        console.log(e)
        res.status(resp.status).send(e)
    })
};

const getAccessTokenFromBearerToken = (bearerToken: String) => {
    const bearerString = "Bearer ";
    return bearerToken.substring(bearerString.length);
}


const requestBearerTokenForBackend = async (accessToken: String) => {
    const fetch = require("node-fetch");
    const https = require('https');

    const url = "https://login.microsoftonline.com/"+TENANT+"/oauth2/v2.0/token";
//
    let client_id = CLIENT_ID;
    let client_secret =  CLIENT_SECRET;
    let scope='api://'+ ENV +'-gcp.navdig.portalserver/.default'
    let assertion = accessToken;
    let grant_type= 'urn:ietf:params:oauth:grant-type:jwt-bearer';
    let requested_token_use= 'on_behalf_of';

//     let client_id = 'cc54eb5e-cefa-4f70-b5c8-2cb7a34b2104';
//     let client_secret =  'ZBw8Q~6i8zkHHZD09c8YGqZMBja6ARJMvdW-~bAU';
//     let scope='api://dev-gcp.navdig.portalserver/.default'
//     let assertion = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSJ9.eyJhdWQiOiJjYzU0ZWI1ZS1jZWZhLTRmNzAtYjVjOC0yY2I3YTM0YjIxMDQiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vNjIzNjY1MzQtMWVjMy00OTYyLTg4NjktOWI1NTM1Mjc5ZDBiL3YyLjAiLCJpYXQiOjE2NzA4NDY5MTAsIm5iZiI6MTY3MDg0NjkxMCwiZXhwIjoxNjcwODUxMjk5LCJhaW8iOiJBWFFBaS84VEFBQUFNZU4wVmdzTXlqa2svYk5pa2MrdVh0SFFiQzhCMHNNcERnZDNwOVJJeE95REVselZCQnlXQ0tPNzBCeE5OSlNDMHFRbmgvWHFqd1ZWMHBna2hlelUzMThyZngzK1hkTWJWRmFkcm8zZjVwZ3Fsam5xbGVQVmkvSlFRRGFCa0tmVCtCVUJhdUlDanBraHltZWhRQVJaU0E9PSIsImF6cCI6ImNjNTRlYjVlLWNlZmEtNGY3MC1iNWM4LTJjYjdhMzRiMjEwNCIsImF6cGFjciI6IjIiLCJncm91cHMiOlsiMmQ3ZjFjMGQtNTc4NC00ZjgxLThiYjItOGYzYTc5ZjhmOTQ5Il0sIm5hbWUiOiJMb3RzYmVyZywgTGFycyBBdWd1c3QiLCJvaWQiOiIxMDNmOWFkMi0wZjZiLTQ4OWMtYWQ0NC1iM2NlYmUyNTExZGIiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJMYXJzLkF1Z3VzdC5Mb3RzYmVyZ0BuYXYubm8iLCJyaCI6IjAuQVNBQU5HVTJZc01lWWttSWFadFZOU2VkQzE3clZNejZ6bkJQdGNnc3Q2TkxJUVFnQURrLiIsInNjcCI6ImRlZmF1bHRhY2Nlc3MiLCJzdWIiOiJ5dmRoejk5WEJvdHRHTmRrWE1UWE1BcW43enREU1dKMVEzRDdaWjVSMFpJIiwidGlkIjoiNjIzNjY1MzQtMWVjMy00OTYyLTg4NjktOWI1NTM1Mjc5ZDBiIiwidXRpIjoiZGdsb3cyUXh6RWU2d1lxaTU0S1ZBQSIsInZlciI6IjIuMCIsIk5BVmlkZW50IjoiTDE1MjQyMyIsImF6cF9uYW1lIjoiZGV2LWdjcDpuYXZkaWc6cG9ydGFsIn0.VP1977dr81wHIjUhzZjic3BbSF2-kuvZcDty_ifq1yYDo1810eNil2lctc_rm9mDhWsjDN7rsYSvo2eWA-Eejygc45tiid6lIudJ6zKk1NWI1XDCnRVTUVfvZlUsQMMldymWRLhPrCFOM3CdM1Fcl99ObFl7zy_9aBJDTVUSocKGg0CMntA95cfLhPr5b0Aa2vzjQ-DGWCNOBr6RpXbzeBSgfvtxdP0jwhqwxVDzk8FQq9YZhCkIZegjfBdl3ADlF97m9SYJniskWyletHG8qtWUXuY8Fd61vzx77EKeWO5U1f-OKITHWJyaz4G4c-AlAqUMiJwv36BvuQxtZJJMfw';
//     let grant_type= 'urn:ietf:params:oauth:grant-type:jwt-bearer';
//     let requested_token_use= 'on_behalf_of';

    console.log(assertion);
//

    let body = 'client_id='+client_id+'&'
    +'client_secret='+client_secret+'&'
    +'scope=' +scope+'&'
    +'assertion=' + assertion+'&'+
    'grant_type=' + grant_type + '&'+
    'requested_token_use='+requested_token_use;

    let resp =  await fetch('https://login.microsoftonline.com/nav.no/oauth2/v2.0/token', {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/x-www-form-urlencoded'
                      },
                      body: body
                  });

    console.log(resp.status); // 200

    if(resp.status == 200){
        let data = await resp.text()
        console.log(data)
    }
}
    


const validateClaimsAndSignature = async (accessToken: string) => {

    const JWKS = createRemoteJWKSet(new URL(JWKS_URI))

    const { payload, protectedHeader } = await jwtVerify(accessToken, JWKS, {
    issuer: AZURE_OPENID_CONFIG_ISSUER,
    audience: CLIENT_ID,
    })
    console.log(protectedHeader)
    console.log(payload)

}



//     console.log("In validation: --------")
// //     console.log("jwk: "+ AZURE_APP_JWK)
// //     console.log("ISSUER: " + AZURE_OPENID_CONFIG_ISSUER)
// //     console.log("CLIENT_ID" + CLIENT_ID)
//     let jwkString = '{"use":"sig","kty":"RSA","kid":"FSQBFL4QtZq6gMk_Ih8EN7KAXlE","alg":"RS256","n":"1atG6Xm39IFzBqc2mRxehgeaEKSO-AHfC0-vJGvO2c1bkU-qWGQPLbAksX8MDIfCGd3_m5Wngo9u8nsottUQTBOIzI1hLe2HbYVpEk-KLs1vZgXvBrZ6vf1LNDQyxYGaXQv8K4X-ZFpol88hiYNUSCptlRAk3MjuekNH9x12T5qgiGgBmZ3_b9IOFs_t4LPq-_2wLlTx-po-C8DdVvrP_PowawaAfD8f1E04JRXW3oiBtcpDxQBtOwlied6wXzOmMV2kpIttoANnBcunrXZQvi7vAHl6Yb5acT6V5-XI57aqY_kkCmQxLr1YMpK-1mQxfelTKaHlmVaYjuvOV2bBmQ","e":"AQAB","d":"rkttKP8VQ-pkvkSgkP1HTeXdkz3pMf20yDFUGU2oCpst2rc1qazVhNtu0ytj1MTZXOhunafSYPpH8pzsdVgQVz6IFPQvFZvxITH2p-0iN1N1T6__b2ZjcZ-xPQBneh1iogwoxAgloA7vywY3wUjT85pIkZP9vexaPHmttrLd08g9HOhJVsCu05ZE3pbFoqHhCl9Vx8rZp2q1fH9CMhCtgkzzqsBPJqZGuz1XZNCCXJ9qRlJhauVKv4UTUYfKeHqTHP8EfkBzR16LNEbXSN_F3hlfm76XohQTkBjRxPY7AxPZRLzaTC5L2Q9DBah9H8aXjcYAGajOVM2oTSW8TlRcQQ","p":"513M-7kjzqpQ0wgdS7MNbtYZuwJym3TAQ6Tz3Gq4i0wUrAt8Mi434Ww97D9i0RreELGiSu2ZX_TfL4HYlLIXibKYAvd-3QalXH41u_0ln5qTMxxRP2sIqobHc4pYOUEVPVxUHGmiipeI5lNmqbm-yjdgAtaPtxNrX0h_XPZF0P0","q":"7Gscej6_AU4qvvOE7gYAuTE1f2nnRd3iRIiHP8gZvUrs4dRYNS3XhfXhHxqMDAqk1aBldZHINv0cQpsIceiUXYH16bXChnyDDfHdPCh-vtNaxdiifxy7mRoetUWhBbGhdmmq0a8Ux_rjoa1QuxqFdPghKWd3Wxtreh5rUzEMM80","dp":"TgxaheAisCjMMyRdnZe9RFJ9Q5TDzKVJ5ofSq9xkfLkhkBgfwV3OBAFbskJ_t0J0_vStZtFYGAKm94O56A9b2Vuh4_5RkYYYamc5AT2YX4rpdShsUBRvS_dDeTqGIGpQG-71gNAxwMb1q50e2MqMDfM4NDzlJkEqy23NaTK6wpE","dq":"aBsmmCInQ_Di2-EqKRJVoTctIqVE5Tw21gz02b5Ir1VeCHfUO96q6F-EuYicIPVS7otKAkKm0qgUmLPiPR64rpB69GZIeaY8o5hc3o_KeEdj0nl53NWPOnUJDrPRm0tEGXugb-NUGFe_g0NpqGqeWAqnt67LHUBuzIC2rBSOFgU","qi":"HZiCEK0fhyJz3KCLRadL1bh_x0CUvNrIDxvawGUq6lMwkLj7daHIvEfMu4PKZwcizI4pcxx3sZ8curMIed_F-hqJeiZb-H774yC4CYIaTKf8F3GmHlmZHXbHTG7zlfM9vpW8dplmf4jg9zJAoGfh0R8JBGhOPRBor3x1J_RC1ZY","x5c":["MIID8DCCAtigAwIBAgIBATANBgkqhkiG9w0BAQsFADCBnzELMAkGA1UEBhMCTk8xDTALBgNVBAgTBE9zbG8xDTALBgNVBAcTBE9zbG8xLjAsBgNVBAoTJU5BViAoQXJiZWlkcy0gb2cgdmVsZmVyZHNkaXJla3RvcmF0ZXQxDzANBgNVBAsTBk5BViBJVDExMC8GA1UEAxMocG9ydGFsLm5hdmRpZy5kZXYtZ2NwLmF6dXJlcmF0b3IubmFpcy5pbzAeFw0yMjEyMDUxMTUwMzhaFw0yMzEyMDUxMTUwMzhaMIGfMQswCQYDVQQGEwJOTzENMAsGA1UECBMET3NsbzENMAsGA1UEBxMET3NsbzEuMCwGA1UEChMlTkFWIChBcmJlaWRzLSBvZyB2ZWxmZXJkc2RpcmVrdG9yYXRldDEPMA0GA1UECxMGTkFWIElUMTEwLwYDVQQDEyhwb3J0YWwubmF2ZGlnLmRldi1nY3AuYXp1cmVyYXRvci5uYWlzLmlvMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1atG6Xm39IFzBqc2mRxehgeaEKSO+AHfC0+vJGvO2c1bkU+qWGQPLbAksX8MDIfCGd3/m5Wngo9u8nsottUQTBOIzI1hLe2HbYVpEk+KLs1vZgXvBrZ6vf1LNDQyxYGaXQv8K4X+ZFpol88hiYNUSCptlRAk3MjuekNH9x12T5qgiGgBmZ3/b9IOFs/t4LPq+/2wLlTx+po+C8DdVvrP/PowawaAfD8f1E04JRXW3oiBtcpDxQBtOwlied6wXzOmMV2kpIttoANnBcunrXZQvi7vAHl6Yb5acT6V5+XI57aqY/kkCmQxLr1YMpK+1mQxfelTKaHlmVaYjuvOV2bBmQIDAQABozUwMzAOBgNVHQ8BAf8EBAMCB4AwEwYDVR0lBAwwCgYIKwYBBQUHAwIwDAYDVR0TAQH/BAIwADANBgkqhkiG9w0BAQsFAAOCAQEAId1rIwsRuGwYkkQw1noIO7dStiZkDTrrUPOoTDRv2nNzZtIdlinPZeAOJ2FJHrS+7PzNQ5DPHxpbFaRTZyXNarzOK1SZv51y7NqNDbhjWlWy1w8HPURSI4V3yGY+0H2fjAFq9RAq/WOamePNrnMfvjWloJCe+kEaj6E4OwiteROhYL0wP6bbby11BHaJAPcwKcdS7kNtNdlIqI93rTnGPUJ1H/AIlgAMZwV9e536ZXMpdolqVRQH+U5DTCU/INZQmq6uAAm9EP9IeOp/HLua2I3J8pXGUBuwnL2535C0/pSdZu9BMVTra+hVFBiPkd2nxToH9oiGTleCsXzlUqN/jQ=="],"x5t":"FSQBFL4QtZq6gMk_Ih8EN7KAXlE","x5t#S256":"RMXh3ic6EYk3TN5JifpwFLndoeOSI8jl_utLjWLViFA"}';
//     let jwkJson = JSON.parse(jwkString)
//     let issuer = 'https://login.microsoftonline.com/62366534-1ec3-4962-8869-9b5535279d0b/v2.0';
//     let client_id = 'cc54eb5e-cefa-4f70-b5c8-2cb7a34b2104';
//     const alg = 'RS256'
//     const jwk : JWK = {...jwkJson};
//     const publicKey = await importJWK(jwk, alg)
//     console.log(publicKey)
//     const jwt:string = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSJ9.eyJhdWQiOiJjYzU0ZWI1ZS1jZWZhLTRmNzAtYjVjOC0yY2I3YTM0YjIxMDQiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vNjIzNjY1MzQtMWVjMy00OTYyLTg4NjktOWI1NTM1Mjc5ZDBiL3YyLjAiLCJpYXQiOjE2NzA4NDY5MTAsIm5iZiI6MTY3MDg0NjkxMCwiZXhwIjoxNjcwODUxMjk5LCJhaW8iOiJBWFFBaS84VEFBQUFNZU4wVmdzTXlqa2svYk5pa2MrdVh0SFFiQzhCMHNNcERnZDNwOVJJeE95REVselZCQnlXQ0tPNzBCeE5OSlNDMHFRbmgvWHFqd1ZWMHBna2hlelUzMThyZngzK1hkTWJWRmFkcm8zZjVwZ3Fsam5xbGVQVmkvSlFRRGFCa0tmVCtCVUJhdUlDanBraHltZWhRQVJaU0E9PSIsImF6cCI6ImNjNTRlYjVlLWNlZmEtNGY3MC1iNWM4LTJjYjdhMzRiMjEwNCIsImF6cGFjciI6IjIiLCJncm91cHMiOlsiMmQ3ZjFjMGQtNTc4NC00ZjgxLThiYjItOGYzYTc5ZjhmOTQ5Il0sIm5hbWUiOiJMb3RzYmVyZywgTGFycyBBdWd1c3QiLCJvaWQiOiIxMDNmOWFkMi0wZjZiLTQ4OWMtYWQ0NC1iM2NlYmUyNTExZGIiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJMYXJzLkF1Z3VzdC5Mb3RzYmVyZ0BuYXYubm8iLCJyaCI6IjAuQVNBQU5HVTJZc01lWWttSWFadFZOU2VkQzE3clZNejZ6bkJQdGNnc3Q2TkxJUVFnQURrLiIsInNjcCI6ImRlZmF1bHRhY2Nlc3MiLCJzdWIiOiJ5dmRoejk5WEJvdHRHTmRrWE1UWE1BcW43enREU1dKMVEzRDdaWjVSMFpJIiwidGlkIjoiNjIzNjY1MzQtMWVjMy00OTYyLTg4NjktOWI1NTM1Mjc5ZDBiIiwidXRpIjoiZGdsb3cyUXh6RWU2d1lxaTU0S1ZBQSIsInZlciI6IjIuMCIsIk5BVmlkZW50IjoiTDE1MjQyMyIsImF6cF9uYW1lIjoiZGV2LWdjcDpuYXZkaWc6cG9ydGFsIn0.VP1977dr81wHIjUhzZjic3BbSF2-kuvZcDty_ifq1yYDo1810eNil2lctc_rm9mDhWsjDN7rsYSvo2eWA-Eejygc45tiid6lIudJ6zKk1NWI1XDCnRVTUVfvZlUsQMMldymWRLhPrCFOM3CdM1Fcl99ObFl7zy_9aBJDTVUSocKGg0CMntA95cfLhPr5b0Aa2vzjQ-DGWCNOBr6RpXbzeBSgfvtxdP0jwhqwxVDzk8FQq9YZhCkIZegjfBdl3ADlF97m9SYJniskWyletHG8qtWUXuY8Fd61vzx77EKeWO5U1f-OKITHWJyaz4G4c-AlAqUMiJwv36BvuQxtZJJMfw';
//
//     const { payload, protectedHeader } = await jwtVerify(jwt, publicKey, {
//     issuer: issuer,
//     audience: client_id,
//     })
//
//     console.log(protectedHeader)
//     console.log(payload)
//     console.log("----------------------")