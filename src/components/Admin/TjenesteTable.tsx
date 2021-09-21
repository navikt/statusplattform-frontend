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
import { fetchServices } from 'utils/fetchServices';


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
const AddNewServiceTr = styled.tr`
    td {
        min-width: 125px;
    }
`

export interface Props {
    services: Service[]
    setServices: Function
    setIsLoading: Function
}

const TjenesteTable = ({services, setServices, setIsLoading}: Props) => {
    const [newService, updateNewService] = useState<Service>({
        id: "",
        name: "",
        type: "",
        team: "",
        dependencies: [],
        monitorlink: "",
        description: "",
        logglink: ""
    })

    const handleServiceDataChange = (field: keyof typeof newService) => (evt: React.ChangeEvent<HTMLInputElement>) => {
        const newArea = {
            ...newService,
            [field]: evt.target.getAttribute("type") === "number" ? parseInt(evt.target.value) : evt.target.value        }
        updateNewService(newArea)
    }
    
    
    const handlePostService = (serviceToAdd: Service) => {
        setIsLoading(true)
        const newlist = services.filter(service => service.id === serviceToAdd.name)
        if(newlist.length > 0) {
            alert("Denne IDen er allerede brukt. Velg en annen")
            setIsLoading(false)
            return
        }
        if(postService(serviceToAdd)) {
            const newServices = [...services]
            newServices.push(serviceToAdd)
            setServices(newServices)
            setIsLoading(false)
            return
        }
        //TODO bedre error-visning trengs
        setIsLoading(false)
        alert("Tjeneste ble ikke lagt til")
    }
    
    const handleDeleteArea = (serviceToDelete) => {
        setIsLoading(true)
        if(deleteService(serviceToDelete)) {
            const newServices = services.filter(currentService => 
                currentService != serviceToDelete
            )
            setServices(newServices)
            setIsLoading(false)
            return
        }
        //TODO bedre error-visning trengs
        setIsLoading(false)
        alert("Tjeneste ble ikke slettet")
    }

    const { id, name, type, team, dependencies, monitorlink, description, logglink, status } = newService


    return (
        <table className="tabell tabell--stripet">
            <thead>
                <tr>
                    <th><span>ID</span></th>
                    <th><span>Navn</span></th>
                    <th><span>Type</span></th>
                    <th><span>Team</span></th>
                    <th><span>Dependencies</span></th>
                    <th><span>monitorlink</span></th>
                    <th><span>Description</span></th>
                    <th><span>logglink</span></th>
                    <th><span>Slett</span></th>
                </tr>
            </thead>
            <tbody>
                {services.map( service => {
                    return (
                        <tr key={service.id}>
                            <td><span>{service.id}</span></td>
                            <td><span>{service.name}</span></td>
                            <td><span>{service.type}</span></td>
                            <td><span>{service.team}</span></td>
                            <td><span>{service.dependencies}</span></td>
                            <td><span>{service.monitorlink}</span></td>
                            <td><span>{service.description}</span></td>
                            <td><span>{service.logglink}</span></td>
                            <td><span><CloseCustomized onClick={() => handleDeleteArea(service)} /></span></td>
                        </tr>
                    )
                })}

                <AddNewServiceTr key="input">
                    <td>
                        <Input type="text" value={id} required onChange={handleServiceDataChange("id")} placeholder="ID*"/>
                    </td>
                    <td>
                        <Input type="text" value={name} onChange={handleServiceDataChange("name")} placeholder="Navn"/>
                    </td>
                    <td>
                        <Input type="text" value={type} onChange={handleServiceDataChange("type")} placeholder="Type"/>
                    </td>
                    <td>
                        <Input type="text" value={team} required onChange={handleServiceDataChange("team")} placeholder="Team*"/>
                    </td>
                    <td>
                        <Input type="text" value={dependencies} onChange={handleServiceDataChange("dependencies")} placeholder="Avhengigheter"/>
                    </td>
                    <td>
                        <Input type="text" value={monitorlink} onChange={handleServiceDataChange("monitorlink")} placeholder="Monitorlink"/>
                    </td>
                    <td>
                        <Input type="text" value={description} onChange={handleServiceDataChange("description")} placeholder="Beskrivelse"/>
                    </td>
                    <td>
                        <Input type="text" value={logglink} onChange={handleServiceDataChange("logglink")} placeholder="Logglink" />
                    </td>

                    <td><Hovedknapp disabled={
                        !id || !team || !dependencies} 
                        onClick={() => handlePostService(newService)}>
                        Legg til</Hovedknapp>
                    </td>
                </AddNewServiceTr>

            </tbody>
        </table>
    )
}

export default TjenesteTable