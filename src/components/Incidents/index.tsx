import Link from 'next/link'
import styled from 'styled-components'

import { BackButton } from '../../components/BackButton'
import { countFailingServices, getListOfTilesThatFail } from '../../utils/servicesOperations'

import NavInfoCircle from '../../components/NavInfoCircle'
import Alertstripe from 'nav-frontend-alertstriper'
import { AreaServicesList, Service, Tile } from '../../types/navServices'
import { Calender } from '@navikt/ds-icons'
import { Heading } from '@navikt/ds-react'
import { useEffect, useState } from 'react'
import { fetchServiceFromId } from 'src/utils/fetchServiceFromId'
import { useRouter } from 'next/router'

const IncidentsContainer = styled.div`
    margin: 20px 0;
    width: 100%;
`
const CenterContent = styled.div`
    margin: 0 auto;
    max-width: 1100px;
    padding: 1rem 1rem;

    display: flex;
    flex-direction: column;

    @media(min-width:450px){
        padding: 1rem 3rem;
    }
`

const SectionContainer = styled.div`
    margin: 10px 0;

    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: flex-start;
`
const IconWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    *:first-child{
        margin-right: 20px;
    }
`

const IncidentsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    
`
const ExistsIncidents = styled.div``

const WhiteBackgroundContainer = styled.div`
    background-color: var(--navBakgrunn);
    width: 100%;
    height: 100%;
`


const Incidents = ()  => {
    const [isLoading, setIsLoading] = useState(false)
    const [service, setService] = useState<Service>()
    
    
    useEffect(() => {
        (async () => {
            setIsLoading(true)
            const router = await useRouter()
            console.log(router.asPath)
            const retrievedService = await fetchServiceFromId("")
            setIsLoading(false)
        })()
    }, [])



    return (
        <IncidentsContainer>

            <Heading spacing size="xlarge" level="2">
                <b>Avvikshistorikk: </b> {service.name}
            </Heading>



        </IncidentsContainer>
    )
}

export default Incidents