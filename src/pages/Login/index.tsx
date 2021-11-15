import styled from 'styled-components'

import Layout from 'components/Layout'
import { Knapp } from 'nav-frontend-knapper'
import { Input } from 'nav-frontend-skjema'
import { useState } from 'react'



const LoginContainer = styled.div`
    margin-top: 2rem;
    padding: 1rem;
    background-color: var(--navBakgrunn);
    border-radius: 5px;
    width: 100%;
    max-width: 768px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .external-login {
        display: flex;
        flex-direction: column;
    }


    .vertical-separator {
            display: none;
        }

    .nav-login {
        display: flex;
        flex-direction: column;
    }
    form {
        & > * {
            margin: 1rem 0;
        }
    }
    input {
        max-width: 300px;
    }

    button {
        white-space: normal;
        word-wrap: break-word;
    }

    @media(min-width: 820px) {
        padding: 2rem;
        flex-direction: row;
        .vertical-separator {
            display: block;
            border-left: 1px solid grey;
            margin: 0 5rem;
        }
    }
`




const LoginPage = () => {
    const [citizenLoginCredentials, changeCitizenLoginCredentials] = useState<any>({
        username: "",
        password: ""
    })

    const changeUserCredentials = (field: keyof typeof citizenLoginCredentials) => (evt: React.ChangeEvent<HTMLInputElement>) => {
        const updatedCitizenCredentials = {
            ...citizenLoginCredentials,
            [field]: evt.target.getAttribute("type") === "number" ? parseInt(evt.target.value) : evt.target.value
        }
        changeCitizenLoginCredentials(updatedCitizenCredentials)
    }

    const loginCitizen = (event) => {
        console.log(event.preventDefault())
    }


    return (
        <Layout>
            <LoginContainer>
                <div className="external-login">
                    <h2>Logg inn som borger</h2>
                    <form onSubmit={loginCitizen}>
                        <Input onChange={changeUserCredentials("username")} placeholder="Brukernavn"></Input>
                        <Input onChange={changeUserCredentials("password")} placeholder="Passord"></Input>
                        <Knapp htmlType="submit" mini>Logg inn</Knapp>
                    </form>
                </div>
                
                <span className="vertical-separator"></span>

                <div className="nav-login">
                    <h2>Logg inn som Nav-ansatt med SSO</h2>
                    <form>
                        <a href="https://digitalstatus.ekstern.dev.nav.no/rest/oauth2">
                            <Knapp htmlType="button" mini>Logg inn</Knapp>
                        </a>
                    </form>
                </div>
            </LoginContainer>
        </Layout>
    )
}

export default LoginPage