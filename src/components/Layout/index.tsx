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
                <title>Navstatus</title>
                <meta name="title" content="Navstatus" />
                <meta name="description" content="" />

                {/* <!-- Open Graph / Facebook --> */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://portal.labs.nais.io/" />
                <meta property="og:title" content="Navstatus" />
                <meta property="og:description" content="" />
                <meta property="og:image" content="" />

                {/* <!-- Twitter --> */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content="https://portal.labs.nais.io/" />
                <meta property="twitter:title" content="Navstatus" />
                <meta property="twitter:description" content="" />
                <meta property="twitter:image" content="" />
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