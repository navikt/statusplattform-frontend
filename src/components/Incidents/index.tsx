import styled from 'styled-components'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'

import { BodyLong, BodyShort, Button, Heading, Panel } from '@navikt/ds-react'
import { Bell } from '@navikt/ds-icons'

import { fetchServices } from '../../utils/fetchServices'
import { Service } from '../../types/navServices'
import CustomNavSpinner from '../CustomNavSpinner'
import { OutlinedWrench } from '../TrafficLights'



const IncidentsPage = styled.div`
    display: flex;
    flex-direction: column;
    
    .button-to-notifications {
        max-width: 270px;
        margin: 32px 0 60px 0;
    }
`


const IncidentsContainer = styled(Panel)`
    display: flex;
    flex-direction: row;

    .incident-row {
        width: 650px;

        display: flex;
        flex-flow: row wrap;

        h3 {
            display: flex;

            span {
                align-self: center;
                margin-right: 8px;
            }
        }

        .time-frame {
            color: var(--navds-global-color-gray-600);
        }

        & > * {
            flex-basis: 100%;
        }
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
                Avvikshistorikk
            </Heading>

            <Button variant="secondary" className="button-to-notifications" onClick={() => handleRedirectNotifications()}>
                <Bell /> Bli varslet ved avvik
            </Button>



            <IncidentsContainer border>

                <div className="incident-row">
                    <Heading spacing size="small" level="3">
                        <OutlinedWrench />
                        Tittel på avvik
                    </Heading>
                    
                    <BodyShort spacing className="time-frame" size="small">Tidsrom det foregikk i</BodyShort>
                    <BodyLong>Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                        when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
                        It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. 
                        It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, 
                        and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                    </BodyLong>
                </div>
                
            </IncidentsContainer>



        </IncidentsPage>
    )
}

export default Incidents