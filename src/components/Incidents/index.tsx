import styled from 'styled-components'
import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'

import { BodyLong, BodyShort, Button, Heading, Panel } from '@navikt/ds-react'
import { Bell } from '@navikt/ds-icons'

import { Service } from '../../types/navServices'
import CustomNavSpinner from '../CustomNavSpinner'
import { ErrorCustomized, WrenchOutlinedCustomized, SuccessCustomized, WarningCustomized } from '../TrafficLights'
import { TitleContext } from '../ContextProviders/TitleContext'
import { getIconsFromGivenCode } from '../../utils/servicesOperations'
import { handleAndSetStatusIcon } from '../PortalServiceTile'
import { UserStateContext } from '../ContextProviders/UserStatusContext'
import { fetchServices } from '../../utils/servicesAPI'
import { RouterOpprettVarsling } from '../../types/routes'



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
    flex-flow: column wrap;
    gap: 32px;

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

    const { changeTitle } = useContext(TitleContext)
    
    
    useEffect(() => {
        (async () => {
            changeTitle("Avvikshistorikk")
            setIsLoading(true)
            const retrievedServices = await fetchServices()
            setServices(retrievedServices)
            setIsLoading(false)
        })()
    }, [])

    if (isLoading) {
        return <CustomNavSpinner />
    }


    return (
        <IncidentsPage>

            <Button variant="secondary" className="button-to-notifications" onClick={() => router.push(RouterOpprettVarsling.PATH)}>
                <Bell /> Bli varslet ved avvik
            </Button>



            <IncidentsContainer>

                <Panel border className="incident-row">
                    <Heading spacing size="small" level="3">
                        <WrenchOutlinedCustomized />
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
                </Panel>


                <IncidentCard status='OK' titleOfIncident='Test OK' timeframe='13:37-27.01.2022' descriptionOfIncident="
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                    when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
                    It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. 
                    It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, 
                    and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
                    logLink='Loglenke'
                />

                <IncidentCard status='ISSUE' titleOfIncident='Test ISSUE' timeframe='13:37-27.01.2022' descriptionOfIncident="
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                    when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
                    It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. 
                    It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, 
                    and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
                    logLink='Loglenke'
                />

                <IncidentCard status='DOWN' titleOfIncident='Test DOWN' timeframe='13:37-27.01.2022' descriptionOfIncident="
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                    when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
                    It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. 
                    It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, 
                    and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
                    logLink='Loglenke'
                />
                
            </IncidentsContainer>



        </IncidentsPage>
    )
}



// -------------------------------



const PanelCustomized = styled(Panel)`
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
`





export const IncidentCard : React.FC<{
        status: string
        titleOfIncident: string,
        timeframe: string,
        descriptionOfIncident: string,
        logLink: string
    }> = ({status, titleOfIncident, timeframe, descriptionOfIncident, logLink}) => {
    
    const { navIdent } = useContext(UserStateContext)

    return (
        <PanelCustomized border className="incident-row">
            <Heading spacing size="small" level="3">
                <span>{handleAndSetStatusIcon(status)}</span>
                {titleOfIncident}
            </Heading>
            
            <BodyShort spacing className="time-frame" size="small">{timeframe}</BodyShort>

            <BodyShort spacing>{descriptionOfIncident}</BodyShort>

            {navIdent &&
                <>
                    <BodyShort spacing><b>Loglenke</b></BodyShort>
                    
                    <BodyShort spacing>{logLink}</BodyShort>
                </>
            }
        </PanelCustomized>
    )
}

export default Incidents