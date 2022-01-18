import styled from 'styled-components'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'

import { BodyLong, Button, Heading } from '@navikt/ds-react'
import { Bell } from '@navikt/ds-icons'

import { fetchServices } from '../../utils/fetchServices'
import { Service } from '../../types/navServices'
import CustomNavSpinner from '../CustomNavSpinner'



const IncidentsPage = styled.div`
    display: flex;
    flex-direction: column;
    
    .button-to-notifications {
        max-width: 270px;
        margin: 32px 0 60px 0;
    }
`


const IncidentsContainer = styled.div`
    display: flex;
    flex-direction: row;


    .incident-row {
        width: 650px;

        display: flex;
        flex-flow: row wrap;
    }
`



const Incidents = ()  => {
    const [isLoading, setIsLoading] = useState(false)
    const [services, setServices] = useState<Service[]>()
    const [filteredServices, changeFilteredServices] = useState(services)
    
    const router = useRouter()
    
    useEffect(() => {
        (async () => {
            setIsLoading(true)
            const retrievedServices = await fetchServices()
            setServices(retrievedServices)
            setIsLoading(false)
        })()
    }, [])

    if (isLoading) {
        return <CustomNavSpinner />
    }

    const handleRedirectNotifications = () => {
        toast.info("Ikke implementert enda")
        // router.push("/OpprettVarsling")
    }


    return (
        <IncidentsPage>

            <Heading spacing size="xlarge" level="2">
                <b>Avvikshistorikk </b>
            </Heading>

            <Button variant="secondary" className="button-to-notifications" onClick={() => handleRedirectNotifications()}><Bell /> Bli varslet ved avvik</Button>

            <IncidentsContainer>
                <div className="incident-row">
                    <span>Icon and header</span>
                    <span>Tidsrom det foregikk i</span>
                    <BodyLong>Forklarende tekstForklarende tekstForklarende tekstForklarende tekstForklarende tekstForklarende tekst</BodyLong>
                </div>
            </IncidentsContainer>



        </IncidentsPage>
    )
}

export default Incidents