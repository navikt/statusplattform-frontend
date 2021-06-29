import Lenke from 'nav-frontend-lenker';
        import Link from 'next/link';
        import styled from 'styled-components'
        import { useEffect, useState } from "react";

        import NavInfoCircle from 'components/NavInfoCircle'
        import MaintenanceScheduling from 'components/MaintenanceScheduling'
        import { Calender } from '@navikt/ds-icons';
        import { Label, Input } from 'nav-frontend-skjema';
        import { Hovedknapp  } from 'nav-frontend-knapper';
        import { Systemtittel, Undertekst } from 'nav-frontend-typografi';
        import { countHealthyServices, countServicesInAreas, mapStatusAndIncidentsToArray } from 'utils/servicesOperations';
        import { fetchData } from 'utils/fetchAreas'

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





        const AdminDashboard = () => {
        const [adminAreas, setAreas] = useState([])
        const [isLoading, setIsLoading] = useState(true)

        useEffect(() => {
        (async function () {
        const adminAreas = await fetchData()
        const parsedAreas = [...adminAreas]
        setAreas(parsedAreas)
        setIsLoading(false)
        })()
        }, [])
        {/*

        if (!adminAreas) {
        return <ErrorParagraph>Kunne ikke hente områder. Hvis problemet vedvarer, kontakt support.</ErrorParagraph>
        }

        if (isLoading) {
        return (
<SpinnerCentered>
<NavFrontendSpinner type="XXL" />
</SpinnerCentered>
        )
        }

        */}
        if(!isLoading && adminAreas){
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
                {adminAreas.map( area => {
                return (
                <tr>
                    <td>area.Id</td>
                    <td>area.name</td>
                    <td>area.beskrivelse</td>
                    <td>area.rangering</td>
                    <td></td>
                </tr>
                )
                })}

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
        }

        export default AdminDashboard