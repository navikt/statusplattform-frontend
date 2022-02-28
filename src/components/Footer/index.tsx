import styled from 'styled-components'
import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image'

import TrafficLights from '../../components/TrafficLights';

const FooterContainer = styled.footer`
    width: 100%;
    margin-top: auto; /*Footer always at bottom (if min.height of container is 100vh)*/
    background-color: white;
    border-top: 1px solid #eaeaea;

    display: flex;
    justify-content: center;
`

const FooterContent = styled.div`
    width: 100%;
    max-width: 1200px;
    padding: 1.75rem 1rem;
    display: flex;
    flex-direction: column;

    img {
        width: 63px;

        :hover {
            transform: scale(1.05)
        }
    }

    a {
        color: var(--navds-global-color-blue-500);
        text-decoration: underline;
        :hover {
            text-decoration: none;
        }
    }

    p {
        margin: 0;
    }

    @media (min-width: 700px){ 
        flex-direction: row;
    }
`;

const Row = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;

    &.top {
        /* align-items: center; */
        /* position: relative; */
        width: auto;
    }

    &.bottom {
        width: 100%;
        padding: 0.5rem 10px;
        margin: 0;
        border-right: none;
        justify-content: center;
        flex-direction: column;
    }

    > ul {
        padding: 0;
        list-style: none;
        width: 100%;
        display: flex;
        flex-direction: column;
        li {
            padding: 0.625rem 0;
        }
    }
    
    @media (min-width: 700px) {
        flex-direction: row;

        > ul {
            padding: 0;
            margin: 0;
            display: flex;
            flex-flow: row wrap;

            li {
                margin: 0.375rem 2rem 0 0;
                padding-top: 0;
            }
        }
    }
`

const Separator = styled.span`
    display: none;
    @media (min-width: 700px) {
        display: block;
        border-left: 1px solid var(--navds-global-color-blue-100);
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
            <FooterContent>
                <Row className="top">
                    <span>
                        <a href="https://www.nav.no/no/person#" aria-label="Lenke til nav.no">
                            <img src="/assets/nav-logo/png/black.png" alt="Til forsiden" aria-hidden="true" />
                        </a>
                    </span>
                </Row>

                <Row className="bottom">
                    <p>Arbeids- og velferdsetaten</p>
                    <ul>
                        <li><a href="https://www.nav.no/no/nav-og-samfunn/om-nav/personvern-i-arbeids-og-velferdsetaten">Personvern og informasjonskapsler</a></li>
                        <li><a href="https://www.nav.no/no/nav-og-samfunn/kontakt-nav/teknisk-brukerstotte/nyttig-a-vite/tilgjengelighet">Tilgjengelighet</a></li>
                        <li><a href="https://www.nav.no/no/person#">Del skjerm med veileder</a></li>
                    </ul>
                </Row>
                
                {/* <Separator style={{display: router.pathname.includes("Dashboard") ? "block" : "none"}} />
                {router.pathname.includes("Dashboard") &&
                    <div>
                        <TrafficLights isInternal={isInternal}/>
                    </div>
                } */}
            </FooterContent>
        </FooterContainer>
    )
}

export default Footer