import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { toast } from 'react-toastify'
import styled from 'styled-components'

import { Expand, Notes } from '@navikt/ds-icons'
import ModalWrapper from 'nav-frontend-modal'
import { BodyShort, Button, Select, TextField } from '@navikt/ds-react'

import CustomNavSpinner from '../../components/CustomNavSpinner'
import { ModalInner } from '.';
import { CloseCustomized } from '.'
import { Area, Dashboard } from '../../types/navServices'
import { useLoader } from '../../utils/useLoader'
import { TitleContext } from '../ContextProviders/TitleContext'
import { deleteDashboard, fetchDashboard, fetchDashboardsList, postDashboard, updateDashboard } from '../../utils/dashboardsAPI'
import { fetchAreas, putAreasToDashboard } from '../../utils/areasAPI'
import { RouterAdminAddDashboard } from '../../types/routes'



const DashboardTableContainer = styled.div`
    width: 100%;
    
    .centered {
        display: flex;
        justify-content: center;

        margin: 60px 0;
    }
`


const DashboardTable = () => {
    const { data: dashboards, isLoading, reload } = useLoader(fetchDashboardsList,[]);

    const { changeTitle } = useContext(TitleContext)

    useEffect(() => {
        changeTitle("Admin - Dashbord")
    })

    const router = useRouter()

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
            <div className="centered">
                <Button variant="secondary" 
                        onClick={() => router.push(RouterAdminAddDashboard.PATH)}>
                    <b>Legg til nytt dashbord</b>
                </Button>
            </div>
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
    padding: 0 16px;
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
    padding-left: 16px;
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
    padding-right: 20px;

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
                contentLabel="Slettemodal"
            >
                <ModalInner>Ønsker du å slette dashbordet?
                    <Button variant="secondary" onClick={confirmDeleteDashboardHandler}>Slett dashbord</Button>
                    <Button variant="secondary" onClick={() => setDashboardToDelete(null)}>Avbryt</Button>
                </ModalInner>
            </ModalWrapper>


            <div>
                <DashboardsHeader>
                    <BodyShort spacing><b>Navn på Dashbord</b></BodyShort>
                </DashboardsHeader>

                
                {dashboards.map((dashboard) => {
                    return (
                        <DashboardRowContainer className={dashboardsToEdit.includes(dashboard.id) ? "editting" : ""} key={dashboard.id}>



                                {!dashboardsToEdit.includes(dashboard.id) ?
                                    <CurrentDashboardData 
                                        expandedList={expanded}
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
    expandedList: string[]
    dashboard: Dashboard
}


const CurrentDashboardData = ({setDashboardToDelete, toggleEditDashboard, toggleExpanded, expandedList, dashboard}: CurrentDashboardDataProps) => {

    return (
        <DashboardRowInner>
            <ClickableName onClick={toggleExpanded}>
                {dashboard.name}
            </ClickableName>

            <div className="button-container">
                <CustomButton className="option" onClick={toggleEditDashboard}>
                    <Notes />
                </CustomButton>
                <button className="option" onClick={setDashboardToDelete} aria-label="Slett område"><CloseCustomized /></button>
                <button className="option" onClick={toggleExpanded} aria-expanded={expandedList.includes(dashboard.id)}>
                    <Expand className={expandedList.includes(dashboard.id) ? "expanded" : "not-expanded"} />
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

    const handleSubmit = () => {
        updateDashboard(dashboard, updatedDashboard.name).then(() => {
            reloadDashboards()
            toast.success("Oppdatering gjennomført")
        }).catch(() => {
            toast.error("Noe gikk galt i oppdatering av dashbord")
        })
    }

    const { name } = updatedDashboard
    return (
        <form onSubmit={handleSubmit}>
            <DashboardRowInner>
                <ClickableName className="editting" onClick={toggleExpanded} >
                    <TextField label="Navn" hideLabel value={name} onChange={event => handleUpdatedDashboard(event)} onClick={(event) => event.stopPropagation()} />
                </ClickableName>

                <div className="button-container">
                    <button type="button" className="option" onClick={handleSubmit}>
                        Lagre endringer
                    </button>
                    <button type="button" className="option" onClick={toggleEditDashboard} >
                        Avbryt endringer
                    </button>
                    <button type="button" className="option" onClick={setDashboardToDelete} aria-label="Slett dashbord"><CloseCustomized /></button>
                    <button type="button" className="option" onClick={toggleExpanded} aria-expanded={expandedList.includes(dashboard.id)}>
                        <Expand className={expandedList.includes(dashboard.id) ? "expanded" : "not-expanded"} />
                    </button>
                </div>

            </DashboardRowInner>
        </form>
    )
}





/* ------------------------------------------ ------------------------------------------ */



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
    border-top: 2px solid rgba(0, 0, 0, 0.1);
    background-color: var(--navGraBakgrunn);
    padding: 0 1rem;

    display: flex;
    flex-direction: row;

    .editting {
        ul {
            list-style: none;
            padding: 0;
            
            li {
                display: flex;
                justify-content: space-between;
            }
        }
    }

    .add-button {
        margin: 1rem 0;
        min-width: 148px;
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
    max-width: 242px;

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    select {
        cursor: pointer;
        margin: 1rem 0;
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
                    <Select value={selectedArea !== null ? selectedArea.id : ""} onChange={handleUpdateSelectedArea}
                        label="Velg område å legge til dashbord" hideLabel
                    >
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

                    <div>
                        <Button variant="secondary" className="add-button" onClick={handleAddAreaToDashboard}>Legg til</Button>
                    </div>



                    {entireDashboard.areas.length > 0 &&
                        <div className="editting">
                            <b>Områder i dashbord</b>
                            <ul>
                                {entireDashboard.areas.map((area) => {
                                    return (
                                        <li key={area.id}>{area.name} 
                                            <CustomButton onClick={() => handleDeleteAreaFromDashboard(area)} aria-label="Fjern område fra dashbord">
                                                <CloseCustomized />
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