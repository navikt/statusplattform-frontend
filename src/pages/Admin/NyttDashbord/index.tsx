import router from "next/router"
import { useContext, useEffect, useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import styled from "styled-components"

import { BodyShort, Button, Detail, Select, TextField, ToggleGroup } from "@navikt/ds-react"
import { Delete } from "@navikt/aksel-icons"

import { useLoader } from "../../../utils/useLoader"
import { Area, Dashboard } from "../../../types/types"
import Layout from "../../../components/Layout"
import CustomNavSpinner from "../../../components/CustomNavSpinner"
import { ButtonContainer, DynamicListContainer, HorizontalSeparator } from ".."
import { TitleContext } from "../../../components/ContextProviders/TitleContext"
import { postDashboard, postExternalDashboard } from "../../../utils/dashboardsAPI"
import { fetchAreas } from "../../../utils/areasAPI"
import { RouterAdminDashboards } from "../../../types/routes"
import { backendPath } from "../.."
import { EndPathAreas } from "../../../utils/apiHelper"
import OpsMessages from "../../Driftsmeldinger"

const NewDashboardContainer = styled.div`
    display: flex;
    flex-direction: column;

    @media (min-width: 600px) {
        width: 600px;
    }

    input,
    select {
        margin: 1rem 0;
    }
`

export const getServerSideProps = async () => {
    const [resAreas] = await Promise.all([fetch(backendPath + EndPathAreas())])

    const allAreasProps = await resAreas.json()

    return {
        props: {
            allAreasProps,
        },
    }
}

const NewDashboard = ({ allAreasProps }) => {
    const allAreas: Area[] = allAreasProps
    const [newDashboard, updateNewDashboard] = useState<Dashboard>({
        name: "",
        areas: [],
        opsMessages: [],
    })
    const [isExternal, setIsExternal] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setIsLoading(false)
    }, [])

    if (isLoading) {
        return <CustomNavSpinner />
    }

    const handleChangeDashboardName = (event) => {
        const changedDashboard = {
            name: event.target.value,
            areas: [...newDashboard.areas],
            opsMessages: newDashboard.opsMessages,
        }
        updateNewDashboard(changedDashboard)
    }

    const handleAddAreaToDashboard = (areaToAdd: Area) => {
        if (newDashboard.areas.includes(areaToAdd)) {
            toast.warn("Område " + areaToAdd.name + " er allerede i dashbord")
            return
        }
        const updatedList = [...newDashboard.areas, areaToAdd]
        const updatedDashboard: Dashboard = {
            name: name,
            areas: updatedList,
            opsMessages: newDashboard.opsMessages,
        }
        updateNewDashboard(updatedDashboard)
        toast.success("Lagt område til dashbord")
    }

    const handleDeleteAreaOnDashboard = (areaToDelete: Area) => {
        const newAreaList: Area[] = [
            ...newDashboard.areas.filter((area) => area != areaToDelete),
        ]
        const updatedDashboard: Dashboard = {
            name: name,
            areas: newAreaList,
            opsMessages: newDashboard.opsMessages,
        }
        updateNewDashboard(updatedDashboard)
        toast.success("Fjernet område fra dashbord")
    }

    const handlePostNewDashboard = (event) => {
        event.preventDefault()
        postDashboard(newDashboard, isExternal)
            .then(() => {
                toast.success("Dashbord lastet opp")
                
                router.push(RouterAdminDashboards.PATH)
            })
            .catch(() => {
                toast.error("Klarte ikke å laste opp dashbord")
            })
    }

    const handleToggleExternal = (eventString) => {
        console.log(eventString)
        if (eventString === 'internal'){
            setIsExternal(false)
        }
        else if (eventString === 'external') {
            setIsExternal(true)
        }
    }

    const { name } = newDashboard

    return (
        <Layout>
            <NewDashboardContainer>
                <form onSubmit={(event) => handlePostNewDashboard(event)}>
                    <Detail size="small" spacing>
                        Felter markert med * er obligatoriske
                    </Detail>

                    <TextField
                        type="text"
                        required
                        label="Navn på dashbord"
                        value={name}
                        onChange={(event) => handleChangeDashboardName(event)}
                        placeholder="Navn*"
                    />

                    <DashboardAreas
                        newDashboard={newDashboard}
                        allAreas={allAreas}
                        handleDeleteAreaOnDashboard={(areaToDelete) =>
                            handleDeleteAreaOnDashboard(areaToDelete)
                        }
                        handleAddAreaToDashboard={(areaToAdd) =>
                            handleAddAreaToDashboard(areaToAdd)
                        }
                    />
                    <div style={{height: "20px"}}/>
                    <ToggleGroup defaultValue="internal" onChange={handleToggleExternal} label="Synlighet på dashboard: ">
                        <ToggleGroup.Item value="internal">Intern</ToggleGroup.Item> 
                        <ToggleGroup.Item value="external">Ekstern</ToggleGroup.Item> 
                    </ToggleGroup>
                    
                   <HorizontalSeparator />

                    <ButtonContainer>
                        <Button
                            variant="secondary"
                            type="button"
                            value="Avbryt"
                            onClick={() =>
                                router.push(RouterAdminDashboards.PATH)
                            }
                        >
                            Avbryt
                        </Button>
                        <Button type="submit" value="Legg til dashbord">
                            Lagre
                        </Button>
                    </ButtonContainer>
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

const DashboardAreas = ({
    newDashboard,
    allAreas,
    handleDeleteAreaOnDashboard,
    handleAddAreaToDashboard,
}: DashboardProps) => {
    const availableAreas: Area[] = allAreas.filter(
        (area) => !newDashboard.areas.map((a) => a.id).includes(area.id)
    )
    const { changeTitle } = useContext(TitleContext)
    const [selectedArea, changeSelectedArea] = useState<Area | null>(() =>
        availableAreas.length > 0 ? availableAreas[0] : null
    )

    useEffect(() => {
        changeTitle("Opprett nytt dashbord")
        if (availableAreas.length > 0) {
            changeSelectedArea(availableAreas[0])
        } else {
            changeSelectedArea(null)
        }
    }, [allAreas, newDashboard.areas])

    const handleUpdateSelectedArea = (event) => {
        const idOfSelectedArea: string = event.target.value
        const newSelectedArea: Area = availableAreas.find(
            (area) => idOfSelectedArea === area.id
        )
        changeSelectedArea(newSelectedArea)
    }

    const dependencyHandler = () => {
        if (!selectedArea) {
            toast.info("Ingen områder valgt")
            return
        }
        handleAddAreaToDashboard(selectedArea)
    }

    return (
        <DynamicListContainer>
            <div className="column">
                <Select
                    label="Legg til område"
                    value={selectedArea !== null ? selectedArea.id : ""}
                    onChange={handleUpdateSelectedArea}
                >
                    {availableAreas.length > 0 ? (
                        availableAreas.map((area) => {
                            return (
                                <option key={area.id} value={area.id}>
                                    {area.name}
                                </option>
                            )
                        })
                    ) : (
                        <option key={undefined} value="">
                            Ingen områder å legge til
                        </option>
                    )}
                </Select>
                <Button
                    variant="secondary"
                    type="button"
                    onClick={dependencyHandler}
                >
                    Legg til
                </Button>
            </div>

            <div className="column">
                {newDashboard.areas.length > 0 && (
                    <div>
                        <b>Områder i dashbord</b>
                        <ul className="new-list">
                            {newDashboard.areas.map((area) => {
                                return (
                                    <li key={area.id}>
                                        <BodyShort>
                                            {area.name}
                                            <button
                                                className="colored"
                                                type="button"
                                                onClick={() =>
                                                    handleDeleteAreaOnDashboard(
                                                        area
                                                    )
                                                }
                                            >
                                                <label>{area.name}</label>
                                                <Delete /> Slett
                                            </button>
                                        </BodyShort>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                )}
            </div>
        </DynamicListContainer>
    )
}

export default NewDashboard
