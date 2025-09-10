import { SetStateAction, useContext, useEffect, useState } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import { toast } from "react-toastify"
import styled from "styled-components"

import { XMarkIcon, TrashIcon, ChevronDownIcon, FileTextIcon, FloppydiskIcon } from "@navikt/aksel-icons"
import { BodyShort, Button, Modal, Select, TextField } from "@navikt/ds-react"

import CustomNavSpinner from "../CustomNavSpinner"
import { Area, Dashboard } from "../../types/types"
import { useLoader } from "../../utils/useLoader"
import { TitleContext } from "../ContextProviders/TitleContext"
import {
    deleteDashboard,
    fetchDashboard,
    fetchDashboardsList,
    postDashboard,
    updateDashboard,
} from "../../utils/dashboardsAPI"
import { fetchAreas, putAreasToDashboard } from "../../utils/areasAPI"
import { RouterAdminAddDashboard } from "../../types/routes"
import {
    AdminCategoryContainer,
    CloseCustomized,
    ModalInner,
} from "../../pages/Admin"
import { backendPath } from "../../pages"
import { EndPathDashboards } from "../../utils/apiHelper"

const TableDashbord = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [dashboards, setDashboards] = useState<Dashboard[]>()

    const { changeTitle } = useContext(TitleContext)

    useEffect(() => {
        changeTitle("Admin - Dashbord")
        setIsLoading(true)
        let controlVar = true
        const setup = async () => {
            if (controlVar) {
                try {
                    const dashboards: Dashboard[] = await fetchDashboardsList()
                    await setDashboards(dashboards)
                } catch (error) {
                    toast.error("Noe gikk galt ved henting av dashbordene")
                    console.log(error)
                } finally {
                    setIsLoading(false)
                }
            }
        }
        if (controlVar) {
            setup()
        }
        controlVar = false
    }, [changeTitle])

    const reload = async () => {
        await fetchDashboardsList()
            .then((response) => {
                setIsLoading(true)
                setDashboards(response)
                setIsLoading(false)
            })
            .catch(() => {
                toast.error("Noe gikk galt ved henting av dashbordene")
            })
    }

    const router = useRouter()

    if (isLoading) {
        return <CustomNavSpinner />
    }
    return (
        <AdminCategoryContainer>
            <Head>
                <title>Admin - Dashbord - status.nav.no</title>
            </Head>
            <div className="centered">
                <Button
                    variant="secondary"
                    onClick={() => router.push(RouterAdminAddDashboard.PATH)}
                >
                    <b>Legg til nytt dashbord</b>
                </Button>
            </div>
            <Dashboards dashboards={dashboards} reloadDashboards={reload} />
        </AdminCategoryContainer>
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
        border-color: var(--a-blue-500);
    }
`

const DashboardRowInner = styled.div`
    min-height: 5rem;
    padding-left: 16px;
    background-color: var(--a-gray-100);

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

const Dashboards: React.FC<{
    dashboards: Dashboard[]
    reloadDashboards: () => void
}> = ({ dashboards, reloadDashboards }) => {
    const [expandedList, setExpandedList] = useState<string[]>([])

    const [dashboardToDelete, setDashboardToDelete] = useState<Dashboard>()
    const [dashboardsToEdit, changeDashboardsToEdit] = useState<string[]>([])

    const { data: allAreas, isLoading, reload } = useLoader(fetchAreas, [])

    useEffect(() => {}, [])

    const toggleExpanded = (dashboard: Dashboard) => {
        if (expandedList.includes(dashboard.id)) {
            setExpandedList([...expandedList.filter((i) => i !== dashboard.id)])
        } else {
            setExpandedList([...expandedList, dashboard.id])
        }
    }

    const confirmDeleteDashboardHandler = () => {
        deleteDashboard(dashboardToDelete)
            .then(() => {
                toast.info("Dashbordet ble slettet")
                setDashboardToDelete(null)
                reloadDashboards()
            })
            .catch(() => {
                toast.error("Kunne ikke slette dashbord")
            })
    }

    const toggleEditDashboard = (dashboard: Dashboard) => {
        let edittingDashboards: string[] = [...dashboardsToEdit]
        if (edittingDashboards.includes(dashboard.id)) {
            changeDashboardsToEdit(
                edittingDashboards.filter((d) => d != dashboard.id)
            )
            return
        }
        edittingDashboards.push(dashboard.id)
        changeDashboardsToEdit(edittingDashboards)
    }

    return (
        <DashboardsContainer>
            <Modal
                open={!!dashboardToDelete}
                onClose={() => setDashboardToDelete(null)}
                header={{ heading: "Bekreft sletting" }}
            >
                <Modal.Body>
                    Ønsker du å slette dashbordet?
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setDashboardToDelete(null)}
                    >
                        Avbryt
                    </Button>
                    <Button
                        variant="danger"
                        onClick={confirmDeleteDashboardHandler}
                    >
                        Slett dashbord
                    </Button>
                </Modal.Footer>
            </Modal>

            <div>
                <DashboardsHeader>
                    <BodyShort spacing>
                        <b>Navn på Dashbord</b>
                    </BodyShort>
                </DashboardsHeader>

                {dashboards.map((dashboard) => {
                    return (
                        <DashboardRowContainer
                            className={
                                dashboardsToEdit.includes(dashboard.id)
                                    ? "editting"
                                    : ""
                            }
                            key={dashboard.id}
                        >
                            {!dashboardsToEdit.includes(dashboard.id) ? (
                                <>
                                    <CurrentDashboardData
                                        expandedList={expandedList}
                                        dashboard={dashboard}
                                        setDashboardToDelete={() =>
                                            setDashboardToDelete(dashboard)
                                        }
                                        toggleEditDashboard={() =>
                                            toggleEditDashboard(dashboard)
                                        }
                                        toggleExpanded={() =>
                                            toggleExpanded(dashboard)
                                        }
                                    />
                                    {expandedList.includes(dashboard.id) && (
                                        <AreasInDashboard
                                            dashboardWithOnlyIdProp={dashboard}
                                            toggleExpanded={() =>
                                                toggleExpanded(dashboard)
                                            }
                                        />
                                    )}
                                </>
                            ) : (
                                <CurrentlyEdittingDashboard
                                    dashboard={dashboard}
                                    allAreas={allAreas}
                                    isExpanded={expandedList.includes(
                                        dashboard.id
                                    )}
                                    reloadDashboards={reloadDashboards}
                                    setDashboardToDelete={() =>
                                        setDashboardToDelete(dashboard)
                                    }
                                    toggleExpanded={() =>
                                        toggleExpanded(dashboard)
                                    }
                                    toggleEditDashboard={() =>
                                        toggleEditDashboard(dashboard)
                                    }
                                />
                            )}
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

const CurrentDashboardData = ({
    setDashboardToDelete,
    toggleEditDashboard,
    toggleExpanded,
    expandedList,
    dashboard,
}: CurrentDashboardDataProps) => {
    const handleEditDashboard = () => {
        if (!expandedList.includes(dashboard.id)) {
            toggleExpanded()
        }
        toggleEditDashboard()
    }

    return (
        <DashboardRowInner>
            <ClickableName onClick={toggleExpanded}>
                {dashboard.name}
            </ClickableName>

            <div className="button-container">
                <CustomButton className="option" onClick={handleEditDashboard}>
                    <a>
                        <FileTextIcon /> Rediger
                    </a>
                </CustomButton>
                <button
                    className="option"
                    onClick={setDashboardToDelete}
                    aria-label="Slett område"
                >
                    <a>
                        <TrashIcon /> Slett
                    </a>
                </button>
                <button
                    className="option"
                    onClick={toggleExpanded}
                    aria-expanded={expandedList.includes(dashboard.id)}
                >
                    <ChevronDownIcon
                        className={
                            expandedList.includes(dashboard.id)
                                ? "expanded"
                                : "not-expanded"
                        }
                    />
                </button>
            </div>
        </DashboardRowInner>
    )
}

/* ------------------------------------------ ------------------------------------------ */

interface EditProps {
    dashboard: Dashboard
    isExpanded: boolean
    allAreas: Area[]
    reloadDashboards: () => void
    setDashboardToDelete: () => void
    toggleExpanded: () => void
    toggleEditDashboard: () => void
}

const CurrentlyEdittingDashboard = ({
    dashboard,
    isExpanded,
    allAreas,
    reloadDashboards,
    setDashboardToDelete,
    toggleExpanded,
    toggleEditDashboard,
}: EditProps) => {
    const [updatedDashboard, changeUpdatedDashboard] = useState<Dashboard>({
        id: "",
        name: "",
        areas: [],
        opsMessages: [],
    })

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        ;(async function () {
            setIsLoading(true)
            await fetchDashboard(dashboard.id)
                .then((response) => {
                    changeUpdatedDashboard({
                        id: response.id,
                        name: response.name,
                        areas: response.areas,
                        opsMessages: response.opsMessages,
                    })
                    setIsLoading(false)
                })
                .catch(() => {
                    toast.error("Noe gikk galt ved henting av dashbord-data")
                })
        })()
    }, [dashboard.id])

    if (isLoading) {
        return <CustomNavSpinner />
    }

    const handleUpdateDashboardName =
        () => (evt: React.ChangeEvent<HTMLInputElement>) => {
            const changedDashboard = {
                ...updatedDashboard,
                name: evt.target.value,
            }
            changeUpdatedDashboard(changedDashboard)
        }

    const handleSubmit = () => {
        updateDashboard(updatedDashboard)
            .then(() => {
                reloadDashboards()
                if (isExpanded) {
                    toggleExpanded()
                }
                toggleEditDashboard()
                toast.success("Oppdatering gjennomført")
            })
            .catch(() => {
                toast.error("Noe gikk galt i oppdatering av dashbord")
            })
    }

    const handleDisableEdit = () => {
        if (isExpanded) {
            toggleExpanded()
        }
        toggleEditDashboard()
    }

    const { name } = updatedDashboard

    return (
        <div>
            <DashboardRowInner>
                <ClickableName className="editting" onClick={toggleExpanded}>
                    <TextField
                        label="Navn"
                        hideLabel
                        value={name}
                        onChange={handleUpdateDashboardName()}
                        onClick={(event) => event.stopPropagation()}
                    />
                </ClickableName>

                <div className="button-container">
                    <button
                        type="button"
                        className="option"
                        onClick={handleSubmit}
                    >
                        <a>
                            <FloppydiskIcon /> Lagre
                        </a>
                    </button>

                    <button
                        type="button"
                        className="option"
                        onClick={handleDisableEdit}
                    >
                        <a>
                            <XMarkIcon /> Avbryt
                        </a>
                    </button>

                    <button
                        type="button"
                        className="option"
                        onClick={setDashboardToDelete}
                        aria-label="Slett dashbord"
                    >
                        <a>
                            <TrashIcon /> Slett
                        </a>
                    </button>

                    <button
                        type="button"
                        className="option"
                        onClick={toggleExpanded}
                        aria-expanded={isExpanded}
                    >
                        <ChevronDownIcon
                            className={isExpanded ? "expanded" : "not-expanded"}
                        />
                    </button>
                </div>
            </DashboardRowInner>

            {isExpanded && (
                <EditAreasInDashboard
                    updatedDashboard={updatedDashboard}
                    allAreas={allAreas}
                    changeUpdatedDashboard={changeUpdatedDashboard}
                />
            )}
        </div>
    )
}

/* ------------------------------------------ ------------------------------------------ */

const EditAreasInDashboard: React.FC<{
    updatedDashboard: Dashboard
    allAreas: Area[]
    changeUpdatedDashboard: React.Dispatch<SetStateAction<Dashboard>>
}> = ({ updatedDashboard, allAreas, changeUpdatedDashboard }) => {
    const availableAreas: Area[] = allAreas.filter(
        (area) => !updatedDashboard.areas.map((a) => a.id).includes(area.id)
    )

    const [selectedArea, updateSelectedArea] = useState<Area | null>(() =>
        availableAreas.length > 0 ? availableAreas[0] : null
    )

    useEffect(() => {
        if (availableAreas.length > 0) {
            updateSelectedArea(availableAreas[0])
        } else {
            updateSelectedArea(null)
        }
    }, [allAreas, updatedDashboard.areas, availableAreas])

    const handleUpdateSelectedArea = (event) => {
        const idOfSelectedArea: string = event.target.value
        const newSelectedArea: Area = availableAreas.find(
            (area) => idOfSelectedArea === area.id
        )
        updateSelectedArea(newSelectedArea)
    }

    const handleAddAreaToDashboard = async () => {
        if (availableAreas.length != 0) {
            toast.info("La til område i dashbord")
            const newDashboardAreas: Area[] = [
                ...updatedDashboard.areas.map((area) => area),
                selectedArea,
            ]
            changeUpdatedDashboard({
                ...updatedDashboard,
                areas: newDashboardAreas,
            })
        } else {
            toast.error("Det er ikke flere områder å legge til")
        }
    }

    const handleDeleteAreaFromDashboard = async (areaToDelete: Area) => {
        const newDashboardAreas: Area[] = [
            ...updatedDashboard.areas.map((area) => area),
        ].filter((a) => a.id != areaToDelete.id)
        changeUpdatedDashboard({
            ...updatedDashboard,
            areas: newDashboardAreas,
        })
    }

    return (
        <DashboardDropRow>
            <DropdownColumn>
                {updatedDashboard.areas.length == 0 && (
                    <div>Ingen områder i dashbord</div>
                )}

                {updatedDashboard.areas.length > 0 && (
                    <div className="editting">
                        <b>Områder i dashbord</b>
                        <ul>
                            {updatedDashboard.areas.map((area) => {
                                return (
                                    <li key={area.id}>
                                        {area.name}
                                        <CustomButton
                                            onClick={() =>
                                                handleDeleteAreaFromDashboard(
                                                    area
                                                )
                                            }
                                            aria-label="Fjern område fra dashbord"
                                        >
                                            <CloseCustomized />
                                        </CustomButton>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                )}

                <Select
                    value={selectedArea !== null ? selectedArea.id : ""}
                    onChange={handleUpdateSelectedArea}
                    label="Velg område å legge til dashbord"
                    hideLabel
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

                <div>
                    <Button
                        variant="secondary"
                        className="add-button"
                        onClick={handleAddAreaToDashboard}
                    >
                        Legg til
                    </Button>
                </div>
            </DropdownColumn>
        </DashboardDropRow>
    )
}

/* ------------------------------------------ ------------------------------------------ */

const AreasInDashboard: React.FC<{
    dashboardWithOnlyIdProp?: Dashboard
    toggleExpanded: () => void
}> = ({ dashboardWithOnlyIdProp: dashboardWithoutIdProp, toggleExpanded }) => {
    const {
        data: entireDashboard,
        isLoading,
        reload,
    } = useLoader(() => fetchDashboard(dashboardWithoutIdProp.id), [])

    if (isLoading) {
        return <CustomNavSpinner />
    }

    return (
        <DashboardDropRow>
            <DropdownColumn>
                {entireDashboard.areas.length == 0 ? (
                    <div>Ingen områder i dashbord</div>
                ) : (
                    <div>
                        <b>Områder i dashbord</b>
                        <ul>
                            {entireDashboard.areas.map((area) => {
                                return <li key={area.id}>{area.name}</li>
                            })}
                        </ul>
                    </div>
                )}
            </DropdownColumn>

            <div className="clickable" onClick={toggleExpanded}></div>
        </DashboardDropRow>
    )
}

/* ------------------------------------------ ------------------------------------------ */

const DashboardDropRow = styled.div`
    border-top: 2px solid rgba(0, 0, 0, 0.1);
    background-color: var(--a-gray-100);
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

export default TableDashbord
