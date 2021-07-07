import { useRouter } from 'next/router'
import Link from 'next/link'
import styled from 'styled-components'
import React from 'react'

import SubscribeModal from 'components/SubscribeModal'

import Lenke from 'nav-frontend-lenker';
import { Knapp } from 'nav-frontend-knapper';
import { Normaltekst, } from "nav-frontend-typografi";

const Nav = styled.div `
	height: 100%;
	width: 100%;
	margin: 0 auto;
	padding: 0.2rem 0;
    background-color: white;
	display: flex;
	flex-direction: column;
	align-items: center;
	> ul {
		padding-left: 0;
		width: 100%;
		display: flex;
		justify-content: center;
		:first-child {
			flex-direction: column;
			align-items: flex-start;
		}
		@media(min-width: 400px) {
			:first-child {
				flex-direction: row;
			}	
		}
	}
	> ul > li {
		display: inline-block;
		outline: none;
	}
	a {
		height: calc(100% + 1px);
		display: inline-block;
		text-decoration: none;
		color: black;
		&active {
			border-bottom: var(--navBla) 3px solid;
		}
	}
	@media (min-width: 225px){
		flex-direction: row;
	}
	@media (min-width: 500px){
		margin-bottom: 50px;
	}
`

const LinkWrapper = styled.div`
	height: 100%;
    margin: 0 0.5rem;
    border-bottom: transparent 3px solid;
	display: flex;
    align-items: center;
	justify-content: center;
`;
const LenkeCustomized = styled(Lenke)`
	:focus {
		background-color: transparent !important;
	}
	.active {
		border-bottom-color: var(--fokusFarge) !important;
		background-color: transparent;

		> p {
			font-weight: bold !important;
			color: black !important;
		}
	}
`;
const LenkeInner = styled.div`
	border-bottom: transparent 3px solid;
	:hover {
		border-bottom: var(--navBla) 3px solid;
		color: var(--navBla);
	}
`;

const SubscribeButton = styled(Knapp)`
    border-radius: 30px;
    height: 3rem;
    transition: 0.4s;
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

const NormalTekstCustomized = styled(Normaltekst)`
	font-size: 1rem;
	line-height: 1.375rem;
`;


export default function Navbar() {
	const router = useRouter()
	const [subscribeModalHidden, setSubscribeModalBoolean] = React.useState(false)

    const toggleSubscribeModal = () => {
        setSubscribeModalBoolean(!subscribeModalHidden)
    }

	return (
		<Nav>
			<ul role="tablist">
				<li role="tab">
					<LinkWrapper>
						<Link href="/">
							<LenkeCustomized>
								<LenkeInner className={`${router.pathname === "/" ? "active" : ""}`}>
									<NormalTekstCustomized>Privatperson</NormalTekstCustomized>
								</LenkeInner>
							</LenkeCustomized>
						</Link>
					</LinkWrapper>
				</li>
				<li role="tab">
					<LinkWrapper>
						<Link href="/arbeidsgiver">
							<LenkeCustomized>
								<LenkeInner className={`${router.pathname === "/arbeidsgiver" ? "active" : ""}`}>
									<NormalTekstCustomized>Arbeidsgiver</NormalTekstCustomized>
								</LenkeInner>
							</LenkeCustomized>
						</Link>
					</LinkWrapper>
				</li>
				<li role="tab">
					<LinkWrapper>
						<Link href="/admin">
							<LenkeCustomized>
								<LenkeInner className={`${router.pathname === "/admin" ? "active" : ""}`}>
								<NormalTekstCustomized>Admin</NormalTekstCustomized>
							</LenkeInner>
						</LenkeCustomized>
					</Link>
					</LinkWrapper>
				</li>
			</ul>
			<span>
				<SubscribeButton mini onClick={toggleSubscribeModal}>Abonner</SubscribeButton>
			</span>
			{subscribeModalHidden && 
				<SubscribeModalWrapper>
					<SubscribeModal toggleSubscribeModal={toggleSubscribeModal}/>
				</SubscribeModalWrapper>
			}
		</Nav>
	)
}