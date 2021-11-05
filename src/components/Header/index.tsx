import styled from 'styled-components'

import { Sidetittel } from 'nav-frontend-typografi'
import { Knapp } from 'nav-frontend-knapper'

import BurgerMenu from 'components/BurgerMenu'
import SubscribeModal from 'components/SubscribeModal'
import { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { CheckboksPanelGruppe, Checkbox } from 'nav-frontend-skjema'
import { FilterContext, FilterOption } from 'components/ContextProviders/FilterContext'
import { Collapse, Expand } from '@navikt/ds-icons'




export const CustomHeader = styled.header`
    min-height: 106px;
    height: 100%;
    padding-bottom: 0.5rem;
    background-color: white;
    border-bottom: 1px solid #c6c2bf;
    display: flex;
    flex-flow: column wrap;
    align-items: center;
    img {
        max-width: 84px;
        max-height: 55px;
        :hover {
            transform: scale(1.05)
        }
    }
    
    > h1 {
        font-size: 1.875rem;
        font-weight: 600;
    }

    @media (min-width: 650px) {
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
    @media(min-width: 390px){
        width: 100%;
    }
    @media (min-width: 650px) {
        text-align: start;
    }
`
const HeaderContent = styled.span`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    @media (min-width: 450px){
        flex-direction: row;
    }
`
const CustomButton = styled(Knapp)`
    height: 3rem;
    transition: 0.4s;
	width: 7rem;
	margin-right: 0.5rem;
    :hover {
        transition: 0.4s;
        background-color: var(--navBla);
        color: white;
    }
`
const SubscribeModalWrapper = styled.div`
    right: 0;
    top: 325px;
    position: absolute;
	@media(min-width: 305px){
        top: 300px;
    }
    @media(min-width: 400px){
        top: 275px;
    }
    @media(min-width: 650px){
        top: 150px;
    }
`
const FilterButtonWrapper = styled.div`
    position: relative;
`



const Header = () => {
    const router = useRouter()
    const [subscribeModalHidden, setSubscribeModalBoolean] = useState(false)
    const [showFilters, toggleFilters] = useState(false)

    const toggleSubscribeModal = () => {
        setSubscribeModalBoolean(!subscribeModalHidden)
    }

    const handleToggleFilters = () => {
        toggleFilters(!showFilters)
    }

    return (
        <CustomHeader>
            <a href="https://www.nav.no/no/person#">
                <img src="/assets/nav-logo/png/red.png" alt="LogoRed" />
            </a>
            <HeaderContent>
                <SidetittelCustomized>
                    Status digitale tjenester
                </SidetittelCustomized>
            
            </HeaderContent>
            <span>
				<CustomButton mini onClick={toggleSubscribeModal}>Abonner</CustomButton>
			</span>
            {router.pathname.includes("Dashboard") &&
                <FilterButtonWrapper>
                    <CustomButton mini onClick={handleToggleFilters}>
                        Filtrer
                    </CustomButton>
                    {showFilters &&
                        <Filters />
                    }
                </FilterButtonWrapper>
            }
			{subscribeModalHidden && 
				<SubscribeModalWrapper>
					<SubscribeModal toggleSubscribeModal={toggleSubscribeModal}/>
				</SubscribeModalWrapper>
			}
            <BurgerMenu />
        </CustomHeader>
    )
}







/* ---------------------------------------- Helpers below ---------------------------------------- */













const FilterContainer = styled.div`
    background-color: white;
    padding: 1rem;
    box-shadow: 0 0.05rem 0.25rem 0.125rem rgb(0 0 0 / 8%);
    border: 1px solid #c9c9c9;
    border-radius: 2px;
    position: absolute;
    & > * {
        text-align: left;
        margin: 0;
        padding: 0;
    }
`
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
        <FilterContainer>
            <FilterRow>
                <FilterCategoryButton onClick={() => toggleFilter("Tjenestestatus")}><span>Tjenestestatus({filters.length})</span>
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
        </FilterContainer>
    )
}



export default Header