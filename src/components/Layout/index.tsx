import Link from "next/link"
import styled from "styled-components"
import { useContext, useEffect } from "react"
import { useRouter } from "next/router"

import { BodyShort, Button, Heading } from "@navikt/ds-react"
import { Clock, Home, Next } from "@navikt/ds-icons"

import Footer from "../../components/Footer"
import Header from "../../components/Header"
import Navbar from "../../components/Navbar"
import { TitleContext } from "../ContextProviders/TitleContext"
import { RouterHomePage } from "../../types/routes"

import "react-toastify/dist/ReactToastify.css"
import { ToastContainer } from "react-toastify"

const MainContentContainer = styled.div`
    min-height: 100vh;
    margin-bottom: -100px;
    background-color: var(--a-gray-100);
    overflow: hidden;
    font-family: "Source Sans Pro", Arial, sans-serif;

    display: flex;
    flex-direction: column;

    .skip-links {
        background-color: var(--a-blue-500);
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

    a {
        :hover {
            text-decoration: none;
        }
    }
`

const Content = styled.main`
    min-height: 100%;
    margin: 2rem 10px 2rem;
    white-space: pre-wrap;

    h1 {
        text-align: center;
    }

    display: flex;
    flex-flow: column wrap;
    align-items: center;
    justify-content: center;

    @media (min-width: 400px) {
        h1 {
            text-align: left;
        }
    }
`

const Layout = (props) => {
    const { title } = useContext(TitleContext)
    const router = useRouter()

    let currentPath = router.asPath
    currentPath = currentPath.includes("#")
        ? currentPath.substring(0, currentPath.indexOf("#"))
        : currentPath

    return (
        <MainContentContainer>
            <ToastContainer />
            <nav className="skip-links">
                <ul>
                    <li>
                        <Link
                            href={currentPath + "#menu-container"}
                            replace={true}
                        >
                            Hovedmeny
                        </Link>
                    </li>
                    <li>
                        <Link href={currentPath + "#content"} replace={true}>
                            Innhold
                        </Link>
                    </li>
                </ul>
            </nav>

            {!router.pathname.includes("Login") && (
                <div>
                    <Navbar />
                    <Header />
                </div>
            )}
            <Content id="content">{props.children}</Content>

            <Footer />
        </MainContentContainer>
    )
}

export default Layout
