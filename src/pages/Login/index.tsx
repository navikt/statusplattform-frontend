import { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

import { Button, TextField } from '@navikt/ds-react';

import Layout from '../../components/Layout'
import { TitleContext } from '../../components/ContextProviders/TitleContext';
import { RouterOauthLogin } from '../../types/routes';
import CustomNavSpinner from '../../components/CustomNavSpinner';



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
    const [isLoading, setIsLoading] = useState(false)
    const { changeTitle } = useContext(TitleContext)
    
    const router = useRouter()
    
    useEffect(() => {
        setIsLoading(true)
        changeTitle("Logg inn")
        setCurrentLocation(location.hostname)
        setIsLoading(false)
    },[])



    if(isLoading) {
        return (
            <CustomNavSpinner />
        )
    }


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
        router.push(RouterOauthLogin.PATH)
    }





    const { username, password } = citizenLoginCredentials




    return (
        <Layout>
            <LoginContainer>
                <div className="external-login">
                    <h2>Logg inn som borger</h2>
                    <form name="borger" onSubmit={loginCitizen}>
                        <TextField
                            type="text" label="Brukernavn"
                            id="password"
                            onChange={changeUserCredentials("username")}
                            placeholder="Brukernavn" value={username}
                        />
                        <TextField
                            type="text" label="Passord"
                            id="password"
                            onChange={changeUserCredentials("password")}
                            placeholder="Passord" value={password}
                        />
                        <Button type="submit">Logg inn</Button>
                    </form>
                </div>


                
                <div className="separator-wrapper"><span className="vertical-separator"></span></div>



                <div className="nav-login">
                    <h2>Logg inn som Nav-ansatt med SSO</h2>
                    <form name="ansatt">
                        <Button type="button" onClick={handleLogInNavUser}>Logg inn</Button>
                    </form>
                </div>
            </LoginContainer>
        </Layout>
    )
}

export default LoginPage