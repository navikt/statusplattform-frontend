
import { useRouter } from 'next/router';

import { Back } from "@navikt/ds-icons"
import { Button } from '@navikt/ds-react';


export async function getServerSideProps(context) {
    return {
        props: {}, // will be passed to the page component as props
    }
}


export const BackButton = () => {
    const router = useRouter();
    var referrer = document.referrer;

    return (
        <Button variant="secondary" onClick={() => router.push(referrer)}><Back/>Gå tilbake</Button>
    )
}