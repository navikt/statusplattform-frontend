import styled from "styled-components"
import { useState } from "react"
import { useRouter } from "next/router"

import TrafficLights from "../../components/TrafficLights"
import { BodyShort } from "@navikt/ds-react"

const FooterContainer = styled.footer`
    width: 100%;
    margin-top: auto; /*Footer always at bottom (if min.height of container is 100vh)*/
    padding: 0 1.5rem;

    background-color: white;
    border-top: 1px solid #eaeaea;

    display: flex;
    flex-direction: column;

    img {
        width: 63px;
        margin-right: 1.2rem;

        :hover {
            transform: scale(1.05);
        }
    }

    span {
        display: flex;
        flex-direction: row;
        align-items: center;

        min-height: 80px;
    }

    ul {
        padding: 0;
        list-style: none;

        display: flex;
        flex-direction: column;

        li {
            padding: 0.625rem 0;
        }
    }

    a {
        color: black;
    }

    @media (min-width: 600px) {
        padding: 0 50px;

        flex-direction: row;
        justify-content: space-between;

        ul {
            flex-direction: row;
            justify-content: flex-end;
            gap: 1.5rem;
        }
    }
`

const Separator = styled.span`
    display: none;
    @media (min-width: 700px) {
        display: block;
        border-left: 1px solid var(--a-blue-100);
        height: 100%;
        width: 1px;
        padding: 0 5ch;
    }
`

const Footer = () => {
    const [isInternal, changePrivilege] = useState(false)

    const router = useRouter()

    return (
        <FooterContainer>
            <span>
                <a
                    href="https://www.nav.no/no/person#"
                    aria-label="Lenke til nav.no"
                >
                    <img
                        src="/sp/assets/nav-logo/png/black.png"
                        alt="Til forsiden"
                        aria-hidden="true"
                    />
                </a>
                <BodyShort>Arbeids- og velferdsetaten</BodyShort>
            </span>

            <ul>
                <li>
                    <a href="https://www.nav.no/no/nav-og-samfunn/om-nav/personvern-i-arbeids-og-velferdsetaten">
                        Personvern og informasjonskapsler
                    </a>
                </li>
                <li>
                    <a href="https://www.nav.no/no/nav-og-samfunn/kontakt-nav/teknisk-brukerstotte/nyttig-a-vite/tilgjengelighet">
                        Tilgjengelighet
                    </a>
                </li>
            </ul>

            {/* <Separator style={{display: router.pathname.includes("Dashboard") ? "block" : "none"}} />
            {router.pathname.includes("Dashboard") &&
                <div>
                    <TrafficLights isInternal={isInternal}/>
                </div>
            } */}
        </FooterContainer>
    )
}

export default Footer
