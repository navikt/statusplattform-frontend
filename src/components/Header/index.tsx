import styled from 'styled-components'
import { createRef, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'

import { Collapse, Expand, Logout, PeopleFilled } from '@navikt/ds-icons'
import { BodyShort, Button, Checkbox, Heading, Popover } from '@navikt/ds-react'

import SubscribeModal from '../../components/SubscribeModal'
import BurgerMenu from '../../components/BurgerMenu'
import { FilterContext, FilterOption } from '../ContextProviders/FilterContext'
import { RouterHomePage, RouterInternt, RouterLogin, RouterLogout } from '../../types/routes'
import { UserStateContext } from '../ContextProviders/UserStatusContext'
import { testing } from 'src/utils/checkLoginInfoAndState'





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
        @media(max-width: 1149px) {
            padding: 3px 0;
            min-height: inherit;

            display: flex;
            flex-direction: column;
            align-items : flex-end;
            justify-content: space-between;
            
            button {
                margin: 0;
            }
        }

        @media(min-width: 1150px) {
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

    @media(min-width: 1150px) {
        margin-right: 150px;
    }
`

const HeadingCustomized = styled(Heading)`
    display: none;

    text-align: center;
    font-weight: normal;
    
    @media(min-width: 390px){
        width: 100%;
        display: block;
    }
    @media(min-width: 450px) {
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

    const { name, navIdent } = useContext(UserStateContext)
    

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

    const conditionalReroute = () => {
        if(!navIdent) {
            router.push(RouterInternt.PATH)
        }
        else {
            router.push(RouterHomePage.PATH)
        }
    }
    

    return (
        <CustomHeader>
            <div className="header-menues">
                <a href={RouterHomePage.PATH} aria-label="Lenke til forside">
                    <img src="/sp/assets/nav-logo/png/black.png" alt="Til forsiden" aria-hidden="true" />
                </a>
            </div>

            <HeaderContent>
                <HeadingCustomized size="2xlarge" level="1">
                    <b>Status</b> digitale tjenester
                </HeadingCustomized>
            </HeaderContent>

            <div className="header-menues last">
                <BurgerMenu />
                <ProfileOrLogin name={name} navIdent={navIdent} />
            </div>


            {/* <HeaderOptions>
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
                } */}


                    {/* {router.pathname.includes("Dashboard") &&
                        <FilterButtonWrapper>
                            <Button variant="secondary" size="medium" onClick={(event) => openPopover(event.currentTarget)}>
                                Filtrer
                            </Button> */}

                            {/* <Button ref={filterRef} onClick={() => toggleFilters(!showFilters)}>
                                Filtrer
                            </Button> */}
                            {/* <Popover
                                open={!!anchor}
                                onClose={() => closePopover()}
                                anchorEl={anchor}
                                placement="bottom"
                            >
                                <Popover.Content>
                                    <Filters />
                                </Popover.Content>
                            </Popover> */}
                            {/* {showFilters &&
                            } */}
                        {/* </FilterButtonWrapper> */}
                    {/* } */}
                {/* </ButtonsContainer> */}
            {/* </HeaderOptions> */}
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
                            value={option} 
                            checked={filters.includes(option)} 
                            onChange={(event) => {handleFilter(event)}} 
                        >
                            {option}
                        </Checkbox>
                    )
                })
            }
        </FilterRow>
    )
}









// ---

const ProfileButton = styled(Button)`
    border-radius: 50px;
    min-width: 148px;
    color: black;
    box-shadow: inset 0 0 0 2px black;

    :hover {
        background: black;
    }
`


const LoginButton = styled(Button)`
    border-radius: 50px;
    min-width: 148px;
    color: black;
    box-shadow: inset 0 0 0 2px black;

    :hover {
        background: black;
    }
`


const PopoverCustomized = styled(Popover)`
    width: max-content;

    ul {
        padding: 0;
        margin: 1rem;
    }
    
    ul > li {
        color: black;
        list-style: none;
        text-align: left;
    }

    li {
        padding: 1rem 0;
    }

    .navds-link, svg {
        color: black;
        cursor: pointer;
    }
`




const ProfileOrLogin: React.FC<{name: string, navIdent: string}> = ({name, navIdent}) => {
    const router = useRouter()

    const [open, setOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState(undefined)

    const handleSetOpen = (event) => {
        setOpen(!open)
        if(anchorEl) {
            setAnchorEl(undefined)
            return
        }
        setAnchorEl(event)
    }

    const closePopover = () => {
        setOpen(!open)
        if(anchorEl) {
            setAnchorEl(undefined)
        }
    }

    return (
        <>
            {(name && navIdent)
            ?
                <>
                    <ProfileButton variant="secondary" onClick={(event) => handleSetOpen(event.currentTarget)} aria-expanded={!!anchorEl} >
                        <PeopleFilled />
                    </ProfileButton>
                    <PopoverCustomized
                        open={open}
                        onClose={closePopover}
                        anchorEl={anchorEl}
                        placement="bottom"
                    >
                        <PopoverCustomized.Content>
                            <strong>{name}</strong>
                            <ul>
                                <li>
                                    <span className="navds-link" onClick={() => toast.info("Ikke implementert enda")}>Min side</span>
                                </li>
                                <li>
                                    <span className="navds-link" onClick={() => toast.info("Ikke implementert enda")}>Mine varsler</span>
                                </li>
                                <li>
                                    <a className="navds-link" href={RouterLogout.PATH}> <Logout /> Logg ut</a>
                                </li>
                            </ul>
                        </PopoverCustomized.Content>
                    </PopoverCustomized>
                </>
            :
                <LoginButton variant="secondary"
                    onClick={() => router.push(RouterLogin.PATH)}
                >
                    <BodyShort>
                        <b>Logg inn</b>
                    </BodyShort>
                </LoginButton>
            }
        </>
    )
}




export default Header