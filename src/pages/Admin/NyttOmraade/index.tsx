import styled from "styled-components"
import router from "next/router"
import { useContext, useEffect, useState } from "react"

import { Delete } from "@navikt/aksel-icons"
import { BodyShort, Button, Detail, Select, TextField } from "@navikt/ds-react"
import { toast, ToastContainer } from "react-toastify"

import { Area, Service } from "../../../types/types"
import { useLoader } from "../../../utils/useLoader"
import Layout from "../../../components/Layout"
import CustomNavSpinner from "../../../components/CustomNavSpinner"
import { ButtonContainer, DynamicListContainer, HorizontalSeparator } from ".."
import { TitleContext } from "../../../components/ContextProviders/TitleContext"
import { fetchServices } from "../../../utils/servicesAPI"
import { postAdminArea } from "../../../utils/areasAPI"
import { RouterAdminOmråder } from "../../../types/routes"
import { EndPathServices } from "../../../utils/apiHelper"
import { backendPath } from "../.."

const NewAreaContainer = styled.div`
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
    const [resServices] = await Promise.all([
        fetch(backendPath + EndPathServices()),
    ])

    const allServicesProps: Service[] = await resServices.json()

    return {
        props: {
            allServicesProps,
        },
    }
}

const NewArea = ({ allServicesProps }) => {
    const allServices: Service[] = allServicesProps
    const [isLoading, setIsLoading] = useState(true)
    const [newArea, updateNewArea] = useState<Area>({
        name: "",
        description: "",
        icon: "0001",
        services: [],
        components: [],
        contains_components:false,
    })

    useEffect(() => {
        setIsLoading(false)
    }, [])

    if (isLoading) {
        return <CustomNavSpinner />
    }

    const { name, description, icon, services, components } = newArea

    const handleAreaDataChange =
        (field: keyof typeof newArea) =>
        (evt: React.ChangeEvent<HTMLInputElement>) => {
            const updatedNewArea = {
                ...newArea,
                [field]:
                    evt.target.getAttribute("type") === "number"
                        ? parseInt(evt.target.value)
                        : evt.target.value,
            }

            updateNewArea(updatedNewArea)
        }

    const handleAddServiceToArea = (serviceToAdd: Service) => {
        if (newArea.services.includes(serviceToAdd)) {
            toast.warn(
                "Tjeneste " + serviceToAdd.name + " er allerede i området"
            )
            return
        }
        const updatedList = [...newArea.services, serviceToAdd]
        const updatedArea: Area = {
            name: name,
            services: updatedList,
            components: components,
            description: description,
            icon: icon,
            contains_components:false,
        }
        updateNewArea(updatedArea)
        toast.success("Lagt tjeneste til område")
    }

    const handleDeleteServiceOnArea = (serviceToDelete: Service) => {
        const newServicesList: Service[] = [
            ...newArea.services.filter((service) => service != serviceToDelete),
        ]
        const updatedArea: Area = {
            name: name,
            description: description,
            components: components,
            icon: icon,
            services: newServicesList,
            contains_components:false,
        }
        updateNewArea(updatedArea)
        toast.success("Fjernet tjeneste fra område")
    }

    const handlePostNewArea = (event) => {
        event.preventDefault()
        postAdminArea(newArea)
            .then(() => {
                toast.success("Område lastet opp")
                router.push(RouterAdminOmråder.PATH)
            })
            .catch(() => {
                toast.error("Klarte ikke å laste opp område")
            })
    }

    return (
        <Layout>
            <NewAreaContainer>
                <form onSubmit={(event) => handlePostNewArea(event)}>
                    <Detail size="small" spacing>
                        Felter markert med * er obligatoriske
                    </Detail>

                    <TextField
                        type="text"
                        required
                        label="Navn på område"
                        value={name}
                        onChange={handleAreaDataChange("name")}
                        placeholder="Navn*"
                    />
                    <TextField
                        type="text"
                        required
                        label="Beskrivelse"
                        value={description}
                        onChange={handleAreaDataChange("description")}
                        placeholder="Beskrivelse"
                    />

                    <AreaServices
                        newArea={newArea}
                        allServices={allServices}
                        handleDeleteServiceOnArea={(areaToDelete) =>
                            handleDeleteServiceOnArea(areaToDelete)
                        }
                        handleAddServiceToArea={(serviceToAdd) =>
                            handleAddServiceToArea(serviceToAdd)
                        }
                    />

                    <HorizontalSeparator />

                    <ButtonContainer>
                        <Button
                            variant="secondary"
                            type="button"
                            value="Avbryt"
                            onClick={() => router.push(RouterAdminOmråder.PATH)}
                        >
                            Avbryt
                        </Button>
                        <Button type="submit" value="Legg til">
                            Lagre
                        </Button>
                    </ButtonContainer>
                </form>

                <ToastContainer />
            </NewAreaContainer>
        </Layout>
    )
}

/*-----------_Helpers_-------------*/

interface AreaProps {
    newArea: Area
    allServices: Service[]
    handleDeleteServiceOnArea: (areaToDelete) => void
    handleAddServiceToArea: (serviceToAdd) => void
}

const AreaServices = ({
    newArea,
    allServices,
    handleDeleteServiceOnArea: handleDeleteServiceOnArea,
    handleAddServiceToArea: handleAddServiceToArea,
}: AreaProps) => {
    const availableServices: Service[] = allServices.filter(
        (area) => !newArea.services.map((a) => a.id).includes(area.id)
    )
    const { changeTitle } = useContext(TitleContext)
    const [selectedService, changeSelectedService] = useState<Service | null>(
        () => (availableServices.length > 0 ? availableServices[0] : null)
    )

    // useEffect(() => {
    //     console.log(allServices)
    // }, [])

    useEffect(() => {
        changeTitle("Opprett nytt område")
        if (availableServices.length > 0) {
            changeSelectedService(availableServices[0])
        } else {
            changeSelectedService(null)
        }
    }, [allServices, newArea.services])

    const handleUpdateSelectedArea = (event) => {
        const idOfSelectedArea: string = event.target.value
        const newSelectedService: Service = availableServices.find(
            (area) => idOfSelectedArea === area.id
        )
        changeSelectedService(newSelectedService)
    }

    const dependencyHandler = () => {
        if (!selectedService) {
            toast.info("Ingen tjeneste valgt")
            return
        }
        handleAddServiceToArea(selectedService)
    }

    return (
        <DynamicListContainer>
            <div className="column">
                <Select
                    label="Legg tjenester i ditt nye område"
                    value={selectedService !== null ? selectedService.id : ""}
                    onChange={handleUpdateSelectedArea}
                >
                    {availableServices.length > 0 ? (
                        availableServices.map((area) => {
                            return (
                                <option key={area.id} value={area.id}>
                                    {area.name}
                                </option>
                            )
                        })
                    ) : (
                        <option key={undefined} value="">
                            Ingen tjenester å legge til
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
                {newArea.services.length > 0 && (
                    <div>
                        <b>Tjenester i området</b>
                        <ul className="new-list">
                            {newArea.services.map((service) => {
                                return (
                                    <li key={service.id}>
                                        <BodyShort>
                                            {service.name}
                                            <button
                                                className="colored"
                                                type="button"
                                                onClick={() =>
                                                    handleDeleteServiceOnArea(
                                                        service
                                                    )
                                                }
                                            >
                                                <label>{service.name}</label>
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

export default NewArea
