import styled from 'styled-components'

import { Sidetittel } from 'nav-frontend-typografi'
import { Knapp } from 'nav-frontend-knapper'

import BurgerMenu from '../../components/BurgerMenu'
import SubscribeModal from '../../components/SubscribeModal'
import { createRef, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { Checkbox } from 'nav-frontend-skjema'
import { FilterContext, FilterOption } from '../ContextProviders/FilterContext'
import { Collapse, Expand } from '@navikt/ds-icons'
import { UserStateContext } from '../ContextProviders/UserStatusContext'
import { UserData } from '../../types/userData'
import { Button, Popover } from '@navikt/ds-react'




const CustomHeader = styled.header`
    min-height: 106px;
    height: 100%;
    padding-bottom: 0.5rem;
    background-color: white;
    border-bottom: 1px solid #c6c2bf;
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-items: center;
    img {
        max-width: 84px;
        max-height: 55px;
        margin-left: 1rem;
        :hover {
            transform: scale(1.05)
        }
    }
    
    > h1 {
        font-size: 1.875rem;
        font-weight: 600;
    }
    @media(min-width: 450px) {
        flex-flow: column wrap;
    }
    @media (min-width: 650px) {
        img {
            margin-left: 0;
        }
        padding: 0 1rem;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: flex-start;
        > span {
            padding-left: 20px;
        }
    }
`
const SidetittelCustomized = styled(Sidetittel)`
    text-align: center;
    display: none;
    @media(min-width: 390px){
        width: 100%;
    }
    @media(min-width: 450px) {
        display: block;
    }
    @media (min-width: 650px) {
        text-align: start;
        white-space: normal;
    }
`
const HeaderContent = styled.span`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    @media (min-width: 450px){
        flex-direction: row;
    }
`

const HeaderOptions = styled.div`
    display: flex;
    justify-content: center;
    flex-grow: 1;
    flex-wrap: wrap;

    @media(min-width: 250px) {
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

    @media(min-width: 450px) {
        display: block;
    }
`
const FilterButtonWrapper = styled.div`
    display: none;

    @media(min-width: 450px) {
        display: block;
    }
`



const Header = () => {
    const router = useRouter()
    const [subscribeModalHidden, setSubscribeModalBoolean] = useState(false)
    const [showFilters, toggleFilters] = useState(false)

    const [anchor, setAnchor] = useState(undefined)
    

    const filterRef = createRef()

    

    const toggleSubscribeModal = () => {
        setSubscribeModalBoolean(!subscribeModalHidden)
    }

    const handleToggleFilters = () => {
        toggleFilters(!showFilters)
    }



    const openPopover = (event) => {
        if(anchor) {
            setAnchor(undefined)
            return
        }
        setAnchor(event)
    }

    const closePopover = () => {
        if(anchor) {
            setAnchor(undefined)
        }
    }
    
    console.log(anchor)

    return (
        <CustomHeader>
            <a href="https://www.nav.no/no/person#">
                <img src="/assets/nav-logo/png/red.png" alt="Til forsiden" />
            </a>

            <HeaderContent>

                <SidetittelCustomized>
                    Status digitale tjenester
                </SidetittelCustomized>
            
            </HeaderContent>


            <HeaderOptions>
                <ButtonsContainer>
                {router.pathname.includes("Dashboard") &&
                    <SubscribeButtonWrapper>
                        <Button variant="secondary" size="medium" onClick={toggleSubscribeModal}>
                            Abonner
                        </Button>
                        {subscribeModalHidden && 
                            <SubscribeModalWrapper>
                                <SubscribeModal toggleSubscribeModal={toggleSubscribeModal}/>
                            </SubscribeModalWrapper>
                        }
                    </SubscribeButtonWrapper>
                }


                    {router.pathname.includes("Dashboard") &&
                        <FilterButtonWrapper>
                            <Button variant="secondary" size="medium" onClick={(event) => openPopover(event.currentTarget)}>
                                Filtrer
                            </Button>

                            {/* <Button ref={filterRef} onClick={() => toggleFilters(!showFilters)}>
                                Filtrer
                            </Button> */}
                            <Popover
                                open={!!anchor}
                                onClose={() => closePopover()}
                                anchorEl={anchor}
                                placement="auto"
                            >
                                <Popover.Content>
                                    <Filters />
                                    {/* Innhold her! */}
                                </Popover.Content>
                            </Popover>
                            {/* {showFilters &&
                            } */}
                        </FilterButtonWrapper>
                    }
                    <BurgerMenu />
                </ButtonsContainer>
            </HeaderOptions>
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
    const {filters, changeFilters} = useContext(FilterContext)
    const [filterCategoriesExpanded, changeFilterCategoryExpanded] = useState([])
    



    const handleFilter = (event) => {
        const filterOption = event.target.value
        if(filters.includes(filterOption)) {
            changeFilters(filters.filter(f => f != filterOption))
            return
        }
        changeFilters([...filters, filterOption])
    }




    const toggleFilter = (category: string) => {
        if(filterCategoriesExpanded.includes(category)) {
            changeFilterCategoryExpanded(filterCategoriesExpanded.filter(f => f!=category))
            return
        }
        changeFilterCategoryExpanded([...filterCategoriesExpanded, category])
    }




    return (
        <FilterRow>
            <FilterCategoryButton onClick={() => toggleFilter("Tjenestestatus")}><span>Tjenestestatus ({filters.length})</span>
                {!filterCategoriesExpanded.includes("Tjenestestatus") ? <Expand/> : <Collapse />}
            </FilterCategoryButton>

            {filterCategoriesExpanded.includes("Tjenestestatus") &&
                Object.values(FilterOption).map((option) => {
                    return (
                        <Checkbox
                            aria-checked={filters.includes(option)}
                            key={option} 
                            label={option} 
                            value={option} 
                            checked={filters.includes(option)} 
                            onChange={(event) => {handleFilter(event)}} 
                        />
                    )
                })
            }
        </FilterRow>
    )
}



export default Header