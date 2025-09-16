import styled from "styled-components"
import Head from "next/head"
import router from "next/router"
import { useContext, useEffect, useState } from "react"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import { XMarkIcon, TrashIcon, ChevronDownIcon, FileTextIcon, FloppydiskIcon } from "@navikt/aksel-icons"
import {
    BodyShort,
    Button, Checkbox, CheckboxGroup,
    Heading,
    Modal,
    Select,
    TextField,
} from "@navikt/ds-react"
import { Component, Service, Team } from "../../types/types"
import {
    deleteComponent,
    fetchComponents,
    updateComponent,
} from "../../utils/componentsAPI"
import { TitleContext } from "../ContextProviders/TitleContext"
import CustomNavSpinner from "../CustomNavSpinner"
import {
    AdminCategoryContainer,
    CloseCustomized,
    DependenciesColumn,
    DependencyList,
    ModalInner,
    NoContentContainer,
} from "../../pages/Admin"
import { RouterAdminAddKomponent } from "../../types/routes"
import { fetchServices } from "../../utils/servicesAPI"
import { fetchAllTeams } from "../../utils/teamKatalogAPI";

const ComponentHeader = styled.div`
    padding: 1rem 0 1rem;
    padding-left: 1rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.55);
    display: flex;
    flex-direction: row;
    gap: 5ch;

    & > * {
        width: 150px;
        word-break: break-word;
        font-weight: bold;
    }

    .empty-space {
        padding: 0 calc(3rem + 20px);
        display: flex;
        flex-direction: row;
    }

    .komponent-header-content {
        flex-grow: 1;
        display: flex;
        justify-content: space-between;
        gap: 5ch;

        span {
            width: 100%;
        }
    }
`

const ComponentContent = styled.div`
    min-height: 5rem;

    padding-left: 1rem;
    padding-top: 1px;
    padding-bottom: 1px;

    background-color: var(--a-gray-100);

    border-top: 1px solid rgba(0, 0, 0, 0.55);
    border-bottom: 1px solid rgba(0, 0, 0, 0.55);

    :hover {
        padding-top: 0;
        padding-bottom: 0;

        border-top: 2px solid rgba(0, 0, 0, 0.55);
        border-bottom: 2px solid rgba(0, 0, 0, 0.55);
    }

    display: flex;
    align-items: center;

    :last-child {
        padding-bottom: 0;
        padding-left: 1rem;
        border-bottom: 2px solid rgba(0, 0, 0, 0.55);

        :hover {
            padding-bottom: 0;
            border-bottom: 3px solid rgba(0, 0, 0, 0.55);
        }
    }

    &.editting {
        border-color: var(-global-color-blue-500);
    }
`

const CustomButton = styled.button`
    background-color: transparent;
    border: none;
    :hover {
        cursor: pointer;
    }
`

const TableKomponent = () => {
    const [expanded, toggleExpanded] = useState<string[]>([])
    const [componentsToEdit, changeComponentsToEdit] = useState<string[]>([])
    const [componentToDelete, setComponentToDelete] = useState<Component>()
    const [components, setComponents] = useState<Component[]>()
    const [allServices, setAllServices] = useState<Service[]>()
    const [isLoading, setIsLoading] = useState(false)
    const [allTeams, setAllTeams] = useState<Team[]>()

    const { changeTitle } = useContext(TitleContext)

    useEffect(() => {
        changeTitle("Admin - Komponenter")
        setIsLoading(true)
        let controlVar = true
        const setup = async () => {
            if (controlVar) {
                try {
                    let retrievedTeams: Team[] = await fetchAllTeams()
                    setAllTeams(retrievedTeams)
                } catch (error) {
                    // console.log(error)
                    toast.error("Noe gikk galt ved henting av team fra teamkatalogen")
                }
                try {

                    const components: Component[] = await fetchComponents()
                    await setComponents(components)
                    const responseServices = await fetchServices()
                    await setAllServices(responseServices)
                } catch (error) {
                    toast.error("Noe gikk galt ved henting av dashbordene")
                    // console.log(error)
                } finally {
                    setIsLoading(false)
                }
            }
        }
        if (controlVar) {
            setup()
        }
        controlVar = false
    }, [])

    const reload = async () => {
        setIsLoading(true)
        await fetchComponents()
            .then((response) => {
                setComponents(response)
                setIsLoading(false)
            })
            .catch((error) => {
                toast.error("Noe gikk galt ved henting av tjenestene")
                // console.log(error)
            })
    }

    if (isLoading) {
        return <CustomNavSpinner />
    }

    const toggleExpandedFor = (componentId) => {
        if (expanded.includes(componentId)) {
            toggleExpanded([...expanded.filter((i) => i !== componentId)])
        } else {
            toggleExpanded([...expanded, componentId])
        }
    }

    const toggleEditComponent = (component: Component) => {
        let edittingComponents: string[] = [...componentsToEdit]
        if (edittingComponents.includes(component.id)) {
            changeComponentsToEdit(
                edittingComponents.filter((d) => d != component.id)
            )
            return
        }
        edittingComponents.push(component.id)
        changeComponentsToEdit(edittingComponents)
    }

    const confirmDeleteComponentHandler = () => {
        deleteComponent(componentToDelete)
            .then(() => {
                toast.info("Komponenten ble slettet")
                setComponentToDelete(null)
                reload()
            })
            .catch(() => {
                toast.error("Kunne ikke slette komponenten")
            })
    }

    return (
        <AdminCategoryContainer>
            <Head>
                <title>Admin - Tjenester - status.nav.no</title>
            </Head>

            <Modal
                open={!!componentToDelete}
                onClose={() => setComponentToDelete(null)}
                header={{ heading: "Bekreft sletting" }}
            >
                <Modal.Body>
                    Ønsker du å slette komponenten?
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setComponentToDelete(null)}
                    >
                        Avbryt
                    </Button>
                    <Button
                        variant="danger"
                        onClick={confirmDeleteComponentHandler}
                    >
                        Slett komponent
                    </Button>
                </Modal.Footer>
            </Modal>

            <div className="centered">
                <Button
                    variant="secondary"
                    onClick={() => router.push(RouterAdminAddKomponent.PATH)}
                >
                    <b>Legg til ny komponent</b>
                </Button>
            </div>

            <div className="category-overflow-container">
                <div>
                    {components ? (
                        <div>
                            <ComponentHeader>
                                <div className="komponent-header-content">
                                    <span>Navn</span>
                                    <span>Team</span>
                                </div>
                                <div className="empty-space"></div>
                            </ComponentHeader>

                            {components.map((component) => {
                                return (
                                    <ComponentContent
                                        key={component.id}
                                        className={
                                            componentsToEdit.includes(
                                                component.id
                                            )
                                                ? "editting"
                                                : ""
                                        }
                                    >
                                        {!componentsToEdit.includes(
                                            component.id
                                        ) ? (
                                            <ComponentRow
                                                component={component}
                                                toggleEditComponent={() =>
                                                    toggleEditComponent(
                                                        component
                                                    )
                                                }
                                                toggleExpanded={() =>
                                                    toggleExpandedFor(
                                                        component.id
                                                    )
                                                }
                                                isExpanded={expanded.includes(
                                                    component.id
                                                )}
                                                setComponentToDelete={() =>
                                                    setComponentToDelete(
                                                        component
                                                    )
                                                }
                                            />
                                        ) : (
                                            <ComponentRowEditting
                                                component={component}
                                                toggleEditComponent={() =>
                                                    toggleEditComponent(
                                                        component
                                                    )
                                                }
                                                toggleExpanded={() =>
                                                    toggleExpandedFor(
                                                        component.id
                                                    )
                                                }
                                                isExpanded={expanded.includes(
                                                    component.id
                                                )}
                                                setComponentToDelete={() =>
                                                    setComponentToDelete(
                                                        component
                                                    )
                                                }
                                                allComponents={components}
                                                allServices={allServices}
                                                teams={allTeams}
                                                reload={reload}
                                            />
                                        )}
                                    </ComponentContent>
                                )
                            })}
                        </div>
                    ) : (
                        <NoContentContainer>
                            <Heading size="medium" level="3">
                                Ingen komponenter eksisterer
                            </Heading>
                        </NoContentContainer>
                    )}
                </div>
            </div>
        </AdminCategoryContainer>
    )
}

/* ----------------- --------------------------------------------------- -----------------*/

const ComponentRowContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-grow: 1;

    div {
        display: flex;
        justify-content: space-between;
    }
`

const ComponentRowContent = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    .top-row {
        min-height: 5rem;
        display: flex;
        align-items: center;
        flex-grow: 1;

        & > * {
            display: flex;
            flex-basis: 100%;
        }

        .component-row-element {
            flex-basis: 100%;
            margin-right: 5ch;
            word-break: break-word;
            width: 150px;

            input {
                width: 142px;
                min-height: 48px;
                padding: 8px;
                margin-top: var(--a-spacing-2);
            }

            label {
                display: hidden;
                z-index: -1000;
            }
        }

        :hover {
            cursor: pointer;
        }
    }

    .bottom-row {
        border-top: 2px solid rgba(0, 0, 0, 0.1);
        min-height: 5rem;
        padding: 1rem 0;

        & > * {
            display: flex;
            flex-basis: 100%;
        }

        .dependencies {
            margin-right: 5ch;
            max-width: 275px;
            margin-top: 0;

            display: flex;
            flex-direction: column;

            ul {
                margin-top: 0;
            }
        }

        input {
            min-height: 48px;
            margin-top: var(--a-spacing-2);
        }

        .component-row-element {
            margin-right: 5ch;
            display: flex;
            flex-direction: column;
        }

        span:first-child {
            margin: 0 2rem;
        }
    }

    .clickable {
        :hover {
            cursor: pointer;
        }
    }
`

interface ComponentRowProps {
    component: Component
    allComponents?: Component[]
    toggleEditComponent: (component) => void
    toggleExpanded: (component) => void
    isExpanded: boolean
    setComponentToDelete: (component) => void
    reload?: () => void
    allServices?: Service[]
    teams?: Team[]
}

const ComponentRow = ({
    component,
    toggleEditComponent,
    toggleExpanded,
    isExpanded,
    setComponentToDelete,
}: ComponentRowProps) => {
    const handleEditComponent = (component) => {
        if (!isExpanded) {
            toggleExpanded(component)
        }
        toggleEditComponent(component)
    }

    return (
        <ComponentRowContainer>
            <ComponentRowContent>
                <div
                    className="top-row"
                    onClick={() => toggleExpanded(component)}
                >
                    <div>
                        <span className="component-row-element">
                            {component.name}
                        </span>
                        <span className="component-row-element">
                            {component.team}
                        </span>
                    </div>
                </div>

                {isExpanded && (
                    <div
                        className="bottom-row clickable"
                        onClick={() => toggleExpanded(component)}
                    >
                        <div className="dependencies">
                            {component.componentDependencies.length == 0 ? (
                                <>
                                    <BodyShort spacing>
                                        <b>Komponentavhengigheter</b>
                                    </BodyShort>
                                    <BodyShort spacing>
                                        Ingen komponentavhengigheter eksisterer
                                    </BodyShort>
                                </>
                            ) : (
                                <>
                                    <BodyShort spacing>
                                        <b>Komponentavhengigheter</b>
                                    </BodyShort>
                                    <ul>
                                        {component.componentDependencies.map(
                                            (dependency, index) => {
                                                return (
                                                    <li key={index}>
                                                        {dependency.name}
                                                    </li>
                                                )
                                            }
                                        )}
                                    </ul>
                                </>
                            )}
                        </div>

                        <div className="dependencies">
                            {component.servicesDependentOnThisComponent
                                .length == 0 ? (
                                <>
                                    <BodyShort spacing>
                                        <b>Koblinger mot tjenester</b>
                                    </BodyShort>
                                    <BodyShort spacing>
                                        Ingen tjenestekoblinger lagt til
                                    </BodyShort>
                                </>
                            ) : (
                                <>
                                    <BodyShort spacing>
                                        <b>Koblinger mot tjenester</b>
                                    </BodyShort>
                                    <ul>
                                        {component.servicesDependentOnThisComponent.map(
                                            (dependency, index) => {
                                                return (
                                                    <li key={index}>
                                                        {dependency.name}
                                                    </li>
                                                )
                                            }
                                        )}
                                    </ul>
                                </>
                            )}
                        </div>

                        <span className="component-row-element">
                            <BodyShort>
                                <b>Monitorlink</b>
                            </BodyShort>
                            <BodyShort>{component.monitorlink}</BodyShort>
                        </span>
                        <span className="component-row-element">
                            <BodyShort>
                                <b>PollingUrl</b>
                            </BodyShort>
                            <BodyShort>{component.pollingUrl}</BodyShort>
                        </span>
                        <span className="component-row-element">
                            <BodyShort spacing>
                                <b>ID</b>
                            </BodyShort>
                            <BodyShort>{component.id}</BodyShort>
                        </span>
                    </div>
                )}
            </ComponentRowContent>
            <div className="button-container">
                <CustomButton
                    className="option"
                    onClick={() => handleEditComponent(component)}
                >
                    <a>
                        <FileTextIcon /> Rediger
                    </a>
                </CustomButton>
                <button
                    className="option"
                    onClick={setComponentToDelete}
                    aria-label="Slett komponent"
                >
                    <a>
                        <TrashIcon />
                        Slett
                    </a>
                </button>
                <button
                    className="option"
                    onClick={() => toggleExpanded(component)}
                >
                    <ChevronDownIcon
                        className={isExpanded ? "expanded" : "not-expanded"}
                        aria-expanded={isExpanded}
                    />
                </button>
            </div>
        </ComponentRowContainer>
    )
}

/* ----------------- --------------------------------------------------- -----------------*/

const ComponentRowEditting = ({
    component,
    allComponents,
    toggleEditComponent,
    toggleExpanded,
    isExpanded,
    setComponentToDelete,
    reload,
    allServices,
    teams,
}: ComponentRowProps) => {
    const [updatedComponent, changeUpdatedComponent] = useState<Component>({
        id: component.id,
        name: component.name,
        type: component.type,
        team: component.team,
        componentDependencies: component.componentDependencies,
        monitorlink: component.monitorlink,
        pollingUrl: component.pollingUrl,
        servicesDependentOnThisComponent:
            component.servicesDependentOnThisComponent,
        pollingOnPrem: component.pollingOnPrem,
    })
    const [isLoading, setIsLoading] = useState(true)

    const {
        name,
        type,
        team,
        componentDependencies,
        monitorlink,
        pollingUrl,
        servicesDependentOnThisComponent,
        pollingOnPrem,
    } = updatedComponent

    useEffect(() => {
        setIsLoading(true)
        if (monitorlink == null || monitorlink == undefined) {
            changeUpdatedComponent({ ...updatedComponent, monitorlink: "" })
        }
        if (pollingUrl == null || pollingUrl == undefined) {
            changeUpdatedComponent({ ...updatedComponent, pollingUrl: "" })
        }
        setIsLoading(false)
    }, [])

    if (isLoading) {
        return <CustomNavSpinner />
    }

    const handleIsPollingOnPrem = () => {
        changeUpdatedComponent({
            ...updatedComponent,
            pollingOnPrem: !pollingOnPrem,
        })
    }

    const handleUpdatedComponent =
        (field: keyof typeof updatedComponent) =>
            (evt: React.ChangeEvent<HTMLInputElement>) => {
                const changedService = {
                    ...updatedComponent,
                    [field]:
                        evt.target.getAttribute("type") === "number"
                            ? parseInt(evt.target.value)
                            : evt.target.value,
                }

                changeUpdatedComponent(changedService)
            }

    const handleSubmit = () => {
        updateComponent(updatedComponent)
            .then(() => {
                reload()
                toggleExpanded(component)
                toggleEditComponent(component)
                toast.success("Oppdatering gjennomført")
            })
            .catch(() => {
                toast.error("Noe gikk galt i oppdatering av område")
            })
    }

    const handleCancelEditting = (component) => {
        if (isExpanded) {
            toggleExpanded(component)
        }
        toggleEditComponent(component)
    }
    const teamOptions = [];
    teams.forEach((team) => {
        teamOptions.push(<option key={team.id} value={team.id}>{team.name}</option>)
    })
    const handleUpdatedTeam = (event) => {
        changeUpdatedComponent({
            ...component,
            team: event.target.value
        })
    }

    return (
        <ComponentRowContainer>
            <ComponentRowContent>
                <div
                    className="top-row"
                    onClick={() => toggleExpanded(component)}
                >
                    <TextField
                        label="Navn"
                        hideLabel
                        className="component-row-element editting"
                        value={name}
                        onChange={handleUpdatedComponent("name")}
                        onClick={(event) => event.stopPropagation()}
                    />

                    <Select
                        label=""
                        onClick={e => e.stopPropagation()}
                        onChange={handleUpdatedTeam}
                        style={{ width: '10%' }}>
                        <option value={component.teamId ? component.teamId : component.team} >{component.team}</option>
                        {teamOptions}
                    </Select>
                </div>

                {isExpanded && (
                    <div className="bottom-row">
                        <div className="dependencies">
                            <BodyShort spacing>
                                <b>Komponentavhengigheter</b>
                            </BodyShort>

                            <EditComponentDependencies
                                allComponents={allComponents}
                                component={component}
                                updatedComponent={updatedComponent}
                            />
                        </div>

                        <div className="dependencies">
                            <BodyShort spacing>
                                <b>Kobling mot tjenester</b>
                            </BodyShort>

                            <EditConnctionToServices
                                allServices={allServices}
                                component={component}
                                updatedComponent={updatedComponent}
                            />
                        </div>
                        <div>
                            <span className="component-row-element editting">
                                <BodyShort spacing>
                                    <b>Monitorlink</b>
                                </BodyShort>
                                <TextField
                                    label="Monitorlink"
                                    hideLabel
                                    value={monitorlink}
                                    onChange={handleUpdatedComponent("monitorlink")}
                                />
                            </span>


                        </div>

                        <span className="component-row-element editting">
                            <BodyShort spacing>
                                <b>PollingUrl</b>
                            </BodyShort>
                            <TextField
                                label="Pollingurl"
                                hideLabel
                                value={pollingUrl}
                                onChange={handleUpdatedComponent("pollingUrl")}
                            />

                            <span className="service-data-element editting">
                                <CheckboxGroup
                                    legend=""
                                    onChange={() => handleIsPollingOnPrem()}
                                >
                                    <Checkbox
                                        value={
                                            pollingOnPrem ? "true" : "false"
                                        }
                                        defaultChecked={pollingOnPrem}
                                    >
                                        Statuskilde er on prem (fss)
                                    </Checkbox>
                                </CheckboxGroup>
                            </span>
                        </span>
                    </div>
                )}
            </ComponentRowContent>

            <div className="button-container">
                <button type="button" className="option" onClick={handleSubmit}>
                    <a>
                        <FloppydiskIcon /> Lagre
                    </a>
                </button>
                <CustomButton
                    className="option"
                    onClick={() => handleCancelEditting(component)}
                >
                    <a>
                        <XMarkIcon /> Avbryt
                    </a>
                </CustomButton>
                <button
                    className="option"
                    onClick={setComponentToDelete}
                    aria-label="Slett komponent"
                >
                    <a>
                        <TrashIcon /> Slett
                    </a>
                </button>
                <button
                    className="option"
                    onClick={() => toggleExpanded(component)}
                >
                    <ChevronDownIcon
                        className={isExpanded ? "expanded" : "not-expanded"}
                        aria-expanded={isExpanded}
                    />
                </button>
            </div>
        </ComponentRowContainer>
    )
}

/*----------------------------------------- HELPER FOR CODE ABOVE -----------------------------------------*/

interface EditConnctionToServicesI {
    allServices: Service[]
    component: Component
    updatedComponent: Component
}

const EditConnctionToServices = ({
    allServices,
    component,
    updatedComponent,
}: EditConnctionToServicesI) => {
    const [edittedDependencies, updateDependencies] = useState<Service[]>([
        ...component.servicesDependentOnThisComponent,
    ])
    const availableServiceConnections: Service[] = [...allServices].filter(
        (s) => !edittedDependencies.map((service) => service.id).includes(s.id)
    )

    const [selectedService, updateSelectedService] = useState<Service | null>(
        allServices[0]
    )

    useEffect(() => {
        updatedComponent.servicesDependentOnThisComponent = edittedDependencies
        if (availableServiceConnections.length > 0) {
            updateSelectedService(availableServiceConnections[0])
        } else {
            updateSelectedService(null)
        }
    }, [edittedDependencies])

    const handleUpdateSelectedService = (event) => {
        const idOfSelectedService: string = event.target.value
        const newSelectedService: Service = allServices.find(
            (service) => idOfSelectedService === service.id
        )
        updateSelectedService(newSelectedService)
    }

    const handlePutEdittedServiceConnection = () => {
        if (selectedService !== null) {
            const updatedEdittedDependencies: Service[] = [
                ...edittedDependencies,
                selectedService,
            ]
            updateDependencies(updatedEdittedDependencies)
            toast.success("Tjeenstekobling lagt til")
            return
        }
        toast.info("Ingen tjenester å legge til")
    }

    const handleRemoveEdittedServiceConnection = (service: Service) => {
        if (!edittedDependencies.includes(service)) {
            toast.error(
                "Tjenesten eksisterer ikke i avhengighetene. Noe har gått galt med innlesingen"
            )
            return
        }
        const updatedEdittedDependencies = edittedDependencies.filter(
            (s) => s.id != service.id
        )
        updateDependencies(updatedEdittedDependencies)
        toast.info("Kobling fjernet")
    }

    return (
        <DependenciesColumn>
            <DependencyList>
                {edittedDependencies.length === 0 ? (
                    <BodyShort spacing>
                        Ingen tjenestekoblinger lagt til
                    </BodyShort>
                ) : (
                    <>
                        {edittedDependencies.map((component) => {
                            return (
                                <li key={component.id}>
                                    {component.name}
                                    <CustomButton
                                        aria-label={
                                            "Fjern tjenesteavhengighet med navn " +
                                            component.name
                                        }
                                        onClick={() =>
                                            handleRemoveEdittedServiceConnection(
                                                component
                                            )
                                        }
                                    >
                                        <CloseCustomized />
                                    </CustomButton>
                                </li>
                            )
                        })}
                    </>
                )}
            </DependencyList>
            {allServices.length !== 0 ? (
                <Select
                    label="Legg til komponenter i område"
                    onChange={handleUpdateSelectedService}
                >
                    {availableServiceConnections.length > 0 ? (
                        availableServiceConnections.map((component) => {
                            return (
                                <option key={component.id} value={component.id}>
                                    {component.name}
                                </option>
                            )
                        })
                    ) : (
                        <option key={undefined} value={""}>
                            Ingen tjeneste å legge til
                        </option>
                    )}
                </Select>
            ) : (
                <>Ingen tjeneste å legge til</>
            )}

            <div>
                <Button
                    variant="secondary"
                    className="add-element"
                    onClick={handlePutEdittedServiceConnection}
                >
                    Legg til
                </Button>
            </div>
        </DependenciesColumn>
    )
}

interface EditComponentDependenciesI {
    allComponents: Component[]
    component: Component
    updatedComponent: Component
}

const EditComponentDependencies = ({
    allComponents,
    component,
    updatedComponent,
}: EditComponentDependenciesI) => {
    const [edittedDependencies, updateDependencies] = useState<Component[]>([
        ...component.componentDependencies,
    ])
    const availableServiceDependencies: Component[] = [...allComponents].filter(
        (c) =>
            c.id != component.id &&
            !edittedDependencies.map((component) => component.id).includes(c.id)
    )

    const [selectedComponent, updateSelectedComponent] =
        useState<Component | null>(allComponents[0])

    useEffect(() => {
        updatedComponent.componentDependencies = edittedDependencies
        if (availableServiceDependencies.length > 0) {
            updateSelectedComponent(availableServiceDependencies[0])
        } else {
            updateSelectedComponent(null)
        }
    }, [edittedDependencies])

    const handleUpdateSelectedComponent = (event) => {
        const idOfSelectedService: string = event.target.value
        const newSelectedService: Component = allComponents.find(
            (component) => idOfSelectedService === component.id
        )
        updateSelectedComponent(newSelectedService)
    }

    const handlePutEdittedComponentDependency = () => {
        if (selectedComponent !== null) {
            const updatedEdittedDependencies: Component[] = [
                ...edittedDependencies,
                selectedComponent,
            ]
            updateDependencies(updatedEdittedDependencies)
            toast.success("Tjenesteavhengighet lagt til")
            return
        }
        toast.info("Ingen komponenter å legge til")
    }

    const handleRemoveEdittedComponentDependency = (component: Component) => {
        if (!edittedDependencies.includes(component)) {
            toast.error(
                "Komponent eksisterer ikke i avhengighetene. Noe har gått galt med innlesingen"
            )
            return
        }
        const updatedEdittedDependencies = edittedDependencies.filter(
            (s) => s.id != component.id
        )
        updateDependencies(updatedEdittedDependencies)
        toast.info("Avhengighet fjernet")
    }

    return (
        <DependenciesColumn>
            <DependencyList>
                {edittedDependencies.length === 0 ? (
                    <BodyShort spacing>
                        Ingen komponentavhengigheter lagt til
                    </BodyShort>
                ) : (
                    <>
                        {edittedDependencies.map((component) => {
                            return (
                                <li key={component.id}>
                                    {component.name}
                                    <CustomButton
                                        aria-label={
                                            "Fjern tjenesteavhengighet med navn " +
                                            component.name
                                        }
                                        onClick={() =>
                                            handleRemoveEdittedComponentDependency(
                                                component
                                            )
                                        }
                                    >
                                        <CloseCustomized />
                                    </CustomButton>
                                </li>
                            )
                        })}
                    </>
                )}
            </DependencyList>
            {allComponents.length !== 0 ? (
                <Select
                    label="Legg til komponenter i område"
                    onChange={handleUpdateSelectedComponent}
                >
                    {availableServiceDependencies.length > 0 ? (
                        availableServiceDependencies.map((component) => {
                            return (
                                <option key={component.id} value={component.id}>
                                    {component.name}
                                </option>
                            )
                        })
                    ) : (
                        <option key={undefined} value={""}>
                            Ingen komponent å legge til
                        </option>
                    )}
                </Select>
            ) : (
                <>Ingen komponent å legge til</>
            )}

            <div>
                <Button
                    variant="secondary"
                    className="add-element"
                    onClick={handlePutEdittedComponentDependency}
                >
                    Legg til
                </Button>
            </div>
        </DependenciesColumn>
    )
}

export default TableKomponent
