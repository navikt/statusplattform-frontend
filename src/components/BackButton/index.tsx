
import { useRouter } from 'next/router'

import { ChevronLeftIcon } from "@navikt/aksel-icons"
import { Button } from '@navikt/ds-react'


export const BackButton = () => {

    return (
        <Button variant="secondary" onClick={() => history.back()}><ChevronLeftIcon/>Gå tilbake</Button>
    )
}