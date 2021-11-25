import { useState } from 'react'
import Head from 'next/head'
import { toast } from 'react-toastify'
import styled from 'styled-components'

import { Close, Collapse, Expand, Notes } from '@navikt/ds-icons'
import { Hovedknapp, Knapp } from 'nav-frontend-knapper'
import ModalWrapper from 'nav-frontend-modal'
import { Input, Select } from 'nav-frontend-skjema'

import CustomNavSpinner from 'components/CustomNavSpinner'
import { Area, Dashboard } from 'types/navServices'
import { deleteDashboard } from 'utils/deleteDashboard'
import { fetchAreas } from 'utils/fetchAreas'
import { fetchDashboard } from 'utils/fetchDashboard'
import { fetchDashboardsList } from 'utils/fetchDashboardsList'
import { postDashboard } from 'utils/postDashboard'
import { putAreasToDashboard } from 'utils/putAreasToDashboard'

import { useLoader } from 'utils/useLoader'


const DashboardTableContainer = styled.div`
    width: 100%;
    .knapp {
        text-transform: none;
    }
`


const DashboardTable = () => {
    const [editNewDashboard, updateEditNewDashboard] = useState(false)
    const { data: dashboards, isLoading, reload } = useLoader(fetchDashboardsList,[]);


    if (isLoading) {
        return (
            <CustomNavSpinner/>
        ) 
    }

    return (
        <DashboardTableContainer>
            <Head>
                <title>Admin - Dashbord</title>
            </Head>
            <Knapp mini onClick={() => updateEditNewDashboard(!editNewDashboard)}>{
                !editNewDashboard ? "Legg til nytt dashbord" : "Avbryt nytt dashbord"}
            </Knapp>
            {editNewDashboard &&
                <AddNewDashboard reload={reload}/>
            }
            <Dashboards dashboards={dashboards} reloadDashboards={reload}/>
        </DashboardTableContainer>
    )
}






/* ----------------------- Helpers below ----------------------- */









const DashboardsContainer = styled.div`
    overflow-x: auto;
    div {
        min-width: fit-content;
    }
`

const DashboardsHeader = styled.div`
    padding: 0 1rem;
    font-weight: bold;
    border-bottom: 1px solid rgba(0, 0, 0, 0.55);
`

const DashboardRowContainer = styled.div`
    min-height: 5rem;
    padding: 1px 0;
    border-top: 1px solid rgba(0, 0, 0, 0.55);
    border-bottom: 1px solid rgba(0, 0, 0, 0.55);
    :hover {
        padding: 0;
        border-top: 2px solid rgba(0, 0, 0, 0.55);
        border-bottom: 2px solid rgba(0, 0, 0, 0.55);
    }
    :last-child {
        padding-bottom: 0;
        border-bottom: 2px solid rgba(0, 0, 0, 0.55);
    }
    &.editting {
        border-color: var(--navBla);
    }
`

const DashboardRowInner = styled.div`
    min-height: 5rem;
    padding-left: 1rem;
    background-color: var(--navGraBakgrunn);

    display: flex;
    flex-direction: row;

    button {
        background-color: transparent;
        border: none;

        height: 100%;
        padding: 0 1rem;

        justify-self: flex-end;

        :hover {
            cursor: pointer;
            color: grey;
        }
    }
`

const ClickableName = styled.div`
    width: 160px;
    margin-right: 20px;

    &.editting {
        input {

            width: 152px;
        }
    }

    display: flex;
    align-items: center;
    flex-grow: 1;

    :hover {
        cursor: pointer;
    }
`

const CustomButton = styled.button`
    background-color: transparent;
    border: none;
    :hover {
        cursor: pointer;
    }
`

const ModalInner = styled.div`
    padding: 2rem 2.5rem;
    display: flex;
    flex-direction: column;
    .knapp {
        margin: 1rem;
    }
`

const Dashboards: React.FC<{dashboards: Dashboard[], reloadDashboards: () => void}> = ({dashboards, reloadDashboards}) => {
    const [expanded, setExpanded] = useState<string[]>([]) 
    const [dashboardToDelete, setDashboardToDelete] = useState<Dashboard>()    
    const [dashboardsToEdit, changeDashboardsToEdit] = useState<string[]>([])
    const { data: allAreas, isLoading, reload } = useLoader(fetchAreas,[]);

    const handlePutAreasToDashboard = (dashboardId: string, areasToPut: string[]) => {
        putAreasToDashboard(dashboardId, areasToPut).then(() => {
            toast.success("Dashbord oppdatert")
        }).catch(() => {
            toast.error("Kunne ikke oppdatere dashbord")
        })
    }

    const toggleExpanded = (dashboard: Dashboard) => {
        if(expanded.includes(dashboard.id)) {
            setExpanded([...expanded.filter(i => i !== dashboard.id)])
        } else {
            setExpanded([...expanded, dashboard.id])
        }
    }

    const confirmDeleteDashboardHandler = () => {
        deleteDashboard(dashboardToDelete).then(() => {
            toast.info("Dashbordet ble slettet")
            setDashboardToDelete(null);
            reloadDashboards()
        }).catch(() => {
            toast.error("Kunne ikke slette dashbord")
        })
    }

    const toggleEditDashboard = (dashboard: Dashboard) => {
        let edittingDashboards: string[] = [...dashboardsToEdit]
        if(edittingDashboards.includes(dashboard.id)) {
            changeDashboardsToEdit(edittingDashboards.filter(d => d != dashboard.id))
            return
        }
        edittingDashboards.push(dashboard.id)
        changeDashboardsToEdit(edittingDashboards)
    }

    return (
        <DashboardsContainer>
            <ModalWrapper
                isOpen={!!dashboardToDelete}
                onRequestClose={() => setDashboardToDelete(null)}
                closeButton={true}
                contentLabel="Min modalrute"
            >
                <ModalInner>Ønsker du å slette dashbordet?
                    <Knapp mini onClick={confirmDeleteDashboardHandler}>Slett dashbord</Knapp>
                    <Knapp mini onClick={() => setDashboardToDelete(null)}>Avbryt</Knapp>
                </ModalInner>
            </ModalWrapper>
            <div>
                <DashboardsHeader>
                    <p><b>Navn på Dashbord</b></p>
                </DashboardsHeader>
                {dashboards.map((dashboard) => {
                    return (
                        <DashboardRowContainer className={dashboardsToEdit.includes(dashboard.id) ? "editting" : ""} key={dashboard.id}>



                                {!dashboardsToEdit.includes(dashboard.id) ?
                                    <CurrentDashboardData 
                                        expanded={expanded}
                                        dashboard={dashboard}
                                        setDashboardToDelete={() => setDashboardToDelete(dashboard)}
                                        toggleEditDashboard={() => toggleEditDashboard(dashboard)}
                                        toggleExpanded={() => toggleExpanded(dashboard)}
                                    />
                                    :
                                    <CurrentlyEdittingDashboard dashboard={dashboard}
                                        expandedList={expanded}
                                        reloadDashboards={reloadDashboards}
                                        setDashboardToDelete={() => setDashboardToDelete(dashboard)}
                                        toggleEditDashboard={() => toggleEditDashboard(dashboard)}
                                        toggleExpanded={() => toggleExpanded(dashboard)}
                                    />
                                }
                                


                            {expanded.includes(dashboard.id) &&
                                <AddAreaToDashboardDropdown 
                                    dashboardWithOnlyIdProp={dashboard} 
                                    allAreas={allAreas}
                                    editting={dashboardsToEdit.includes(dashboard.id)}
                                    toggleExpanded={() => toggleExpanded(dashboard)}
                                    handlePutAreasToDashboard={(dashboardId, areasToAdd) => handlePutAreasToDashboard(dashboardId, areasToAdd)}
                                />
                            }
                        </DashboardRowContainer>
                    )
                })}
            </div>
        </DashboardsContainer>
    )
}






// --------------------------------------------------------------------------





interface CurrentDashboardDataProps {
    setDashboardToDelete: () => void
    toggleEditDashboard: () => void
    toggleExpanded: () => void
    expanded: string[]
    dashboard: Dashboard
}


const CurrentDashboardData = ({setDashboardToDelete, toggleEditDashboard, toggleExpanded, expanded, dashboard}: CurrentDashboardDataProps) => {

    return (
        <DashboardRowInner>
            <ClickableName onClick={toggleExpanded}>
                {dashboard.name}
            </ClickableName>

            <div className="button-container">
                <CustomButton className="option" onClick={toggleEditDashboard}>
                    <Notes />
                </CustomButton>
                <button className="option" onClick={setDashboardToDelete} aria-label="Slett område"><Close/></button>
                <button className="option" onClick={toggleExpanded} aria-expanded={expanded.includes(dashboard.id)}>
                    {expanded.includes(dashboard.id) ? <Collapse /> : <Expand />}
                </button>
            </div>

        </DashboardRowInner>
    )
}





/* ------------------------------------------ ------------------------------------------ */




interface EditProps {
    dashboard: Dashboard
    reloadDashboards: () => void
    setDashboardToDelete: () => void
    toggleEditDashboard: () => void
    toggleExpanded: () => void
    expandedList: string[]
}


const CurrentlyEdittingDashboard = ({dashboard, reloadDashboards, setDashboardToDelete, toggleEditDashboard, toggleExpanded, expandedList}: EditProps) => {
    const [updatedDashboard, changeUpdatedDashboard] = useState({
        name: dashboard.name
    })

    const handleUpdatedDashboard = (event) => {
        const changedDashboard = {
            name: event.target.value,
        }
        changeUpdatedDashboard(changedDashboard)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        toast.info("Mangler endepunkt")
        // Uncomment det nedenfor når endepunkt er implementert
        // reloadDashboards()
    }

    const { name } = updatedDashboard
    return (
        <form onSubmit={handleSubmit}>
            <DashboardRowInner>
                <ClickableName className="editting" onClick={toggleExpanded} >
                    <Input value={name} onChange={event => handleUpdatedDashboard(event)} onClick={(event) => event.stopPropagation()} />
                </ClickableName>

                <div className="button-container">
                    <button type="button" className="option" onClick={toggleEditDashboard} aria-label="Fjern dashbord">
                        Avbryt endringer
                    </button>
                    <button type="button" className="option" onClick={setDashboardToDelete} aria-label="Slett område"><Close/></button>
                    <button type="button" className="option" onClick={toggleExpanded} aria-expanded={expandedList.includes(dashboard.id)}>{expandedList.includes(dashboard.id) ? <Collapse /> : <Expand />}</button>
                </div>

            </DashboardRowInner>
        </form>
    )
}





/* ------------------------------------------ ------------------------------------------ */




const AddNewDashboardContainer = styled.div`
    max-width: 500px;
    input {
        margin-bottom: 1rem;
    }
`

const AddNewDashboard: React.FC<{reload: Function}> = ({reload}) => {
    const [newDashboard, updateNewDashboard] = useState<Dashboard>({
        name: "",
        areas: []
    })


    const handleChangeDashboardName = (event) => {
        const changedDashboard = {
            name: event.target.value,
            areas: []
        }
        updateNewDashboard(changedDashboard)
    }
    

    const handlePostNewDashboard = (event) => {
        event.preventDefault()
        postDashboard(newDashboard).then(() => {
            toast.success("Dashbord lastet opp")
            reload()
        }).catch(() => {
            toast.error("Klarte ikke å laste opp dashbord")
        })
    }

    const { name } = newDashboard

    return (
        <form onSubmit={event => handlePostNewDashboard(event)} id="form">
            <p>Felter markert med * er obligatoriske</p>
            <AddNewDashboardContainer>
                <Input type="text" required label="Navn på dashbord" value={name} onChange={(event) => handleChangeDashboardName(event)} placeholder="Navn*" />
                <Hovedknapp kompakt htmlType="submit" value="Legg til dashbord">Legg til dashbord</Hovedknapp>
            </AddNewDashboardContainer>
        </form>
    )
}









interface DashboardProps {
    dashboardWithOnlyIdProp?: Dashboard
    entireDashboard?: Dashboard
    allAreas: Area[]
    editting?: boolean
    handlePutAreasToDashboard: Function
    toggleExpanded: () => void
    reload?: () => void
}

const AddAreaToDashboardDropdown = ({dashboardWithOnlyIdProp: dashboardWithoutIdProp, allAreas, editting, toggleExpanded, handlePutAreasToDashboard}:DashboardProps) => {
    const { data: entireDashboard, isLoading, reload } = useLoader(() => fetchDashboard(dashboardWithoutIdProp.id),[]);

    
    if(isLoading) {
        return (
            <CustomNavSpinner />
        )
    }


    return (
        <DropdownContent dashboardWithOnlyIdProp={dashboardWithoutIdProp}
            allAreas={allAreas} entireDashboard={entireDashboard}
            toggleExpanded={toggleExpanded} handlePutAreasToDashboard={handlePutAreasToDashboard}
            reload={reload}
            editting={editting}
        />
    )
}







/* ------------------------------------------ ------------------------------------------ */






const DashboardDropRow = styled.div`
    padding: 0 1rem;
    display: flex;
    flex-direction: row;
    ul {
        list-style: none;
        padding: 0;
        li {
            display: flex;
            justify-content: space-between;
        }
    }

    .knapp {
        margin: 1rem 0;
    }

    .clickable {
        flex-grow: 1;
        :hover {
            cursor: pointer;
        }
    }
`

const DropdownColumn = styled.div`
    padding: 1rem 0;
    width: 100%;
    max-width: 300px;

    display: flex;
    flex-direction: column;

    select {
        cursor: pointer;
    }
`

const DropdownContent = ({allAreas, toggleExpanded, entireDashboard, handlePutAreasToDashboard, reload, editting}: DashboardProps) => {
    const availableAreas: Area[] = allAreas.filter(area => !entireDashboard.areas.map(a => a.id).includes(area.id))
    const [selectedArea, changeSelectedArea] = useState<Area|null>(() => availableAreas.length > 0 ? availableAreas[0] : null)

    const handleUpdateSelectedArea = (event) => {
        const idOfSelectedArea: string = event.target.value
        const newSelectedArea: Area = availableAreas.find(area => idOfSelectedArea === area.id)
        changeSelectedArea(newSelectedArea)
    }

    const handleAddAreaToDashboard = async () => {
        if(availableAreas.length != 0) {
            const newDashboardAreas: string[] = [...entireDashboard.areas.map(area => area.id), selectedArea.id]
            await handlePutAreasToDashboard(entireDashboard.id, newDashboardAreas)
            reload()
            return
        }
        toast.error("Det er ikke flere områder å legge til")
    }

    const handleDeleteAreaFromDashboard = async (areaToDelete: Area) => {
        const newDashboardAreas: string[] = [...entireDashboard.areas.map(area => area.id)].filter(id => id != areaToDelete.id)
        await handlePutAreasToDashboard(entireDashboard.id, newDashboardAreas)
        reload()
    }


    return (
        <DashboardDropRow>
            {editting
                ?
                    <DropdownColumn>
                        {entireDashboard.areas.length == 0 &&
                            <div>
                                Ingen områder i dashbord
                            </div>
                        }
                        <Select value={selectedArea !== null ? selectedArea.id : ""} onChange={handleUpdateSelectedArea}>
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
                        <Hovedknapp onClick={handleAddAreaToDashboard} >
                            Legg til
                        </Hovedknapp>
                        {entireDashboard.areas.length > 0 &&
                            <div>
                                <b>Områder i dashbord</b>
                                <ul>
                                    {entireDashboard.areas.map((area) => {
                                        return (
                                            <li key={area.id}>{area.name} 
                                                <CustomButton onClick={() => handleDeleteAreaFromDashboard(area)} aria-label="Fjern område fra dashbord">
                                                    <Close/>
                                                </CustomButton>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        }
                    </DropdownColumn>
                :
                    <DropdownColumn>
                        {entireDashboard.areas.length == 0
                        ?
                            <div>
                                Ingen områder i dashbord
                            </div>
                        :
                            <div>
                                <b>Områder i dashbord</b>
                                <ul>
                                    {entireDashboard.areas.map((area) => {
                                        return (
                                            <li key={area.id}>{area.name}</li>
                                        )
                                    })}
                                </ul>
                            </div>
                        }
                    </DropdownColumn>
            }
        <div className="clickable" onClick={toggleExpanded}></div>
        </DashboardDropRow>
        
    )
}

export default DashboardTable