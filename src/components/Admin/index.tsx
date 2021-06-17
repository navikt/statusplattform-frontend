import Lenke from 'nav-frontend-lenker';
import Link from 'next/link';
import styled from 'styled-components'

import NavInfoCircle from 'components/NavInfoCircle'
import MaintenanceScheduling from 'components/MaintenanceScheduling'
import { Calender } from '@navikt/ds-icons';
import { Label, Input } from 'nav-frontend-skjema';
import { Hovedknapp  } from 'nav-frontend-knapper';
import { Systemtittel, Undertekst } from 'nav-frontend-typografi';
import { countHealthyServices, countServicesInAreas, mapStatusAndIncidentsToArray } from 'utils/servicesOperations';

const AdminContainer = styled.div`
    max-width: 1080px;
    width: 100%;
    padding: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    @media(min-width: 500px){
        padding: 0 3rem;
    }
`;

const AreasContainer = styled.div`
    border-radius: 20px;
    background-color: white;    
    padding: 2rem 1rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    div:first-child {
        padding-bottom: 1rem;
    }
    @media (min-width: 45rem) {
        display: flex;
        justify-content: space-between;
        flex-direction: row;
    }
    h2 {
        margin: 0 0 .5rem;
    }
`;





const StatusOverview = (props: any) => {

    return (
        <AdminContainer>

            <AreasContainer>
                <div>
                    <h2>Områder</h2>
                    <table className="tabell tabell--stripet">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Navn</th>
                                <th>Beskrivelse</th>
                                <th>Rangering</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Jean-Luc</td>
                                <td>Picard</td>
                                <td>3</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>William</td>
                                <td>Riker</td>
                                <td>2</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>Geordi</td>
                                <td>La Forge</td>
                                <td>1</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td> 4</td>
                                <td>
                                    <Input aria-labelledby="header-fornavn" defaultValue="" />
                                </td>
                                <td>
                                    <Input aria-labelledby="header-etternavn" defaultValue="" />
                                </td>
                                <td>
                                    <Input aria-labelledby="header-rolle" defaultValue="" />
                                </td>
                                <td><Hovedknapp>Legg til</Hovedknapp></td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </AreasContainer>

        </AdminContainer>
    )
}

export default StatusOverview