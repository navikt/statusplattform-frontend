
import { useRouter } from 'next/router'

import { Back } from "@navikt/ds-icons"
import { Button } from '@navikt/ds-react'


export const BackButton = () => {

    return (
        <Button variant="secondary" onClick={() => history.back()}><Back/>Gå tilbake</Button>
    )
}