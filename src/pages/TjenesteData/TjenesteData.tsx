import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router';
import Link from 'next/link';

import NavFrontendSpinner from 'nav-frontend-spinner';

import { fetchServices } from 'utils/fetchServices';
import { retrieveFilteredServiceList } from 'utils/servicesOperations';
import { Innholdstittel, Systemtittel, Undertittel } from 'nav-frontend-typografi';
import { BackButton } from 'components/BackButton';
import { ErrorFilled, SuccessFilled, WarningFilled } from '@navikt/ds-icons';
import CustomNavSpinner from 'components/CustomNavSpinner';
import { fetchServiceFromId } from 'utils/fetchServiceFromId';
import { Service } from 'types/navServices';


const ErrorParagraph = styled.p`
    color: #ff4a4a;
    font-weight: bold;
    padding: 10px;
    border-radius: 5px;
`;

const CategoryContainer = styled.div`
    width: 100%;
    padding: 1rem 3rem;
`
const ServiceContainer = styled.div`
    min-width: 100px;
    min-height: 75px;
    padding: 1rem 1rem;
    background-color: var(--navBakgrunn);
    border-radius: 10px;
    display: grid;
    justify-content: center;
    gap: 15px;
    grid-template-columns: repeat(1, 1fr);
`
const ServiceWrapper = styled.div`
    width: 100%;
    padding: 1rem 0;
`
const IncidentsWrapper = styled.span`
    padding: 2rem;
    width: 80%;
`
const StatusIcon = styled.span`
    .up {
        color: var(--navGronn);
    }
    .down {
        color: var(--redError)
    }
    .issue {
        color: var(--navOransje)
    }
`
const CenterContent = styled.div`
    text-align: center;
    padding: 1rem;
`

const formatStatusMessage = (serviceToFormat) =>   {
    switch (serviceToFormat.status) {
        case "OK":
            return (<SuccessFilled className="up" />)
        case "DOWN":
            return (<ErrorFilled className="down" />)
        case "ISSUE":
            return (<WarningFilled className="issue" />)
        default:
            break
    }
}

const TjenesteData: React.FC<{service: Service}> = ({service}) => {
    

    
    if (!service) {
        return <ErrorParagraph>Kunne ikke hente tjenesten. Hvis problemet vedvarer, kontakt support.</ErrorParagraph>
    }



    return (
        <CategoryContainer>
            <Link href="/Dashboard/PrivatPerson"><span><BackButton /></span></Link>
            <CenterContent><Innholdstittel>{service.name}</Innholdstittel></CenterContent>
            <ServiceContainer>
                <ServiceWrapper key={service.name}>
                    <Systemtittel>
                        <StatusIcon>{formatStatusMessage(service)} </StatusIcon>
                        Tjenestenavn - {service.name}
                    </Systemtittel>
                    <IncidentsWrapper>
                        <Undertittel>Hendelsesrapport siste 90 dagene</Undertittel>
                        <div>
                            Ikke implementert
                        </div>
                    </IncidentsWrapper>
                </ServiceWrapper>
            </ServiceContainer>
        </CategoryContainer>
    )
}





export default TjenesteData