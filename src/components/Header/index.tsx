import styled from "styled-components"
import { createRef, useContext, useState } from "react"
import { useRouter } from "next/router"
import ProfileMenu from "./ProfileMenu"
import BurgerMenu from "./BurgerMenu"
import { Collapse, Expand } from "@navikt/ds-icons"
import { Checkbox, Detail, Heading } from "@navikt/ds-react"
import { FilterContext, FilterOption } from "../ContextProviders/FilterContext"
import { RouterHomePage, RouterInternt } from "../../types/routes"
import { UserStateContext } from "../ContextProviders/UserStatusContext"

const CustomHeader = styled.header`
    min-height: 106px;
    height: 100%;
    padding-bottom: 0.5rem;
    background-color: white;
    border-bottom: 1px solid #c6c2bf;

    position: relative;
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-items: center;

    .header-menues {
        width: 150px;
    }

    .last {
        @media (max-width: 1149px) {
            padding: 3px 0;
            min-height: inherit;

            display: flex;
            flex-direction: column;
            align-items: flex-end;
            justify-content: space-between;

            button {
                margin: 0;
            }
        }

        @media (min-width: 1150px) {
            position: absolute;
            display: flex;
            right: 150px;
        }
    }

    img {
        max-width: 84px;
        max-height: 55px;
        margin-left: 1rem;

        :hover {
            transform: scale(1.05);
        }
    }

    > h1 {
        font-size: 1.875rem;
        font-weight: 600;
    }

    @media (min-width: 450px) {
        flex-flow: column wrap;
    }
    @media (min-width: 650px) {
        img {
            margin-left: 0;
        }

        padding: 0 1rem;

        flex-flow: row nowrap;
        align-items: center;
        flex-basis: 10% 80% 10%;

        > span {
            padding-left: 20px;
        }
    }
`

const HeaderContent = styled.span`
    width: 100%;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    @media (min-width: 1150px) {
        margin-right: 150px;
    }
`

const HeadingCustomized = styled(Heading)`
    display: none;

    text-align: center;
    font-weight: normal;

    @media (min-width: 390px) {
        width: 100%;
        display: block;
    }
    @media (min-width: 450px) {
        width: 425px;
    }
    @media (min-width: 650px) {
        white-space: normal;
    }
`

const HeaderOptions = styled.div`
    display: flex;
    justify-content: center;
    flex-grow: 1;
    flex-wrap: wrap;

    @media (min-width: 250px) {
        justify-content: flex-end;
    }

    @media (min-width: 768px) {
        flex-wrap: none;
    }
`

const ButtonsContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 16px;
`

const SubscribeModalWrapper = styled.div`
    position: absolute;
    z-index: 100;
    @media (min-width: 930px) {
        right: auto;
    }
`

const SubscribeButtonWrapper = styled.div`
    position: relative;
    display: none;

    @media (min-width: 450px) {
        display: block;
    }
`
const FilterButtonWrapper = styled.div`
    display: none;

    @media (min-width: 450px) {
        display: block;
    }
`

const Header = () => {
    const router = useRouter()
    const [subscribeModalHidden, setSubscribeModalBoolean] = useState(false)
    const [showFilters, toggleFilters] = useState(false)

    const [anchor, setAnchor] = useState(undefined)

    const { name, navIdent } = useContext(UserStateContext)

    const filterRef = createRef()

    const toggleSubscribeModal = () => {
        setSubscribeModalBoolean(!subscribeModalHidden)
    }

    const handleToggleFilters = () => {
        toggleFilters(!showFilters)
    }

    const openPopover = (event) => {
        if (anchor) {
            setAnchor(undefined)
            return
        }
        setAnchor(event)
    }

    const closePopover = () => {
        if (anchor) {
            setAnchor(undefined)
        }
    }

    const conditionalReroute = () => {
        if (!navIdent) {
            router.push(RouterInternt.PATH)
        } else {
            router.push(RouterHomePage.PATH)
        }
    }

    return (
        <CustomHeader>
            <div className="header-menues">
                <a href={RouterHomePage.PATH} aria-label="Lenke til forside">
                    <img
                        src="/sp/assets/nav-logo/png/black.png"
                        alt="Til forsiden"
                        aria-hidden="true"
                    />
                </a>
            </div>

            <HeaderContent>
                <HeadingCustomized size="2xlarge" level="1">
                    <b>Status</b> digitale tjenester{" "}
                    <Detail>Under oppbygging</Detail>
                </HeadingCustomized>
            </HeaderContent>

            <div className="header-menues last">
                <BurgerMenu />
                <ProfileMenu name={name} navIdent={navIdent} />
            </div>
        </CustomHeader>
    )
}

/* ---------------------------------------- Helpers below ---------------------------------------- */

const FilterRow = styled.div`
    padding: 1rem;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;

    & > * {
        margin: 5px 0;
    }
`
const FilterCategoryButton = styled.button`
    font-family: "Source Sans Pro", Arial, sans-serif;
    font-size: 1rem;
    font-weight: bold;

    min-width: 200px;
    margin-bottom: 1rem;
    line-height: 1.5rem;
    padding: 0.3rem 1rem;
    border: 1px solid grey;
    white-space: nowrap;
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const Filters = () => {
    const { filters, changeFilters } = useContext(FilterContext)
    const [filterCategoriesExpanded, changeFilterCategoryExpanded] = useState(
        []
    )

    const handleFilter = (event) => {
        const filterOption = event.target.value
        if (filters.includes(filterOption)) {
            changeFilters(filters.filter((f) => f != filterOption))
            return
        }
        changeFilters([...filters, filterOption])
    }

    const toggleFilter = (category: string) => {
        if (filterCategoriesExpanded.includes(category)) {
            changeFilterCategoryExpanded(
                filterCategoriesExpanded.filter((f) => f != category)
            )
            return
        }
        changeFilterCategoryExpanded([...filterCategoriesExpanded, category])
    }

    return (
        <FilterRow>
            <FilterCategoryButton
                onClick={() => toggleFilter("Tjenestestatus")}
            >
                <span>Tjenestestatus ({filters.length})</span>
                {!filterCategoriesExpanded.includes("Tjenestestatus") ? (
                    <Expand />
                ) : (
                    <Collapse />
                )}
            </FilterCategoryButton>

            {filterCategoriesExpanded.includes("Tjenestestatus") &&
                Object.values(FilterOption).map((option) => {
                    return (
                        <Checkbox
                            aria-checked={filters.includes(option)}
                            key={option}
                            value={option}
                            checked={filters.includes(option)}
                            onChange={(event) => {
                                handleFilter(event)
                            }}
                        >
                            {option}
                        </Checkbox>
                    )
                })}
        </FilterRow>
    )
}

export default Header
