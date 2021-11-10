import { useRouter } from 'next/router'
import Link from 'next/link'
import styled from 'styled-components'

import Lenke from 'nav-frontend-lenker';
import { Normaltekst, } from "nav-frontend-typografi";

const Nav = styled.nav `
	height: 2.75rem;
    background-color: white;
	border-bottom: #c6c2bf 1px solid;
	display: none;
	ul {
		list-style: none;
		padding: 0;
		margin: 0;
		height: 100%;
		width: 100%;
		display: flex;
		justify-content: center;
	}
	@media (min-width: 768px) {
		display: block;
	}
`


const LenkeInner = styled(Lenke)`
	color: black;
	height: 100%;
	text-decoration: none;
	display: flex;
	align-items: center;
	.inactive {
		border-bottom: transparent 3px solid;
		:hover {
			border-bottom: var(--navBla) 3px solid;
		}
	}
	:focus, :active {
		color: black;
		background-color: transparent;
		outline: var(--fokusFarge) 3px solid;
    	box-shadow: 0 0 0 0;
		outline-offset: -3px;
	}
`;

const LenkeInnerTest = styled.div`
	margin: 0 1rem;
	height: 100%;
	border-bottom: 3px transparent;
	display: flex;
	align-items: center;
	&.active {
		border-bottom: var(--navBla) 3px solid;
		p {
			font-weight: bold !important;
		}
	}
`

const NormalTekstCustomized = styled(Normaltekst)`
	font-size: 1rem;
	line-height: 1.375rem;
`;


export default function Navbar() {
	const router = useRouter()

	return (
		<Nav>
			{/* Lag skip links */}
			<ul role="tablist">
				<li role="tab">
					<Link href={"/Dashboard/Privatperson"}>
						<LenkeInner>
							<LenkeInnerTest className={`${(router.asPath === "/Dashboard/Privatperson") ? "active" : "inactive"}`}>
								<NormalTekstCustomized>Privatperson</NormalTekstCustomized>
							</LenkeInnerTest>
						</LenkeInner>
					</Link>
				</li>
				<li role="tab">
					<Link href={"/Dashboard/Arbeidsgiver"}>
						<LenkeInner href="/Dashboard/Arbeidsgiver" className={`${router.pathname === "/Arbeidsgiver" ? "active" : ""}`}>
							<LenkeInnerTest className={`${(router.asPath === "/Dashboard/Arbeidsgiver") ? "active" : "inactive"}`}>
								<NormalTekstCustomized>Arbeidsgiver</NormalTekstCustomized>
							</LenkeInnerTest>
						</LenkeInner>
					</Link>
				</li>
				<li role="tab">
					<Link href={"/Dashboard/Samarbeidspartner"}>
						<LenkeInner href="/Dashboard/Samarbeidspartner" className={`${router.pathname === "/Samarbeidspartner" ? "active" : ""}`}>
							<LenkeInnerTest className={`${(router.asPath === "/Dashboard/Samarbeidspartner") ? "active" : "inactive"}`}>
								<NormalTekstCustomized>Samarbeidspartner</NormalTekstCustomized>
							</LenkeInnerTest>
						</LenkeInner>
					</Link>
				</li>
				<li role="tab">
					<Link href={"/Dashboard/Internt"}>
						<LenkeInner href="/Dashboard/Internt" className={`${router.pathname === "/Internt" ? "active" : ""}`}>
							<LenkeInnerTest className={`${(router.asPath === "/Dashboard/Internt") ? "active" : "inactive"}`}>
								<NormalTekstCustomized>Internt (Kun for innloggede NAV-brukere)</NormalTekstCustomized>
							</LenkeInnerTest>
						</LenkeInner>
					</Link>
				</li>




			</ul>
		</Nav>
	)
}