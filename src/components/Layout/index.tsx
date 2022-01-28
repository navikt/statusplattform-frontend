import Link from 'next/link'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { useContext } from 'react'

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'

import Footer from '../../components/Footer'
import Header from '../../components/Header'
import Navbar from '../../components/Navbar'
import { NavigatorContext } from '../ContextProviders/NavigatorContext'

import { BodyShort, Heading } from '@navikt/ds-react'
import { Home, Next } from '@navikt/ds-icons'
import { TitleContext } from '../ContextProviders/TitleContext'





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
                        color: white;
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
    min-height: 100%;
    margin: 0 10px 2rem;
    white-space: pre-wrap;
    
    h1 {
        text-align: center;
    }

    display: flex;
    flex-flow: column wrap;
    align-items: center;
    justify-content: center;

    @media(min-width: 400px) {
        h1 {
            text-align: left;
        }
    }
`;


const MainContent = props => {
    const { title } = useContext(TitleContext)
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
                <Navigator />
                <PageHeader title={title} />
                {props.children}
            </Content>

            <Footer/>
        </MainContentContainer>
    )
}

export default MainContent




const NavigatorContainer = styled.div`
    width: 100%;
    left: 0;
    padding: 0.75rem 1rem;

    display: flex;
    flex-flow: row wrap;

    .navigator-element {
        width: max-content;

        display: flex;

        .navds-link {
            margin: .25rem .25rem .25rem 0;

            :hover {
                cursor: pointer;
            }
        }

        .home-svg {
            margin-right: 12px;
            
            svg {
                color: black;
            }
        }

        .navds-chevron {
            color: #78706a;
            margin: 0 12px;

            display: flex;
            align-items: center;
        }
    }

    h1 {
        text-align: center;
        margin-bottom: 32px !important;
    }
`


const Navigator = () => {
    const { navigatorRoutes } = useContext(NavigatorContext)

    const router = useRouter()

    const handleNavigatorRedirect = (path) => {
        if(path == "/Dashboard") {
            router.push("/")
        }
        else if (path =="/Tjenestedata") {
            router.push("/")
        }
        else {
            router.push(path)
        }
    }


    return (
        <NavigatorContainer>

            {navigatorRoutes.map((element, index) =>    
                <BodyShort key={index} className="navigator-element">
                    <span aria-label={"Naviger til " + element.stringifiedPathName} onClick={() => handleNavigatorRedirect(element.path)} className="navds-link">
                        {element.home &&
                            <span className="home-svg">
                                <Home /> 
                            </span>
                        }
                        {element.stringifiedPathName}
                    </span>
                    {!element.lastElement &&
                        <span className="navds-chevron">
                            <Next />
                        </span>
                    }
                </BodyShort>
            )}
        </NavigatorContainer>
    )
}


const PageHeader: React.FC<{title: string}> = ({title}) => {

    return (
        <Heading spacing size="2xlarge" level="1">
            {title}
        </Heading>
    )
}