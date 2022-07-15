import styled from 'styled-components'
import { useContext } from 'react'
import { useRouter } from 'next/router'

import { BodyShort, Button, Heading, Panel } from '@navikt/ds-react'
import { Bell } from '@navikt/ds-icons'

import { handleAndSetStatusIcon } from '../PortalServiceTile'
import { UserStateContext } from '../ContextProviders/UserStatusContext'
import { RouterOpprettVarsling, RouterOpsMeldinger } from '../../types/routes'

import { OpsMessageI } from '../../types/opsMessage'


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


const Incidents: React.FC<{allOpsMessages: OpsMessageI[]}> = ({allOpsMessages})  => {
    const router = useRouter()

    if(allOpsMessages.length == 0) {
        return (
            <IncidentsPage>
                <BodyShort>
                    Du har ingen avviksmeldinger.
                </BodyShort>
            </IncidentsPage>
        )
    }

    return (
        <IncidentsPage>

            <Button variant="secondary" className="button-to-notifications" onClick={() => router.push(RouterOpprettVarsling.PATH)}>
                <Bell /> Bli varslet ved avvik
            </Button>



            <IncidentsContainer>
                {allOpsMessages.map((entry, index) => {
                    return (
                        <IncidentCard key={index}
                            opsId={entry.id}
                            status={entry.severity}
                            titleOfIncident={entry.internalHeader}
                            timeframe={`${entry.startTime} - ${entry.endTime}`}
                            descriptionOfIncident={entry.internalMessage}
                        />
                    )  
                })}
                
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
        opsId: string
        status: string
        titleOfIncident: string,
        timeframe: string,
        descriptionOfIncident: string,
        logLink?: string
    }> = ({opsId, status, titleOfIncident, timeframe, descriptionOfIncident, logLink}) => {
    
    const router = useRouter()
    
    const { navIdent } = useContext(UserStateContext)

    return (
        <PanelCustomized border className="incident-row">
            <Heading spacing size="small" level="3">
                <span>{handleAndSetStatusIcon(status)}</span>
                {titleOfIncident}
            </Heading>
            
            <BodyShort spacing className="time-frame" size="small">{timeframe}</BodyShort>

            <BodyShort spacing>{descriptionOfIncident}</BodyShort>

            <Button variant="tertiary" onClick={() => router.push(`${RouterOpsMeldinger.PATH}/${opsId}`)}>
                Se mer...
            </Button>
        </PanelCustomized>
    )
}

export default Incidents