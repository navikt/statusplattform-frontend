import Link from 'next/link'
import styled from 'styled-components'

import { ToastContainer } from 'react-toastify'

import Footer from '../../components/Footer'
import Header from '../../components/Header'
import Navbar from '../../components/Navbar'
import { useRouter } from 'next/router'

import 'react-toastify/dist/ReactToastify.css';
import { BodyShort, Heading } from '@navikt/ds-react'
import { Home, Next } from '@navikt/ds-icons'
import { addListener } from 'process'




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

const NavLink = styled(Link)


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
                <PageHeader />
                {props.children}
            </Content>

            <Footer/>
        </MainContentContainer>
    )
}

export default MainContent




const PageHeaderContainer = styled.div`
    .navigator {
        display: flex;
        align-items: center;
        flex-flow: row wrap;

        width: 100vw;
        padding: 0.75rem 1rem;
        
        span {
            display: flex;
            align-items: center;
        }

        .home-svg {
            margin-right: 12px;
            color: black;
        }

        .navds-chevron {
            color: #78706a;
        }
    }

    h1 {
        text-align: center;
        margin-bottom: 32px !important;
    }
`


const PageHeader = () => {
    const router = useRouter()
    let pageTitle = "Status digitale tjenester"


    /*Consider changing this solution to rather use React Context as its cleaner and allows usability in other components, should they need it*/
    const currentRoute = router.asPath

    switch(currentRoute) {
        case "/Admin/NewDashboard":
            pageTitle = "Opprett nytt dashbord"
            break
        case "/Admin/NewOmraade":
            pageTitle = "Opprett nytt område"
            break
        case "/Admin/NewTjeneste":
            pageTitle = "Opprett ny tjeneste"
            break
        default:
            pageTitle = "Status digitale tjenester"
            break
    }

    return (
        <PageHeaderContainer>
            <BodyShort className="navigator">
                <a href="/" className="navds-link">
                    <Home className="home-svg"/> Status digitale tjenester
                </a> 
                {router.asPath.includes("Admin") &&
                    <span>
                        <Next className="navds-chevron" /> <a href="/">Admin</a>
                    </span>
                }
            </BodyShort>
            <Heading spacing size="2xlarge" level="1">
                {pageTitle}
            </Heading>
        </PageHeaderContainer>
    )
}