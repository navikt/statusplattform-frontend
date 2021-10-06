import styled from 'styled-components'
import { useEffect, useState } from "react";
import Dropdown from 'react-dropdown';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Bag } from '@navikt/ds-icons'
import { Input } from 'nav-frontend-skjema';
import { Hovedknapp, Knapp  } from 'nav-frontend-knapper';
import NavFrontendSpinner from "nav-frontend-spinner";
import { Close } from '@navikt/ds-icons'

import { Area, Service, Tile } from 'types/navServices';
import { deleteService } from 'utils/deleteService';
import { postService } from 'utils/postService'
import { fetchServices } from 'utils/fetchServices';


const TableContainer = styled.div`
    width: 100%;
    overflow-x: auto;
`
const CloseCustomized = styled(Close)`
    color: red;
    :hover {
        color: grey;
        border: 1px solid;
        cursor: pointer;
    }
`

const AddNewServiceTr = styled.tr`
    td {
        min-width: 125px;
        vertical-align: bottom;
    }
    .input-error {
        input {
            border: 1px solid red;
        }
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

    const handleDependencyChange = (field: keyof typeof newService) => (evt: React.ChangeEvent<HTMLInputElement>) => {
        // console.log(newService)
        const currentService = {
            ...newService,
            [field]: evt.target.getAttribute("type") === "number" ? parseInt(evt.target.value) : evt.target.value
        }
        currentService.dependencies = newService.dependencies
        console.log(currentService.dependencies)
    }

    const handleServiceDataChange = (field: keyof typeof newService) => (evt: React.ChangeEvent<HTMLInputElement>) => {
        const newArea = {
            ...newService,
            [field]: evt.target.getAttribute("type") === "number" ? parseInt(evt.target.value) : evt.target.value
        }
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
    
    const handleServiceArea = (serviceToDelete) => {
        setIsLoading(true)
        console.log(serviceToDelete)
        if(deleteService(serviceToDelete)) {
            toast.success('Tjeneste slettet');
            const newServices = services.filter(currentService => 
                currentService != serviceToDelete
            )
            setServices(newServices)
            setIsLoading(false)
            return
        }
        toast.error('Tjeneste kunne ikke slettes');
        //TODO bedre error-visning trengs
        setIsLoading(false)
        // toast.error('Tjeneste ble ikke slettet', {

        // });
        // alert("Tjeneste ble ikke slettet")
    }

    const { id, name, type, team, dependencies, monitorlink, description, logglink, status } = newService

    return (
        <TableContainer>
            <table className="tabell tabell--stripet">

                <thead>
                    <tr>
                        <th><span>ID</span></th>
                        <th><span>Navn</span></th>
                        <th><span>Type</span></th>
                        <th><span>Team</span></th>
                        <th><span>Avhengigheter</span></th>
                        <th><span>Monitorlink</span></th>
                        <th><span>Beskrivelse</span></th>
                        <th><span>Logglink</span></th>
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
                                <td><span><CloseCustomized onClick={() => handleServiceArea(service)} /></span></td>
                            </tr>
                        )
                    })}

                    <AddNewServiceTr key="input">
                        <td>
                            <form id="form" onSubmit={() => handlePostService(newService)}><Input type="text" className={name.length == 0 ? "input-error" : ""}
                                value={id} label="ID*" required onChange={handleServiceDataChange("id")} placeholder="ID*" /></form>
                        </td>
                        <td>
                            <Input form="form" type="text" value={name} label="Navn" onChange={handleServiceDataChange("name")} placeholder="Navn"/>
                        </td>
                        <td>
                            <Input form="form" type="text" value={type} label="Type" onChange={handleServiceDataChange("type")} placeholder="Type"/>
                        </td>
                        <td>
                            <Input form="form" type="text" value={team} label="Team*" className={name.length == 0 ? "input-error" : ""} required onChange={handleServiceDataChange("team")} placeholder="Team*"/>
                        </td>
                        <td>
                            <Input form="form" type="text" value={dependencies} label="Avhengigheter" onChange={handleServiceDataChange("dependencies")} placeholder="Avhengigheter*"/>
                        </td>
                        <td>
                            <Input form="form" type="text" value={monitorlink} label="Monitorlenke" onChange={handleServiceDataChange("monitorlink")} placeholder="Monitorlink"/>
                        </td>
                        <td>
                            <Input form="form" type="text" value={description} label="Beskrivelse" onChange={handleServiceDataChange("description")} placeholder="Beskrivelse"/>
                        </td>
                        <td>
                            <Input form="form" type="text" value={logglink} label="Logglenke" onChange={handleServiceDataChange("logglink")} placeholder="Logglink" />
                        </td>

                        <td><Hovedknapp disabled={
                            !id || !team || !dependencies} 
                            form="form"
                            htmlType="submit"
                            >
                            Legg til</Hovedknapp>
                        </td>
                    </AddNewServiceTr>

                </tbody>
            </table>
        </TableContainer>
    )
}

export default TjenesteTable