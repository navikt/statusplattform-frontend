import { useRouter } from "next/router"
import { useState } from "react"
import styled from "styled-components"

import { EnvelopeClosedIcon, PhoneIcon } from "@navikt/aksel-icons"
import { BodyShort, Label, Link } from "@navikt/ds-react"

const ContactInformation = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    text-align: center;

    .section {
    }
`
const FooterContainer = styled.footer`
    width: 100%;
    margin-top: auto; /*Footer always at bottom (if min.height of container is 100vh)*/
    padding: 0 1.5rem;

    background-color: white;
    border-top: 1px solid #eaeaea;
    justify-content: center;
    text-align: center;
    align-items: center;
    display: flex;
    flex-direction: column;

    img {
        width: 63px;
        margin-right: 1.2rem;

        :hover {
            transform: scale(1.05);
        }
    }
    . Fo span {
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

        ul {
            flex-direction: row;

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
            <div className="footerImage">
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
            </div>

            <ContactInformation>
                <Label> NAV IT Operasjonssenteret</Label>
                <BodyShort>
                    <Link>ops@nav.no</Link>
                </BodyShort>

                <a href="https://www.nav.no/no/nav-og-samfunn/kontakt-nav/teknisk-brukerstotte/nyttig-a-vite/tilgjengelighet">
                    Tilgjengelighet
                </a>
            </ContactInformation>

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
