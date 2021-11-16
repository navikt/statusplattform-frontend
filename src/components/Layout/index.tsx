import Link from 'next/link'
import styled from 'styled-components'

import { ToastContainer } from 'react-toastify'

import Footer from 'components/Footer'
import Header from 'components/Header'
import Navbar from 'components/Navbar'
import { useRouter } from 'next/router'
import { useEffect } from 'react'




const MainContentContainer = styled.div`
    min-height: 100vh;
    margin-bottom: -100px;
    background-color: var(--navGraBakgrunn);
    overflow: hidden;
    font-family: "Source Sans Pro", Arial, sans-serif;
    display: flex;
    flex-direction: column;


    .skip-links {
        background-color: var(--navBla);
        padding: 0.5rem;
        color: white;
        height: 2.75rem;
        width: 120px;
        transform: translateY(-100%);
        position: absolute;
        ul {
            list-style: none;
            li {
                overflow: hidden;
                left: 1rem;
                top: 25%;
                position: absolute;
                a {
                    opacity: 0;
                    :focus {
                        overflow: visible;
                        opacity: 1;
                    }
                }
            }
        }
        :focus-within {
            transform: translateY(0%);
        }
    }
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
    const router = useRouter()
    let currentPath = router.asPath
    currentPath = currentPath.includes("#") ? currentPath.substring(0, currentPath.indexOf("#")) : currentPath    



    return(
        <MainContentContainer>
            <ToastContainer />
            <nav className="skip-links" >
                <ul>
                    <li>
                        <Link href={currentPath + "#menu-container"} replace={true}>Hovedmeny</Link>
                    </li>
                    <li>
                        <Link href={currentPath + "#content"} replace={true}>Innhold</Link>
                    </li>
                </ul>
            </nav>
            {!router.pathname.includes("Login") &&
                <div>
                    <Navbar/>
                    <Header/>
                </div>
            }
            <Content id="content">
                {props.children}
            </Content>

            <Footer/>
        </MainContentContainer>
    )
}

export default MainContent