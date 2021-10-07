import styled from 'styled-components'
import {useState } from "react";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Input } from 'nav-frontend-skjema';
import { Hovedknapp  } from 'nav-frontend-knapper';
import { Close } from '@navikt/ds-icons'

import { Service } from 'types/navServices';
import { deleteService } from 'utils/deleteService';
import { postService } from 'utils/postService'
import { fetchServices } from 'utils/fetchServices';
import { useLoader } from 'utils/useLoader';
import CustomNavSpinner from 'components/CustomNavSpinner';



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


const TjenesteTable = () => {
    const [newService, updateNewService] = useState<Service>({
        id: "",
        name: "",
        type: "",
        team: "",
        dependencies: [""],
        monitorlink: "",
        description: "",
        logglink: ""
    })
    const { data: services, isLoading: loadingServices, reload: reloadServices } = useLoader(fetchServices,[]);

    if(loadingServices) {
        return (
            <CustomNavSpinner />
        )
    }

    const handleDependencyChange = (field: keyof typeof newService) => (evt: React.ChangeEvent<HTMLInputElement>) => {
        let currentService = {
            ...newService,
            [field]: evt.target.getAttribute("type") === "number" ? parseInt(evt.target.value) : evt.target.value
        }
        const dependenciesList: string[] = evt.target.value.split(",")
        currentService.dependencies = dependenciesList
        updateNewService(currentService)
    }

    const handleServiceDataChange = (field: keyof typeof newService) => (evt: React.ChangeEvent<HTMLInputElement>) => {
        const currentService = {
            ...newService,
            [field]: evt.target.getAttribute("type") === "number" ? parseInt(evt.target.value) : evt.target.value
        }
        updateNewService(currentService)
    }
    
    
    const handlePostService = (serviceToAdd: Service, event) => {
        event.preventDefault()
        const newlist = services.filter(service => service.id === serviceToAdd.name)
        if(newlist.length > 0) {
            toast.info("Denne IDen er allerede brukt. Velg en annen")
            return
        }
        if(postService(serviceToAdd)) {
            const newServices = [...services]
            newServices.push(serviceToAdd)
            reloadServices()
            toast.success("Tjeneste ble lagt til")
            return
        }
        toast.warn("Tjeneste ble ikke lagt til")
    }
    
    const handleServiceDeletion = (serviceToDelete) => {
        if(deleteService(serviceToDelete)) {
            toast.success('Tjeneste slettet');
            const newServices = services.filter(currentService => 
                currentService != serviceToDelete
            )
            reloadServices()
            return
        }
        toast.error('Tjeneste kunne ikke slettes');
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
                                <td><ul>{service.dependencies.map((dependency, index) => {
                                    return (
                                        <li key={index}>{dependency}</li>
                                    )
                                })}</ul></td>
                                <td><span>{service.monitorlink}</span></td>
                                <td><span>{service.description}</span></td>
                                <td><span>{service.logglink}</span></td>
                                <td><span><CloseCustomized onClick={() => handleServiceDeletion(service)} /></span></td>
                            </tr>
                        )
                    })}

                    <AddNewServiceTr key="input">
                        <td>
                            <form id="form" onSubmit={(event) => handlePostService(newService, event)}><Input type="text" className={name.length == 0 ? "input-error" : ""}
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
                            <Input form="form" type="text" value={dependencies} label="Avhengigheter" onChange={handleDependencyChange("dependencies")} placeholder="ID1, ID2, ID3..."/>
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