import { jwtVerify, createRemoteJWKSet } from "jose"

const CLIENT_ID = process.env.AZURE_APP_CLIENT_ID
const CLIENT_SECRET = process.env.AZURE_APP_CLIENT_SECRET

const AZURE_OPENID_CONFIG_ISSUER = process.env.AZURE_OPENID_CONFIG_ISSUER
const JWKS_URI = process.env.AZURE_OPENID_CONFIG_JWKS_URI
const ENV = process.env.ENV
const TENANT = process.env.TENANT

export const validateClaimsAndSignature = async (accessToken: string) => {
    const JWKS = createRemoteJWKSet(new URL(JWKS_URI))
    try {
        const { payload, protectedHeader } = await jwtVerify(
            accessToken,
            JWKS,
            {
                issuer: AZURE_OPENID_CONFIG_ISSUER,
                audience: CLIENT_ID,
            }
        )
        return true
    } catch (exception) {
        return false
    }
}

export const requestBearerTokenForBackend = async (accessToken: String) => {
    //const fetch = require("node-fetch")
    const https = require("https")

    const url =
        "https://login.microsoftonline.com/" + TENANT + "/oauth2/v2.0/token"

    let client_id = CLIENT_ID
    let client_secret = CLIENT_SECRET
    let scope = "api://" + ENV + "-gcp.navdig.portalserver/.default"
    let assertion = accessToken
    let grant_type = "urn:ietf:params:oauth:grant-type:jwt-bearer"
    let requested_token_use = "on_behalf_of"

    let body =
        "client_id=" +
        client_id +
        "&" +
        "client_secret=" +
        client_secret +
        "&" +
        "scope=" +
        scope +
        "&" +
        "assertion=" +
        assertion +
        "&" +
        "grant_type=" +
        grant_type +
        "&" +
        "requested_token_use=" +
        requested_token_use

    let resp = await fetch(
        "https://login.microsoftonline.com/nav.no/oauth2/v2.0/token",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: body,
        }
    )

    if (resp.status == 200) {
        let data = await resp.text()
        return data
    } else {
        return " "
    }
}

export const getAccessTokenFromBearerToken = (bearerToken: String) => {
    const bearerString = "Bearer "
    return bearerToken.substring(bearerString.length)
}

export const requestBearerTokenForShoutOutAPI = async (accessToken: String) => {
    //const fetch = require("node-fetch")
    const https = require("https")

    const url =
        "https://login.microsoftonline.com/" + TENANT + "/oauth2/v2.0/token"

    let client_id = CLIENT_ID
    let client_secret = CLIENT_SECRET
    let scope = "api://" + ENV + "-gcp.shout-out.shout-out-api/.default"
    let assertion = accessToken
    let grant_type = "urn:ietf:params:oauth:grant-type:jwt-bearer"
    let requested_token_use = "on_behalf_of"

    let body =
        "client_id=" +
        client_id +
        "&" +
        "client_secret=" +
        client_secret +
        "&" +
        "scope=" +
        scope +
        "&" +
        "assertion=" +
        assertion +
        "&" +
        "grant_type=" +
        grant_type +
        "&" +
        "requested_token_use=" +
        requested_token_use

    let resp = await fetch(
        "https://login.microsoftonline.com/nav.no/oauth2/v2.0/token",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: body,
        }
    )

    if (resp.status == 200) {
        let data = await resp.text()
        return data
    } else {
        return " "
    }
}
