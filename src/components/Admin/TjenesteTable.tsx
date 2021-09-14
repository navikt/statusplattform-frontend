import styled from 'styled-components'
import { useEffect, useState } from "react";
import Dropdown from 'react-dropdown';

import { Bag } from '@navikt/ds-icons'
import { Input } from 'nav-frontend-skjema';
import { Hovedknapp  } from 'nav-frontend-knapper';
import NavFrontendSpinner from "nav-frontend-spinner";
import { Close } from '@navikt/ds-icons'

import { Area, Service, Tile } from 'types/navServices';
import { deleteService } from 'utils/deleteService';
import { postService } from 'utils/postService'
import { fetchData } from 'utils/fetchServices';


const CloseCustomized = styled(Close)`
    color: red;
    :hover {
        color: grey;
        border: 1px solid;
        cursor: pointer;
    }
`

const SpinnerCentered = styled.div`
    position: absolute;
    top: 40%;
`

export interface Props {
    adminAreas: Area[]
}

const TjenesteTable = ({adminAreas}: Props) => {
    const [services, setServices] = useState<Service[]>()
    const [newService, updateNewService] = useState<Service>({
        id: "",
        name: "",
        type: "",
        team: "",
        dependencies: [],
        monitorLink: "",
        description: "",
        loggLink: ""
    })
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        (async function () {
            setIsLoading(true)
            const areas: Tile[] = await fetchData()
            const allServices: Service[] = areas.flatMap(area => area.services.map(service => service))
            setServices(allServices)
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

    const handleServiceDataChange = (field: keyof typeof newService) => (evt: React.ChangeEvent<HTMLInputElement>) => {
        const newArea = {
            ...newService,
            [field]: evt.target.getAttribute("type") === "number" ? parseInt(evt.target.value) : evt.target.value        }
        updateNewService(newArea)
    }
    
    
    const handlePostService = (serviceToAdd: Service) => {
        const newlist = services.filter(service => service.id === serviceToAdd.name)
        if(newlist.length > 0) {
            alert("Denne IDen er allerede brukt. Velg en annen")
            return
        }
        if(postService(serviceToAdd)) {
            const newServices = [...services]
            newServices.push(serviceToAdd)
            setServices(newServices)
            return
        }
        //TODO bedre error-visning trengs
        alert("Tjeneste ble ikke lagt til")
    }
    
    const handleDeleteArea = (serviceToDelete) => {
        if(deleteService(serviceToDelete)) {
            const newServices = services.filter(currentService => 
                currentService != serviceToDelete
            )
            setServices(newServices)
            return
        }
        //TODO bedre error-visning trengs
        alert("Tjeneste ble ikke slettet")
    }


    const { id, name, type, team, dependencies, monitorLink, description, loggLink, status } = newService


    return (
        <table className="tabell tabell--stripet">
            <thead>
                <tr>
                    <th><span>ID</span></th>
                    <th><span>Navn</span></th>
                    <th><span>Beskrivelse</span></th>
                    <th aria-sort="descending" role="columnheader"><span>Rangering</span></th>
                    <th><span>Ikon</span></th>
                    <th><span>Slett</span></th>
                </tr>
            </thead>
            <tbody>
                {services.map( service => {
                    return (
                        <tr key={service.id}>
                            <td><span>{service.name}</span></td>
                            <td><span>{service.type}</span></td>
                            <td><span>{service.team}</span></td>
                            <td><span>{service.dependencies}</span></td>
                            <td><span>{service.monitorLink}</span></td>
                            <td><span>{service.description}</span></td>
                            <td><span>{service.loggLink}</span></td>
                            <td><span><CloseCustomized onClick={() => handleDeleteArea(service)} /></span></td>
                        </tr>
                    )
                })}

                <tr key="input">

                    <td>
                        <Input type="text" value={id} onChange={handleServiceDataChange("id")} placeholder="ID"/>
                    </td>
                    <td>
                        <Input type="text" value={name} onChange={handleServiceDataChange("name")} placeholder="Navn"/>
                    </td>
                    <td>
                        <Input type="text" value={type} onChange={handleServiceDataChange("name")} placeholder="Type"/>
                    </td>
                    <td>
                        <Input type="text" value={team} onChange={handleServiceDataChange("team")} placeholder="Team"/>
                    </td>
                    <td>
                        <Input type="text" value={dependencies} onChange={handleServiceDataChange("dependencies")} placeholder="Avhengigheter"/>
                    </td>
                    <td>
                        <Input type="text" value={monitorLink} onChange={handleServiceDataChange("monitorLink")} placeholder="Monitorlink"/>
                    </td>
                    <td>
                        <Input type="text" value={description} onChange={handleServiceDataChange("description")} placeholder="Beskrivelse"/>
                    </td>
                    <td>
                        <Input type="number" value={loggLink} onChange={handleServiceDataChange("loggLink")} placeholder="Logglink" />
                    </td>

                    <td><Hovedknapp disabled={
                        !id || !name || !type || !team || !dependencies || !monitorLink || !description || !loggLink} 
                        onClick={() => handlePostService(newService)}>
                        Legg til</Hovedknapp>
                    </td>
                </tr>

            </tbody>
        </table>
    )
}

export default TjenesteTable