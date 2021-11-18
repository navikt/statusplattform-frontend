import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

import Layout from 'components/Layout'
import { Knapp } from 'nav-frontend-knapper'
import { Input } from 'nav-frontend-skjema'
import { useRouter } from 'next/router';



const LoginContainer = styled.div`
    margin-top: 2rem;
    padding: 1rem;
    background-color: var(--navBakgrunn);
    border-radius: 5px;
    width: 100%;
    max-width: 768px;
    box-shadow: 0 3px 6px rgb(0 0 0 / 15%);
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-self: center;

    & > * {
        flex-basis: 100%;
        margin: 0 auto;
        max-width: 260px;
    }
    
    .external-login {
        display: flex;
        flex-direction: column;
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

    .separator-wrapper {
        display: none;
    }
    @media(min-width: 820px) {
        padding: 2rem;
        margin-top: 10%;
        flex-direction: row;
        .separator-wrapper {
            display: flex;
            justify-content: center;
            max-width: 20%;
            .vertical-separator {
                display: block;
                border-left: 1px solid grey;
            }
        }
    }
`




const LoginPage = () => {
    const [citizenLoginCredentials, changeCitizenLoginCredentials] = useState<any>({
        username: "",
        password: ""
    })
    const [currentLocation, setCurrentLocation] = useState<string>()

    const router = useRouter()

    useEffect(() => {
        setCurrentLocation(location.hostname)
    },[])



    const changeUserCredentials = (field: keyof typeof citizenLoginCredentials) => (evt: React.ChangeEvent<HTMLInputElement>) => {
        const updatedCitizenCredentials = {
            ...citizenLoginCredentials,
            [field]: evt.target.getAttribute("type") === "number" ? parseInt(evt.target.value) : evt.target.value
        }
        changeCitizenLoginCredentials(updatedCitizenCredentials)
    }

    const loginCitizen = (event) => {
        event.preventDefault()
        toast.info("Ikke implementert")
    }

    const handleLogInNavUser = () => {
        const url = (currentLocation === "localhost" || currentLocation === "127.0.0.1" 
            ? "http://localhost:3000/oauth2/login"
            : "https://digitalstatus.ekstern.dev.nav.no/oauth2/login")
        router.push(url)
    }


    const { username, password } = citizenLoginCredentials
    return (
        <Layout>
            <LoginContainer>
                <div className="external-login">
                    <h2>Logg inn som borger</h2>
                    <form name="borger" onSubmit={loginCitizen}>
                        <Input type="text" label="Brukernavn"
                            id="password"
                            onChange={changeUserCredentials("username")}
                            placeholder="Brukernavn" value={username}>
                        </Input>
                        <Input type="text" label="Passord"
                            id="password"
                            onChange={changeUserCredentials("password")}
                            placeholder="Passord" value={password}>
                        </Input>
                        <Knapp htmlType="submit" mini>Logg inn</Knapp>
                    </form>
                </div>
                
                <div className="separator-wrapper"><span className="vertical-separator"></span></div>

                <div className="nav-login">
                    <h2>Logg inn som Nav-ansatt med SSO</h2>
                    <form name="ansatt">
                        <Knapp htmlType="button" mini onClick={handleLogInNavUser}>Logg inn</Knapp>
                    </form>
                </div>
            </LoginContainer>
        </Layout>
    )
}

export default LoginPage