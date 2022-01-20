import router from "next/router";
import { useContext, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify"
import styled from "styled-components"


import { Input } from "nav-frontend-skjema";
import { BodyShort, Button, Detail, Select } from "@navikt/ds-react";
import { Delete } from "@navikt/ds-icons";

import { fetchAreas } from "../../../utils/fetchAreas";
import { useLoader } from "../../../utils/useLoader";
import { Area, Dashboard } from "../../../types/navServices";
import { postDashboard } from "../../../utils/postDashboard";
import Layout from '../../../components/Layout';
import CustomNavSpinner from "../../../components/CustomNavSpinner";
import { HorizontalSeparator } from "..";
import { TitleContext } from "../../components/ContextProviders/TitleContext";


const NewDashboardContainer = styled.div`
    display: flex;
    flex-direction: column;

    input {
        margin: 1rem 0;
        width: 100%;
    }

    .button-container {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;

        flex: 1 1 40%;
    }

    @media (min-width: 280px) {
        input {
            min-width: 280px;
        }
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
            router.push("/Admin?tab=Dashbord")
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
                    
                    <Input type="text" required label="Navn på dashbord" value={name} onChange={(event) => handleChangeDashboardName(event)} placeholder="Navn*" />

                    <DashboardAreas 
                        newDashboard={newDashboard}
                        allAreas={data}
                        handleDeleteAreaOnDashboard={(areaToDelete) => handleDeleteAreaOnDashboard(areaToDelete)}
                        handleAddAreaToDashboard={(areaToAdd) => handleAddAreaToDashboard(areaToAdd)}
                    />

                    <HorizontalSeparator />

                    <div className="button-container">
                        <Button variant="secondary" type="button" value="Avbryt" onClick={() => router.push("/Admin?tab=Dashbord")}>Avbryt</Button>
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



const AreasContainer = styled.div`
    display: flex;
    flex-direction: column;

    gap: 16px;

    .new-list {
        list-style: none;
        padding: 0;
        
        section {
            display: inline-block;
        }

        .colored {
            color: var(--navBla);
            text-decoration: underline;
            background-color: none;
            border: none;

            label {
                position: absolute;
                z-index: -1000;
            }

            :hover {
                text-decoration: none;
                cursor: pointer;
            }
        }

        li {
            p {
                margin: 8px 0;

                display: flex;
                justify-content: space-between;
            }
        }
    }
`

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
        <AreasContainer>
            
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

        </AreasContainer>
    )
}

export default NewDashboard