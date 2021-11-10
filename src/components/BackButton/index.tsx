
import { useRouter } from 'next/router';
import styled from 'styled-components'


import { Back } from "@navikt/ds-icons"
import { Knapp } from "nav-frontend-knapper"


const KnappCustomized = styled(Knapp)`
    transition: 0.4s;
`

export const BackButton = () => {
    const router = useRouter();

    return (
        <KnappCustomized mini onClick={() => router.back()}><Back/>Gå tilbake</KnappCustomized>
    )
}