import { Close, Collapse, Expand } from '@navikt/ds-icons'
import CustomNavSpinner from 'components/CustomNavSpinner'
import { Hovedknapp, Knapp } from 'nav-frontend-knapper'
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
            <Dashboards dashboards={dashboards} />
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

const CloseCustomized = styled(Close)`
    color: red;
    :hover {
        color: grey;
        border: 1px solid;
        cursor: pointer;
    }
`

const Dashboards: React.FC<{dashboards: Dashboard[]}> = ({dashboards}) => {
    const [expanded, setExpanded] = useState<string[]>([])
    const { data: allAreas, isLoading, reload } = useLoader(fetchAreas,[]);


    const handleDeleteDashboard = (dashboard: Dashboard) => {
        deleteDashboard(dashboard).then(() => {
            toast.info("Dashbordet ble slettet")
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
                        <DashboardRowInner onClick={() => toggleExpanded(dashboard.id)}>
                            <span>
                                {dashboard.name}
                                <CloseCustomized aria-label="Fjern tjenesten fra område"
                                    onClick={() => handleDeleteDashboard(dashboard)}
                                />
                            </span>
                            {/* <span> */}
                            {/* </span> */}
                            <span>{!expanded.includes(dashboard.id) ? <Collapse /> : <Expand />}</span>
                        </DashboardRowInner>
                        {expanded.includes(dashboard.id) &&
                            <AddAreaToDashboardDropdown dashboardWithoutIdProp={dashboard} allAreas={allAreas}
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
    

    const handlePostNewDashboard = () => {
        postDashboard(newDashboard).then(() => {
            toast.success("Dashbord lastet opp")
        }).catch(() => {
            toast.error("Klarte ikke å laste opp dashbord")
        })
        reload()
    }

    const { name } = newDashboard

    return (
        <form onSubmit={handlePostNewDashboard} id="form">
            <p>Felter markert med * er obligatoriske</p>
            <AddNewDashboardContainer>
                <Input type="text" required label="Navn på dashbord" value={name} onChange={(event) => handleChangeDashboardName(event)} placeholder="Navn*" />
                <Hovedknapp kompakt htmlType="submit" value="Legg til dashbord">Legg til dashbord</Hovedknapp>
            </AddNewDashboardContainer>
        </form>
    )
}









interface DashboardProps {
    dashboardWithoutIdProp?: Dashboard
    allAreas: Area[]
    toggleExpanded: () => void
    entireDashboard?: Dashboard
    handlePutAreasToDashboard: Function
}

const AddAreaToDashboardDropdown = ({dashboardWithoutIdProp, allAreas, toggleExpanded, handlePutAreasToDashboard}:DashboardProps) => {
    const { data: entireDashboard, isLoading, reload } = useLoader(() => fetchDashboard(dashboardWithoutIdProp.id),[]);

    
    if(isLoading) {
        return (
            <CustomNavSpinner />
        )
    }


    return (
        <DropdownContent dashboardWithoutIdProp={dashboardWithoutIdProp}
            allAreas={allAreas} entireDashboard={entireDashboard}
            toggleExpanded={toggleExpanded} handlePutAreasToDashboard={handlePutAreasToDashboard}
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

const DropdownContent = ({allAreas, toggleExpanded, entireDashboard, handlePutAreasToDashboard}: DashboardProps) => {
    const availableAreas: Area[] = allAreas.filter(area => !entireDashboard.areas.map(a => a.id).includes(area.id))
    const [selectedArea, changeSelectedArea] = useState<Area|null>(() => availableAreas.length > 0 ? availableAreas[0] : null)

    const handleUpdateSelectedArea = (event) => {
        const idOfSelectedArea: string = event.target.value
        const newSelectedArea: Area = availableAreas.find(area => idOfSelectedArea === area.id)
        changeSelectedArea(newSelectedArea)
    }

    const handleAddAreaToDashboard = () => {
        const newDashboardAreas: string[] = [...entireDashboard.areas.map(area => area.id), selectedArea.id]
        handlePutAreasToDashboard(entireDashboard.id, newDashboardAreas)
    }

    const handleDeleteAreaFromDashboard = () => {
        const newDashboardAreas: string[] = [...entireDashboard.areas.map(area => area.id)].filter(id => id == selectedArea.id)
        handlePutAreasToDashboard(entireDashboard.id, newDashboardAreas)
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
                                <li key={area.id}>{area.name}<CloseCustomized onClick={handleDeleteAreaFromDashboard}/></li>
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
                    {availableAreas ?
                        availableAreas.map(area => {
                            return (
                                <option key={area.id} value={area.id}>{area.name}</option>
                            )
                        })
                    :
                        <option key={undefined} value="">Ingen områder å legge til</option>
                    }
                </Select>
                <Hovedknapp disabled={!selectedArea} onClick={handleAddAreaToDashboard} >
                    Legg til
                </Hovedknapp>                                            
            </DropdownColumn>
            <DropdownColumn className="clickable" onClick={toggleExpanded}></DropdownColumn>
        </DashboardDropRow>
    )
}

export default DashboardConfig