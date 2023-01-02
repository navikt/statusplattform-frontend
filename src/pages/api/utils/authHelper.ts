

import { importJWK,jwtVerify , JWK, createRemoteJWKSet } from "jose";
const CLIENT_ID = process.env.AZURE_APP_CLIENT_ID
const CLIENT_SECRET = process.env.AZURE_APP_CLIENT_SECRET

const AZURE_OPENID_CONFIG_ISSUER = process.env.AZURE_OPENID_CONFIG_ISSUER;
const JWKS_URI = process.env.AZURE_OPENID_CONFIG_JWKS_URI;
const ENV = process.env.ENV
const TENANT = process.env.TENANT


export const validateClaimsAndSignature = async (accessToken: string) => {
    console.log("--------------------------------")
    console.log("In validate claims and signature ")
    console.log("AccessToken : "  + accessToken)
    console.log("--------------------------------")
    console.log("JWKS_URI : " + JWKS_URI)
    console.log("--------------------------------")
    console.log("AZURE_OPENID_CONFIG_ISSUER : " + AZURE_OPENID_CONFIG_ISSUER)
    console.log("--------------------------------")
    console.log("CLIENT_ID : " + CLIENT_ID)

    //let jwkUri = "https://login.microsoftonline.com/62366534-1ec3-4962-8869-9b5535279d0b/discovery/v2.0/keys";
    //accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyJ9.eyJhdWQiOiJjYzU0ZWI1ZS1jZWZhLTRmNzAtYjVjOC0yY2I3YTM0YjIxMDQiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vNjIzNjY1MzQtMWVjMy00OTYyLTg4NjktOWI1NTM1Mjc5ZDBiL3YyLjAiLCJpYXQiOjE2NzExODQ2NDgsIm5iZiI6MTY3MTE4NDY0OCwiZXhwIjoxNjcxMTg5Mzc1LCJhaW8iOiJBWFFBaS84VEFBQUF1U2thZ0VKSnZzbTJSbTU1bXd1dkVyeDZuZ1o3YUdlVFZKd0s2RTllNis5OFRhQVlTaFFtam5VQVJwckdlNzFCOU1oOUVPVEZDYzhKQ2VSWjlzenNoQ2ZqZGloOHFJdGcwS2MvS1RVQWlLcHFldVJ0NjNWMzFLZnB1N3Z2Q1QrcXlQeXlXRnNRcXRzY0ZQbFcwRk1HQlE9PSIsImF6cCI6ImNjNTRlYjVlLWNlZmEtNGY3MC1iNWM4LTJjYjdhMzRiMjEwNCIsImF6cGFjciI6IjIiLCJncm91cHMiOlsiMmQ3ZjFjMGQtNTc4NC00ZjgxLThiYjItOGYzYTc5ZjhmOTQ5Il0sIm5hbWUiOiJMb3RzYmVyZywgTGFycyBBdWd1c3QiLCJvaWQiOiIxMDNmOWFkMi0wZjZiLTQ4OWMtYWQ0NC1iM2NlYmUyNTExZGIiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJMYXJzLkF1Z3VzdC5Mb3RzYmVyZ0BuYXYubm8iLCJyaCI6IjAuQVNBQU5HVTJZc01lWWttSWFadFZOU2VkQzE3clZNejZ6bkJQdGNnc3Q2TkxJUVFnQURrLiIsInNjcCI6ImRlZmF1bHRhY2Nlc3MiLCJzdWIiOiJ5dmRoejk5WEJvdHRHTmRrWE1UWE1BcW43enREU1dKMVEzRDdaWjVSMFpJIiwidGlkIjoiNjIzNjY1MzQtMWVjMy00OTYyLTg4NjktOWI1NTM1Mjc5ZDBiIiwidXRpIjoiMHVIOVloRFgwazJucXBLb1dWQTZBQSIsInZlciI6IjIuMCIsIk5BVmlkZW50IjoiTDE1MjQyMyIsImF6cF9uYW1lIjoiZGV2LWdjcDpuYXZkaWc6cG9ydGFsIn0.PIx6jtQvVtZn_Ag4vw1BGdZhZCE8b49ALyU9u3YrFGZIDKH_3zfy_5sX7DFuddGQgAy5YcVb8Luvje0ZRX6NNaKccrSZxCwpFCqcLEm10JtfieaJi2tICIqXIR5EZgIuF83Gaf5ZwZGxaP5ru9Ps7Ot8J4C3OrkktRwcrIHJMWSpH9vzopXvy12gL2nJlV480Wfn7Ei1h5318xs2RlB8O_EKAVHqE-uujyhoN-LY4otv4u57uQPcerMZmxMfx423EqhjQzqxuoEfZ9a7EVfpzvAId9S_GhHoHPD3SqqPiVwqB3Ol-zqoQMENgZU4hiVzn6Gw9Uc2-brBGS4vB4V6Lg";
    //let accessTokenNotValid = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSJ9.eyJhdWQiOiJjYzU0ZWI1ZS1jZWZhLTRmNzAtYjVjOC0yY2I3YTM0YjIxMDQiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vNjIzNjY1MzQtMWVjMy00OTYyLTg4NjktOWI1NTM1Mjc5ZDBiL3YyLjAiLCJpYXQiOjE2NzA0OTc3NTksIm5iZiI6MTY3MDQ5Nzc1OSwiZXhwIjoxNjcwNTAzNDI1LCJhaW8iOiJBWFFBaS84VEFBQUFRTkVXNmdBbzlFSzNrN2ZuazVKdG1IZno5OFpWazB3ZHNPSzFBR2F0Q2hvMDVZeHRRN05WWDh1cFhmM0FDL3p2Y3N1MzhxalA4NXd4VkNkRStWV0F0dS9MaWkyZ1ZZejhzaWtxSXB6ckllcGt2eGt3L2E2M1N2Ujh6MXU3dkxiSGd4RlJoc0IydEZJREZ2blVkaWtoUUE9PSIsImF6cCI6ImNjNTRlYjVlLWNlZmEtNGY3MC1iNWM4LTJjYjdhMzRiMjEwNCIsImF6cGFjciI6IjIiLCJncm91cHMiOlsiMmQ3ZjFjMGQtNTc4NC00ZjgxLThiYjItOGYzYTc5ZjhmOTQ5Il0sIm5hbWUiOiJMb3RzYmVyZywgTGFycyBBdWd1c3QiLCJvaWQiOiIxMDNmOWFkMi0wZjZiLTQ4OWMtYWQ0NC1iM2NlYmUyNTExZGIiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJMYXJzLkF1Z3VzdC5Mb3RzYmVyZ0BuYXYubm8iLCJyaCI6IjAuQVNBQU5HVTJZc01lWWttSWFadFZOU2VkQzE3clZNejZ6bkJQdGNnc3Q2TkxJUVFnQURrLiIsInNjcCI6ImRlZmF1bHRhY2Nlc3MiLCJzdWIiOiJ5dmRoejk5WEJvdHRHTmRrWE1UWE1BcW43enREU1dKMVEzRDdaWjVSMFpJIiwidGlkIjoiNjIzNjY1MzQtMWVjMy00OTYyLTg4NjktOWI1NTM1Mjc5ZDBiIiwidXRpIjoiUkVYMkRCLXZoRVM0ZWx5Q28wdkZBQSIsInZlciI6IjIuMCIsIk5BVmlkZW50IjoiTDE1MjQyMyIsImF6cF9uYW1lIjoiZGV2LWdjcDpuYXZkaWc6cG9ydGFsIn0.frdzl896MV0qG8u1bpfSqRFn75EdalN5wSR4zT4KWMAONbjp4mfycAWJnsaNlaBNE_BGfIcj3nESsIffJtvT-vsUnKxQg2LdoZtw0N99fQlpc5Hq_YzfVGlVZSpt3lO6SwBRYTNfNsbCYhoQvE0PBojvsIvcn6mMLEM9pyAg3TbDR99y9CY-CP9DVvmU4OxMnpijs1Clm17vvCg0pfdWFTTCVOWtld0Lxg8WcxIJN62WTq_t7Y0aonFVK898xY-RbdD0MP5yA32KvmLOx48xoDTSuSFmo6c-kH_3kl1oTCDIodNN3rVBQr5Mt5BJshhvesBxA6MLpfRIckK2VkHpCg";
    //let issuer = "https://login.microsoftonline.com/62366534-1ec3-4962-8869-9b5535279d0b/v2.0";
    //let client_id = "cc54eb5e-cefa-4f70-b5c8-2cb7a34b2104";

    const JWKS = createRemoteJWKSet(new URL(JWKS_URI))
    try{
        const { payload, protectedHeader } = await jwtVerify(accessToken, JWKS, {
        issuer: AZURE_OPENID_CONFIG_ISSUER,
        audience: CLIENT_ID,
        })
        return true;
    }
    catch(exception){
        return false;
    }
}

const requestBearerTokenForBackend = async (accessToken: String) => {
    const fetch = require("node-fetch");
    const https = require('https');

    const url = "https://login.microsoftonline.com/"+TENANT+"/oauth2/v2.0/token";

    let client_id = CLIENT_ID;
    let client_secret =  CLIENT_SECRET;
    let scope='api://'+ ENV +'-gcp.navdig.portalserver/.default'
    let assertion = accessToken;
    let grant_type= 'urn:ietf:params:oauth:grant-type:jwt-bearer';
    let requested_token_use= 'on_behalf_of';


    /*
     let client_id = 'cc54eb5e-cefa-4f70-b5c8-2cb7a34b2104';
     let client_secret =  'ZBw8Q~6i8zkHHZD09c8YGqZMBja6ARJMvdW-~bAU';
     let scope='api://dev-gcp.navdig.portalserver/.default'
     let assertion = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyJ9.eyJhdWQiOiJjYzU0ZWI1ZS1jZWZhLTRmNzAtYjVjOC0yY2I3YTM0YjIxMDQiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vNjIzNjY1MzQtMWVjMy00OTYyLTg4NjktOWI1NTM1Mjc5ZDBiL3YyLjAiLCJpYXQiOjE2NzExODQ2NDgsIm5iZiI6MTY3MTE4NDY0OCwiZXhwIjoxNjcxMTg5Mzc1LCJhaW8iOiJBWFFBaS84VEFBQUF1U2thZ0VKSnZzbTJSbTU1bXd1dkVyeDZuZ1o3YUdlVFZKd0s2RTllNis5OFRhQVlTaFFtam5VQVJwckdlNzFCOU1oOUVPVEZDYzhKQ2VSWjlzenNoQ2ZqZGloOHFJdGcwS2MvS1RVQWlLcHFldVJ0NjNWMzFLZnB1N3Z2Q1QrcXlQeXlXRnNRcXRzY0ZQbFcwRk1HQlE9PSIsImF6cCI6ImNjNTRlYjVlLWNlZmEtNGY3MC1iNWM4LTJjYjdhMzRiMjEwNCIsImF6cGFjciI6IjIiLCJncm91cHMiOlsiMmQ3ZjFjMGQtNTc4NC00ZjgxLThiYjItOGYzYTc5ZjhmOTQ5Il0sIm5hbWUiOiJMb3RzYmVyZywgTGFycyBBdWd1c3QiLCJvaWQiOiIxMDNmOWFkMi0wZjZiLTQ4OWMtYWQ0NC1iM2NlYmUyNTExZGIiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJMYXJzLkF1Z3VzdC5Mb3RzYmVyZ0BuYXYubm8iLCJyaCI6IjAuQVNBQU5HVTJZc01lWWttSWFadFZOU2VkQzE3clZNejZ6bkJQdGNnc3Q2TkxJUVFnQURrLiIsInNjcCI6ImRlZmF1bHRhY2Nlc3MiLCJzdWIiOiJ5dmRoejk5WEJvdHRHTmRrWE1UWE1BcW43enREU1dKMVEzRDdaWjVSMFpJIiwidGlkIjoiNjIzNjY1MzQtMWVjMy00OTYyLTg4NjktOWI1NTM1Mjc5ZDBiIiwidXRpIjoiMHVIOVloRFgwazJucXBLb1dWQTZBQSIsInZlciI6IjIuMCIsIk5BVmlkZW50IjoiTDE1MjQyMyIsImF6cF9uYW1lIjoiZGV2LWdjcDpuYXZkaWc6cG9ydGFsIn0.PIx6jtQvVtZn_Ag4vw1BGdZhZCE8b49ALyU9u3YrFGZIDKH_3zfy_5sX7DFuddGQgAy5YcVb8Luvje0ZRX6NNaKccrSZxCwpFCqcLEm10JtfieaJi2tICIqXIR5EZgIuF83Gaf5ZwZGxaP5ru9Ps7Ot8J4C3OrkktRwcrIHJMWSpH9vzopXvy12gL2nJlV480Wfn7Ei1h5318xs2RlB8O_EKAVHqE-uujyhoN-LY4otv4u57uQPcerMZmxMfx423EqhjQzqxuoEfZ9a7EVfpzvAId9S_GhHoHPD3SqqPiVwqB3Ol-zqoQMENgZU4hiVzn6Gw9Uc2-brBGS4vB4V6Lg';
     let grant_type= 'urn:ietf:params:oauth:grant-type:jwt-bearer';
     let requested_token_use= 'on_behalf_of';
        */
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
        return data
    }
    else {
        return " "
    }
}