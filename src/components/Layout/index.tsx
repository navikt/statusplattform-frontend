import styled from 'styled-components'
import Head from 'next/head'

import Header from 'components/Header'
import Navbar from 'components/Navbar'
import Footer from 'components/Footer'
import { ToastContainer } from 'react-toastify'



const MainContentContainer = styled.div`
    min-height: 100vh;
    margin-bottom: -100px;
    background-color: var(--navGraBakgrunn);
    overflow: hidden;
    font-family: "Source Sans Pro", Arial, sans-serif;
    display: flex;
    flex-direction: column;
`;

const Content = styled.main`
    width: 100%;
    min-height: 100%;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-flow: column wrap;
`;


const MainContent = props => {
    return(
        <MainContentContainer>
            <ToastContainer />
            <Head>
                <link rel="icon" href="/favicon.ico" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta name="description" property="og:description"
                    content="Status digitale tjenester er en tjeneste som viser status for alle Navs tjenester.">
                </meta>
                <meta property="og:image" content="https://www.nav.no/dekoratoren/media/nav-logo-red.svg"></meta>
                <link rel="canonical" href="https://portal.labs.nais.io/Dashboard/Privatperson"></link>
            </Head>
            <Navbar/>
            <Header/>
            <Content>
                {props.children}
            </Content>

            <Footer/>
        </MainContentContainer>
    )
}

export default MainContent