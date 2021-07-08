// import Link from 'next/link';
import 'react-dropdown/style.css';
import styled from 'styled-components'
import { useEffect, useState } from "react";
import Dropdown from 'react-dropdown';


import Lenke from 'nav-frontend-lenker';

// import { Calender } from '@navikt/ds-icons';
import { Bag, Folder, PensionBag, HealthCase, ErrorFilled, WarningFilled, Employer, Information, People, Family, Service, Globe, BagFilled } from '@navikt/ds-icons'
// import { Systemtittel, Undertekst } from 'nav-frontend-typografi';
import { Label, Input, Select } from 'nav-frontend-skjema';
import { Hovedknapp  } from 'nav-frontend-knapper';
import NavFrontendSpinner from "nav-frontend-spinner";
import { Close } from '@navikt/ds-icons'

// import NavInfoCircle from 'components/NavInfoCircle'
// import MaintenanceScheduling from 'components/MaintenanceScheduling'

// import { countHealthyServices, countServicesInAreas, mapStatusAndIncidentsToArray } from 'utils/servicesOperations';
import { fetchData } from 'utils/fetchAreas'
import { postAdminAreas } from 'utils/postAreas'
import { deleteArea } from 'utils/deleteArea'
import { Area } from 'types/navServices';




const AdminDashboardContainer = styled.div`
    padding: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    th {
        span {
            display: flex;
            justify-content: center;
        }
    }
	td {
		width: 100px;
		height: 75px;
        span {
            display: flex;
            justify-content: center;
        }
	}
    @media(min-width: 500px){
    	padding: 0 0 3rem 0;
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
    border-radius: 0 0 20px 20px;
    background-color: white;    
    padding: 2rem 1rem;
    display: flex;
    flex-direction: column;
    @media (min-width: 45rem) {
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

const CloseCustomized = styled(Close)`
    color: red;
    :hover {
        color: grey;
        border: 1px solid;
        cursor: pointer;
    }
`

const getBag = () => {
    return <IconContainer><Bag /></IconContainer>
}



const AdminDashboard = () => {
    const [adminAreas, setAdminAreas] = useState<Area[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [newAdminArea, updateNewAdminArea] = useState<Area>({
        id: "",
        name: "",
        beskrivelse: "",
        rangering: 0
    })

    useEffect(() => {
        (async function () {
            setIsLoading(true)
            const adminAreas: Area[] = await fetchData()
            setAdminAreas(adminAreas)
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
		// <Bag />, <Folder />, <BagFilled />
        'Bag', 'Folder', 'Pengebag'
	];
	
	const defaultOption = 'Ikon...'

    const handleAreaDataChange = (field: keyof typeof newAdminArea) => (evt: React.ChangeEvent<HTMLInputElement>) => {
        const newArea = {
            ...newAdminArea,
            [field]: evt.target.getAttribute("type") === "number" ? parseInt(evt.target.value) : evt.target.value        }
        updateNewAdminArea(newArea)
    }


    const handlePostAdminArea = (areaToAdd: Area) => {
        const newlist = adminAreas.filter(area => area.id === areaToAdd.id)
        if(newlist.length > 0) {
            alert("Denne IDen er allerede brukt. Velg en annen")
            return
        }
        if(postAdminAreas(areaToAdd)) {
            const newAreas = [...adminAreas]
            newAreas.push(areaToAdd)
            setAdminAreas(newAreas)
            return
        }
        //TODO bedre error-visning trengs
        alert("Område ble ikke lagt til")
    }

    const handleDeleteArea = (areaToDelete) => {
        if(deleteArea(areaToDelete)) {
            const newAreas = adminAreas.filter(currentArea => 
                currentArea != areaToDelete
            )
            setAdminAreas(newAreas)
            return
        }
        //TODO bedre error-visning trengs
        alert("Område ble ikke slettet")
    }

    const { id, name, beskrivelse, rangering} = newAdminArea
	return (
        <AdminDashboardContainer>

                <AreasContainer>
                    <div>
                        <h2>Områder</h2>
                        <table className="tabell tabell--stripet">
                            <thead>
                                <tr>
                                    <th><span>ID</span></th>
                                    <th><span>Navn</span></th>
                                    <th><span>Beskrivelse</span></th>
                                    <th><span>Rangering</span></th>
                                    <th><span>Ikon</span></th>
                                    <th><span>Slett</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {adminAreas.map( area => {
                                    return (
                                        <tr key={area.id}>
                                            <td><span>{area.id}</span></td>
                                            <td><span>{area.name}</span></td>
                                            <td><span>{area.beskrivelse}</span></td>
                                            <td><span>{area.rangering}</span></td>
                                            <td><span><IconContainer><Folder/></IconContainer></span></td>
                                            {/* <td>Privatperson</td> */}
                                            <td><span><CloseCustomized onClick={() => handleDeleteArea(area)} /></span></td>
                                            {/* <td></td> */}
                                        </tr>
                                    )
                                })}

                                <tr key="input">
                                    <td>
                                        <Input type="text" value={id} onChange={handleAreaDataChange("id")} placeholder="ID"/>
                                    </td>
                                    <td>
                                        <Input type="text" value={name} onChange={handleAreaDataChange("name")} placeholder="Navn"/>
                                    </td>
                                    <td>
                                        <Input type="text" value={beskrivelse} onChange={handleAreaDataChange("beskrivelse")} placeholder="Beskrivelse"/>
                                    </td>
                                    <td>
                                        <Input type="number" value={rangering} onChange={handleAreaDataChange("rangering")} />
                                    </td>
                                    <td>
                                    	<Dropdown
											options={options}
											onChange={getBag}
											value={defaultOption}
											placeholder="Select an option"
										/>
                                    </td>
                                    {/* <td>
                                        <SelectCustomized>
                                            <option value="brukergruppe">Privatperson</option>
                                            <option value="brukergruppe">Arbeidsgiver</option>
                                            <option value="brukergruppe">Samarbeidspartner</option>
                                        </SelectCustomized>
                                    </td> */}
                                    <td><Hovedknapp disabled={!id || !name || !beskrivelse || !rangering} onClick={() => handlePostAdminArea(newAdminArea)}>Legg til</Hovedknapp></td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                </AreasContainer>
        </AdminDashboardContainer>

        )

}

export default AdminDashboard