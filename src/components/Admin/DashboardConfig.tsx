import { Close, Collapse, Expand } from '@navikt/ds-icons'
import CustomNavSpinner from 'components/CustomNavSpinner'
import { Hovedknapp, Knapp } from 'nav-frontend-knapper'
import ModalWrapper from 'nav-frontend-modal'
import { Input, Select } from 'nav-frontend-skjema'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import styled from 'styled-components'
import { Area, Dashboard } from 'types/navServices'
import { deleteDashboard } from 'utils/deleteDashboard'
import { fetchAreas } from 'utils/fetchAreas'
import { fetchAreasInDashboard } from 'utils/fetchAreasInDashboard'
import { fetchDashboard } from 'utils/fetchDashboard'
import { fetchDashboardsList } from 'utils/fetchDashboardsList'
import { postDashboard } from 'utils/postDashboard'
import { putAreasToDashboard } from 'utils/putAreasToDashboard'
import { useLoader } from 'utils/useLoader'

const DashboardConfigContainer = styled.div`
    width: 100%;
    overflow-x: auto;
    .knapp {
        text-transform: none;
    }
`


const DashboardConfig = () => {
    const [editNewDashboard, updateEditNewDashboard] = useState(false)
    const { data: dashboards, isLoading, reload } = useLoader(fetchDashboardsList,[]);


    if (isLoading) {
        return (
            <CustomNavSpinner/>
        ) 
    }

    return (
        <DashboardConfigContainer>
            <Knapp mini onClick={() => updateEditNewDashboard(!editNewDashboard)}>{
                !editNewDashboard ? "Legg til nytt dashbord" : "Avbryt nytt dashbord"}
            </Knapp>
            {editNewDashboard &&
                <AddNewDashboard reload={reload}/>
            }
            <Dashboards dashboards={dashboards} reloadDashboards={reload}/>
        </DashboardConfigContainer>
    )
}






/* ----------------------- Helpers below ----------------------- */

const DashboardsContainer = styled.div``

const DashboardsHeader = styled.div`
    width: 100%;
    padding: 0 1rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.55);
    p {
        width: 50%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    b:nth-child(2) {
        left: 1rem;
    }
`

const DashboardRowContainer = styled.div`
    min-height: 4rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.55);
`

const DashboardRowInner = styled.div`
    width: 100%;
    height: 4rem;
    padding: 0 1rem;
    background-color: var(--navGraBakgrunn);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    :hover {
        cursor: pointer;

    }
    span {
        width: 50%;
    }
    span:first-child {
        display: flex;
        justify-content: space-between;
    }
    span:not(first-child) {
        text-align: right;
    }
`

const ClickableName = styled.div`
    height: 100%;
    width: 50%;
    display: flex;
    align-items: center;
`

const ExpandCollapseWrapper = styled.button`
    width: 50%;
    height: 100%;
    background-color: transparent;
    border: none;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    :hover {
        border: 1px solid;
        cursor: pointer;
        border: none;
    }
`

const CloseCustomized = styled(Close)`
    color: red;
    :hover {
        color: grey;
        border: 1px solid;
        cursor: pointer;
    }
`

const Dashboards: React.FC<{dashboards: Dashboard[], reloadDashboards: () => void}> = ({dashboards, reloadDashboards}) => {
    const [expanded, setExpanded] = useState<string[]>([])
    const [toDelete, changeDelete] = useState(false)
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const { data: allAreas, isLoading, reload } = useLoader(fetchAreas,[]);


    const handleDeleteDashboard = (dashboard: Dashboard, event) => {
        // if(!toDelete) {
        //     setModalIsOpen(true)
        //     return (
        //         <ModalWrapper
        //             isOpen={modalIsOpen}
        //             onRequestClose={() => setModalIsOpen(false)}
        //             closeButton={true}
        //             contentLabel="Min modalrute"
        //         >
        //             <div style={{padding:'2rem 2.5rem'}}>Innhold her</div>
        //         </ModalWrapper>

        //     )
        // }
        deleteDashboard(dashboard).then(() => {
            toast.info("Dashbordet ble slettet")
            reloadDashboards()
        }).catch(() => {
            toast.error("Kunne ikke slette dashbord")
        })
    }

    const handlePutAreasToDashboard = (dashboardId: string, areasToPut: string[]) => {
        putAreasToDashboard(dashboardId, areasToPut).then(() => {
            toast.success("Dashbord oppdatert")
        }).catch(() => {
            toast.error("Kunne ikke oppdatere dashbord")
        })
    }

    const toggleExpanded = (dashboardId: string) => {
        if(expanded.includes(dashboardId)) {
            setExpanded([...expanded.filter(i => i !== dashboardId)])
        } else {
            setExpanded([...expanded, dashboardId])
        }
    }

    return (
        <DashboardsContainer>
            <DashboardsHeader>
                <p><b>Navn på Dashbord</b><b>Slett</b></p>
            </DashboardsHeader>
            {dashboards.map((dashboard) => {
                return (
                    <DashboardRowContainer key={dashboard.id}>
                        <DashboardRowInner>
                            <ClickableName onClick={() => toggleExpanded(dashboard.id)}>
                                {dashboard.name}
                            </ClickableName>
                            <CloseCustomized aria-label="Fjern tjenesten fra område"
                                onClick={(event) => handleDeleteDashboard(dashboard, event)}
                            />
                            <ExpandCollapseWrapper aria-expanded={expanded.includes(dashboard.id)}
                                onClick={() => toggleExpanded(dashboard.id)}>
                                {!expanded.includes(dashboard.id) 
                                    ? <Collapse /> 
                                    : <Expand />
                                }
                            </ExpandCollapseWrapper>
                        </DashboardRowInner>
                        {expanded.includes(dashboard.id) &&
                            <AddAreaToDashboardDropdown dashboardWithOnlyIdProp={dashboard} allAreas={allAreas}
                                toggleExpanded={() => toggleExpanded(dashboard.id)}
                                handlePutAreasToDashboard={(dashboardId, areasToAdd) => handlePutAreasToDashboard(dashboardId, areasToAdd)}
                            />
                        }
                    </DashboardRowContainer>
                )
            })}
        </DashboardsContainer>
    )
}




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
    allAreas: Area[]
    toggleExpanded: () => void
    entireDashboard?: Dashboard
    handlePutAreasToDashboard: Function
    reload?: () => void
}

const AddAreaToDashboardDropdown = ({dashboardWithOnlyIdProp: dashboardWithoutIdProp, allAreas, toggleExpanded, handlePutAreasToDashboard}:DashboardProps) => {
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
        />
    )
}




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
`

const DropdownColumn = styled.div`
    width: 50%;
    &.clickable {
        :hover {
            cursor: pointer;
        }
    }
`

const DropdownContent = ({allAreas, toggleExpanded, entireDashboard, handlePutAreasToDashboard, reload}: DashboardProps) => {
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
            <DropdownColumn>
            {entireDashboard.areas.length > 0?
                <div>
                    <b>Områder i dashbord</b>
                    <ul>
                        {entireDashboard.areas.map((area) => {
                            return (
                                <li key={area.id}>{area.name}<CloseCustomized onClick={() => handleDeleteAreaFromDashboard(area)}/></li>
                            )
                        })}
                    </ul>
                </div>
                :
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
            </DropdownColumn>
            <DropdownColumn className="clickable" onClick={toggleExpanded}></DropdownColumn>
        </DashboardDropRow>
    )
}

export default DashboardConfig