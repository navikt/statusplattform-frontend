import styled from "styled-components"
import { ToastContainer } from "react-toastify"

import Layout from "../../components/Layout"
import MenuSelector, {
    adminMenu,
    useFindCurrentTab,
} from "../../components/Admin/MenuSelector"
import { UserStateContext } from "../../components/ContextProviders/UserStatusContext"
import { useContext, useEffect, useState } from "react"
import { useRouter } from "next/router"
import { RouterPrivatperson } from "../../types/routes"
import CustomNavSpinner from "../../components/CustomNavSpinner"
import { Area, Component, Dashboard, Service } from "../../types/types"
import { TitleContext } from "../../components/ContextProviders/TitleContext"
import { Heading } from "@navikt/ds-react"
import TableDashbord from "../../components/Admin/TableDashbord"
import { Close } from "@navikt/ds-icons"
import TableOmraade from "../../components/Admin/TableOmraade"
import TableTjeneste from "../../components/Admin/TableTjeneste"
import TableKomponent from "../../components/Admin/TableKomponent"
import { backendPath } from ".."
import {
    EndPathAreas,
    EndPathComponents,
    EndPathDashboards,
    EndPathServices,
} from "../../utils/apiHelper"

export const AdminCategoryContainer = styled.div`
    .category-overflow-container {
        overflow-x: auto;

        div {
            min-width: max-content;
        }
    }

    .centered {
        display: flex;
        justify-content: center;

        margin: 1rem 0 1rem 0;
    }
`

export const NoContentContainer = styled.div`
    height: 100px;

    display: flex;
    justify-content: center;
    align-items: center;
`

export const ModalInner = styled.div`
    padding: 2rem 4.5rem;
    display: flex;
    flex-direction: column;

    button {
        margin: 1rem;
    }
`

export const DependenciesColumn = styled.div`
    margin-right: 5ch;
    max-width: 242px;

    display: flex;
    flex-direction: column;

    .add-element {
        margin: 1rem 0;
    }

    ul {
        max-width: 100%;
        word-break: break-word;

        li {
            border: 1px solid transparent;
            border-radius: 5px;
        }

        li:hover {
            border: 1px solid black;
        }
    }

    label {
        position: absolute;
        z-index: -1000;
    }
`

export const DependencyList = styled.ul`
    list-style: none;
    padding: 0;

    li {
        width: 100%;

        display: flex;
        justify-content: space-between;
        align-items: center;
        height: fit-content;
    }
`

const AdminDashboardContainer = styled.div`
    width: 100%;
    padding: 0 0 3rem 0;
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    .button-container {
        padding-right: 2px;

        display: flex;
        flex-direction: row;

        .option {
            background-color: transparent;
            border: none;
            padding: 0 16px;

            a {
                text-decoration: underline;
            }

            display: flex;
            align-items: center;
            justify-content: center;

            :hover {
                cursor: pointer;
                color: grey;
                border-radius: 2pt;
                box-shadow: 0 0 0 1pt grey;

                a {
                    text-decoration: none;
                }
            }

            .not-expanded {
                transition: ease 0.5s;
                transform: rotate(0deg);
            }

            .expanded {
                transition: ease 0.5s;
                transform: rotate(-180deg);
            }
        }
    }
`

const AdminConfigsContainer = styled.div`
    background-color: white;

    width: 100%;
    padding: 0 1rem;

    h2 {
        margin: 0 0 0.5rem;
        display: flex;
        justify-content: space-between;
    }
`

export const HorizontalSeparator = styled.span`
    display: block;

    padding: 1px 0;
    margin: 16px 0;

    background-color: var(--navds-global-color-gray-200);
`

export const DynamicListContainer = styled.div`
    display: flex;
    gap: 16px;

    max-width: 100%;

    .column {
        flex: 1 1 0;

        padding: 1rem 0;

        button {
            min-width: fit-content;
        }

        .select-wrapper {
            display: flex;
        }
    }

    .new-list {
        list-style: none;
        padding: 0;

        section {
            display: inline-block;
        }

        .colored {
            color: var(--navds-global-color-blue-500);
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
                word-break: break-word;
            }
        }
    }

    @media (min-width: 600px) {
        .column {
            min-width: 300px;
        }
    }
`

export const ButtonContainer = styled.div`
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;

    margin-top: 2rem;
`

const HeadingWrapper = styled.div`
    margin-top: 2rem;

    display: flex;
    justify-content: center;
`

export const getServerSideProps = async (context) => {
    const [{ tab }, , , ,] = await Promise.all([context.query])

    return {
        props: {
            tab,
        },
    }
}

const AdminPage = ({
    tab,
    dashbordProps,
    areasProps,
    servicesProps,
    componentProps,
}) => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)

    const selectedMenu = useFindCurrentTab(adminMenu)
    const { title } = useContext(TitleContext)

    // const [dashboards, setDashboards] = useState<Dashboard[]>()
    // const [areas, setAreas] = useState<Area[]>()
    // const [services, setServices] = useState<Service[]>()
    // const [components, setComponents] = useState<Component[]>()

    const approvedUsers: string[] = [
        "L152423",
        "H161540",
        "K146221",
        "J104568",
        "G124938",
        "M106261",
        "M137316",
        "H166137",
        "G121973",
    ]

    const user = useContext(UserStateContext)

    useEffect(() => {
        setIsLoading(false)
    }, [])

    useEffect(() => {
        setIsLoading(true)
    }, [selectedMenu])

    useEffect(() => {
        setIsLoading(true)
        if (router.isReady) {
            setIsLoading(false)
        }
    }, [router])

    if (isLoading) {
        return <CustomNavSpinner />
    }

    if (!user.navIdent) {
        router.push(RouterPrivatperson.PATH)
        return <CustomNavSpinner />
    }

    return (
        <Layout>
            <AdminDashboardContainer>
                <AdminConfigsContainer>
                    <MenuSelector user={user} />
                    <HeadingWrapper>
                        <Heading size="large" level="2">
                            {title}
                        </Heading>
                    </HeadingWrapper>
                    {approvedUsers.includes(user.navIdent) && (
                        <>
                            {selectedMenu === "Dashbord" && <TableDashbord />}
                            {selectedMenu === "Områder" && <TableOmraade />}
                        </>
                    )}

                    {selectedMenu === "Tjenester" && <TableTjeneste />}
                    {selectedMenu === "Komponenter" && <TableKomponent />}
                </AdminConfigsContainer>
            </AdminDashboardContainer>
            <ToastContainer />
        </Layout>
    )
}

// HELPER BELOW

export const CloseCustomized = styled(Close)`
    color: red;
    :hover {
        color: grey;
        border: 1px solid;
        cursor: pointer;
    }
`

export default AdminPage
