import styled from 'styled-components'

import { Sidetittel } from 'nav-frontend-typografi'
import { Knapp } from 'nav-frontend-knapper'

import ProfileOrLogin from 'components/ProfileOrLogin'
import SubscribeModal from 'components/SubscribeModal'
import { useState } from 'react'




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
    a {
        display: flex;
        justify-content: center;
        align-items: center;
        max-width: 84px;
        max-height: 55px;
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
const SubscribeButton = styled(Knapp)`
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
        top: 170px;
    }
`



const Header = () => {
    const [subscribeModalHidden, setSubscribeModalBoolean] = useState(false)

    const toggleSubscribeModal = () => {
        setSubscribeModalBoolean(!subscribeModalHidden)
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
				<SubscribeButton mini onClick={toggleSubscribeModal}>Abonner</SubscribeButton>
			</span>
			{subscribeModalHidden && 
				<SubscribeModalWrapper>
					<SubscribeModal toggleSubscribeModal={toggleSubscribeModal}/>
				</SubscribeModalWrapper>
			}
            <ProfileOrLogin />
        </CustomHeader>
    )
}

export default Header