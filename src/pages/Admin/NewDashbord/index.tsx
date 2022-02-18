import router from "next/router";
import { useContext, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify"
import styled from "styled-components"


import { BodyShort, Button, Detail, Select, TextField } from "@navikt/ds-react";
import { Delete } from "@navikt/ds-icons";

import { useLoader } from "../../../utils/useLoader";
import { Area, Dashboard } from "../../../types/navServices";
import Layout from '../../../components/Layout';
import CustomNavSpinner from "../../../components/CustomNavSpinner";
import { DynamicListContainer, HorizontalSeparator } from "..";
import { TitleContext } from "../../../components/ContextProviders/TitleContext";
import { postDashboard } from "../../../utils/dashboardsAPI";
import { fetchAreas } from "../../../utils/areasAPI";
import { RouterAdminDashboards } from "../../../types/routes";


const NewDashboardContainer = styled.div`
    display: flex;
    flex-direction: column;

    input, select {
        margin: 1rem 0;
    }

    .button-container {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
    }
`




const NewDashboard = () => {
    const [newDashboard, updateNewDashboard] = useState<Dashboard>({
        name: "",
        areas: []
    })

    const { data, isLoading, reload } = useLoader(fetchAreas,[]);

    if(isLoading) {
        return (
            <CustomNavSpinner />
        )
    }


    const handleChangeDashboardName = (event) => {
        const changedDashboard = {
            name: event.target.value,
            areas: [...newDashboard.areas]
        }
        updateNewDashboard(changedDashboard)
    }

    const handleAddAreaToDashboard = (areaToAdd: Area) => {
        if(newDashboard.areas.includes(areaToAdd)) {
            toast.warn("Område " + areaToAdd.name + " er allerede i dashbord")
            return
        }
        const updatedList = [...newDashboard.areas, areaToAdd]
        const updatedDashboard: Dashboard = {name: name, areas: updatedList}
        updateNewDashboard(updatedDashboard)
        toast.success("Lagt område til dashbord")
    }

    const handleDeleteAreaOnDashboard = (areaToDelete: Area) => {
        const newAreaList: Area[] = [...newDashboard.areas.filter(area => area != areaToDelete)]
        const updatedDashboard: Dashboard = {name: name, areas: newAreaList}
        updateNewDashboard(updatedDashboard)
        toast.success("Fjernet område fra dashbord")
    }


    const handlePostNewDashboard = (event) => {
        event.preventDefault()
        postDashboard(newDashboard).then(() => {
            toast.success("Dashbord lastet opp")
            router.push(RouterAdminDashboards.PATH)
        }).catch(() => {
            toast.error("Klarte ikke å laste opp dashbord")
        })
    }


    const { name } = newDashboard

    return (
        <Layout>

            <NewDashboardContainer>

                <form onSubmit={event => handlePostNewDashboard(event)}>

                    <Detail size="small" spacing>Felter markert med * er obligatoriske</Detail>
                    
                    <TextField type="text" required label="Navn på dashbord" value={name} onChange={(event) => handleChangeDashboardName(event)} placeholder="Navn*" />

                    <DashboardAreas 
                        newDashboard={newDashboard}
                        allAreas={data}
                        handleDeleteAreaOnDashboard={(areaToDelete) => handleDeleteAreaOnDashboard(areaToDelete)}
                        handleAddAreaToDashboard={(areaToAdd) => handleAddAreaToDashboard(areaToAdd)}
                    />

                    <HorizontalSeparator />

                    <div className="button-container">
                        <Button variant="secondary" type="button" value="Avbryt" onClick={() => router.push(RouterAdminDashboards.PATH)}>Avbryt</Button>
                        <Button type="submit" value="Legg til dashbord">Lagre</Button>
                    </div>
                </form>

                <ToastContainer />
            </NewDashboardContainer>
        </Layout>
    )
}






/*------------- Helpers -------------*/





interface DashboardProps {
    newDashboard: Dashboard
    allAreas: Area[]
    handleDeleteAreaOnDashboard: (areaToDelete) => void
    handleAddAreaToDashboard: (areaToAdd) => void
}





const DashboardAreas = ({newDashboard, allAreas, handleDeleteAreaOnDashboard, handleAddAreaToDashboard}: DashboardProps) => {
    const availableAreas: Area[] = allAreas.filter(area => !newDashboard.areas.map(a => a.id).includes(area.id))
    const { changeTitle } = useContext(TitleContext)
    const [selectedArea, changeSelectedArea] = useState<Area | null>(() => availableAreas.length > 0 ? availableAreas[0] : null)
    
    useEffect(() => {
        changeTitle("Opprett nytt dashbord")
        if(availableAreas.length > 0){
            changeSelectedArea(availableAreas[0])
        }
        else {
            changeSelectedArea(null)
        }
    }, [allAreas, newDashboard.areas])
    


    const handleUpdateSelectedArea = (event) => {
        const idOfSelectedArea: string = event.target.value
        const newSelectedArea: Area = availableAreas.find(area => idOfSelectedArea === area.id)
        changeSelectedArea(newSelectedArea)
    }
    

    return (
        <DynamicListContainer>
            
            <Select label="Legg til område" value={selectedArea !== null ? selectedArea.id : ""} onChange={handleUpdateSelectedArea}>
                {availableAreas.length > 0 ?
                    availableAreas.map(area => {
                        return (
                            <option key={area.id} value={area.id}>{area.name}</option>
                        )
                    })
                :
                    <option key={undefined} value="">Ingen områder å legge til</option>
                }
            </Select>

            <Button variant="secondary" type="button" onClick={() => handleAddAreaToDashboard(selectedArea)}>Legg til avhengighet</Button>
            

            {newDashboard.areas.length > 0
            ?
                <ul className="new-list">
                    {newDashboard.areas.map(area => {
                        return (
                            <li key={area.id}>
                                <BodyShort>
                                    {area.name}
                                    <button className="colored" type="button" onClick={() => handleDeleteAreaOnDashboard(area)}>
                                        <label>{area.name}</label>
                                        <Delete/> Slett
                                    </button>
                                </BodyShort>
                            </li>
                        )
                    })}
                </ul>
            :
                <BodyShort spacing><b>Ingen områder lagt til</b></BodyShort>
            }

        </DynamicListContainer>
    )
}

export default NewDashboard