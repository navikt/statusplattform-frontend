import Lenke from 'nav-frontend-lenker';
// import Link from 'next/link';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';


import styled from 'styled-components'
import { useEffect, useState } from "react";

// import { Calender } from '@navikt/ds-icons';
import { Bag, Folder, PensionBag, HealthCase, ErrorFilled, WarningFilled, Employer, Information, People, Family, Service, Globe, BagFilled } from '@navikt/ds-icons'
// import { Systemtittel, Undertekst } from 'nav-frontend-typografi';
import { Label, Input, Select } from 'nav-frontend-skjema';
import { Hovedknapp  } from 'nav-frontend-knapper';
import NavFrontendSpinner from "nav-frontend-spinner";

// import NavInfoCircle from 'components/NavInfoCircle'
// import MaintenanceScheduling from 'components/MaintenanceScheduling'

// import { countHealthyServices, countServicesInAreas, mapStatusAndIncidentsToArray } from 'utils/servicesOperations';
import { fetchData } from 'utils/fetchAreas'
import { postAdminAreas } from 'utils/postAreas'




const AdminContainer = styled.div`
    max-width: 1080px;
    padding: 0;
    margin-top:2%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
	td {
		width: 100px;
		height: 75px;
	}
    @media(min-width: 500px){
    	padding: 0 3rem;
    }
`;

const IconContainer = styled.section`
	color: var(--navBla);
    font-size: 2rem;
`;

const SelectCustomized = styled(Select)`
	width: 150px;
`;

const AreasContainer = styled.div`
    border-radius: 20px;
    background-color: white;    
    padding: 2rem 1rem;
    display: flex;
    flex-direction: column;
    @media (min-width: 45rem) {
        display: flex;
        justify-content: space-between;
        flex-direction: row;
    }
    h2 {
        margin: 0 0 .5rem;
    }
`;

const SpinnerCentered = styled.div`
    position: absolute;
    top: 40%;
`
const getBag = () => {
    return <IconContainer><Bag /></IconContainer>
}



const AdminDashboard = () => {
    const [adminAreas, setAdminAreas] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        (async function () {
            setIsLoading(true)
            const adminAreas = await fetchData()
            const parsedAreas = [...adminAreas]
            setAdminAreas(parsedAreas)
            setIsLoading(false)
        })()
    }, [])

    if (isLoading) {
        return (
            <SpinnerCentered>
                <NavFrontendSpinner type="XXL" />
            </SpinnerCentered>
        ) 
    }


	const options = [
		<Bag />, <Folder />, <BagFilled />
	];
	
	const defaultOption = 'Ikon...';

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
                                    <th>Ikon</th>
                                    <th>Dashboard</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {adminAreas.map( area => {
                                    return (
                                        <tr key={area.id}>
                                            <td>{area.id}</td>
                                            <td>{area.name}</td>
                                            <td>{area.beskrivelse}</td>
                                            <td>{area.rangering}</td>
                                             <td>Privatperson</td>
                                            <td><IconContainer><Folder/></IconContainer></td>
                                            <td></td>
                                        </tr>
                                    )
                                })}

                                <tr key="input">
                                    <td>
                                        <Input defaultValue="" />
                                    </td>
                                    <td>
                                        <Input defaultValue="" />
                                    </td>
                                    <td>
                                        <Input defaultValue="" />
                                    </td>
                                    <td>
                                        <Input defaultValue="" />
                                    </td>
                                    <td>
                                    	<Dropdown
											options={options}
											onChange={getBag}
											value={defaultOption}
											placeholder="Select an option"
										/>
                                    </td>
                                    <td>
                                        <SelectCustomized>
                                            <option value="brukergruppe">Privatperson</option>
                                            <option value="brukergruppe">Arbeidsgiver</option>
                                            <option value="brukergruppe">Samarbeidspartner</option>
                                        </SelectCustomized>
                                    </td>
                                    <td><Hovedknapp onClick={postAdminAreas}>Legg til</Hovedknapp></td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                </AreasContainer>
        </AdminContainer>

        )

}

export default AdminDashboard