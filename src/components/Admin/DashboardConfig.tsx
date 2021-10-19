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
            <p>
                <Knapp kompakt onClick={() => updateEditNewDashboard(!editNewDashboard)}>{!editNewDashboard ? "Legg til nytt dashbord" : "Avbryt nytt dashbord"}</Knapp>
            </p>
            {editNewDashboard &&
                <AddNewDashboard reload={reload}/>
            }
            <DashboardTable dashboards={dashboards} />
        </DashboardConfigContainer>
    )
}





const CloseCustomized = styled(Close)`
    color: red;
    :hover {
        color: grey;
        border: 1px solid;
        cursor: pointer;
    }
`

/* Helpers below */

const DashboardTable: React.FC<{dashboards: Dashboard[]}> = ({dashboards}) => {
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
        <table className="tabell tabell--stripet">
            <thead>
                <tr>
                    <th>Navn på Dashbord</th>
                    <th>Slett</th>
                    <th></th>
                </tr>
            </thead>
                {dashboards.map((dashboard) => {
                    return (
                        <tbody key={dashboard.id}>
                            <tr onClick={() => toggleExpanded(dashboard.id)}>
                                <td>
                                    {dashboard.name}
                                </td>
                                <td>
                                    <CloseCustomized aria-label="Fjern tjenesten fra område"
                                        onClick={() => handleDeleteDashboard(dashboard)}
                                    />
                                </td>
                                <td><span>{!expanded ? <Collapse /> : <Expand />}</span></td>

                            </tr>
                            {expanded.includes(dashboard.id) &&
                                <AddAreaToDashboardDropdown dashboardWithoutIdProp={dashboard} allAreas={allAreas}
                                    toggleExpanded={() => toggleExpanded(dashboard.id)}
                                    handlePutAreasToDashboard={(areasToAdd) => handlePutAreasToDashboard(dashboard.id, areasToAdd)}
                                />
                            }
                        </tbody>
                    )
                })}
        </table>
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







const DashboardDropdownTr = styled.tr`
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
            <tr><td><CustomNavSpinner /></td></tr>
            )
        }


    return (
        <DashboardDropdownTr>
            <DropdownContent dashboardWithoutIdProp={dashboardWithoutIdProp}
                allAreas={allAreas} entireDashboard={entireDashboard}
                toggleExpanded={toggleExpanded} handlePutAreasToDashboard={handlePutAreasToDashboard}
            />
        </DashboardDropdownTr>
    )
}






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
        console.log(newDashboardAreas)
        handlePutAreasToDashboard(entireDashboard.id, newDashboardAreas)
    }


    return (
        <td>
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
            <div>
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
            </div>
            <div className="clickable" onClick={toggleExpanded}></div>
        </td>
    )
}

export default DashboardConfig