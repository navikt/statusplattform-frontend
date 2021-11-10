
import { useRouter } from 'next/router';
import styled from 'styled-components'


import { Back } from "@navikt/ds-icons"
import { Knapp } from "nav-frontend-knapper"


const KnappCustomized = styled(Knapp)`
    transition: 0.4s;
`

export async function getServerSideProps(context) {
    return {
        props: {}, // will be passed to the page component as props
    }
}


export const BackButton = () => {
    const router = useRouter();
    var referrer = document.referrer;

    return (
        <KnappCustomized mini onClick={() => router.push(referrer)}><Back/>Gå tilbake</KnappCustomized>
    )
}