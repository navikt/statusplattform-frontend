import { useRouter } from 'next/router'
import Link from 'next/link'
import styled from 'styled-components'

import { Normaltekst, } from "nav-frontend-typografi";
import { useContext } from 'react';
import { UserData } from '../../types/userData';
import { UserStateContext } from '../../components/ContextProviders/UserStatusContext';
import { RouterArbeidsgiver, RouterInternt, RouterPrivatperson, RouterSamarbeidspartner } from '../../types/routes';

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

		li {
			:hover {
				cursor: pointer;
			}
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
		}
	}


	@media (min-width: 768px) {
		display: block;
	}
`

const LenkeSpacer = styled.div`
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

    const user = useContext<UserData>(UserStateContext)


	return (
		<Nav>
			<ul role="tablist">
				<li role="tab">
					<Link href={RouterPrivatperson.PATH}>
						<LenkeSpacer className={`${(router.asPath === RouterPrivatperson.PATH) ? "active" : "inactive"}`}>
							<NormalTekstCustomized className={`${router.pathname === "/Privatperson" ? "active" : ""}`}>{RouterPrivatperson.NAME}</NormalTekstCustomized>
						</LenkeSpacer>
					</Link>
				</li>

				<li role="tab">
					<Link href={RouterArbeidsgiver.PATH}>
						<LenkeSpacer className={`${(router.asPath === RouterArbeidsgiver.PATH) ? "active" : "inactive"}`}>
							<NormalTekstCustomized className={`${router.pathname === "/Arbeidsgiver" ? "active" : ""}`}>{RouterArbeidsgiver.NAME}</NormalTekstCustomized>
						</LenkeSpacer>
					</Link>
				</li>

				<li role="tab">
					<Link href={RouterSamarbeidspartner.PATH}>
						<LenkeSpacer className={`${(router.asPath === RouterSamarbeidspartner.PATH) ? "active" : "inactive"}`}>
							<NormalTekstCustomized className={`${router.pathname === "/Samarbeidspartner" ? "active" : ""}`}>{RouterSamarbeidspartner.NAME}</NormalTekstCustomized>
						</LenkeSpacer>
					</Link>
				</li>

				{user.navIdent &&
					<li role="tab">
						<Link href={RouterInternt.PATH}>
							<LenkeSpacer className={`${(router.asPath === RouterInternt.PATH) ? "active" : "inactive"}`}>
								<NormalTekstCustomized className={`${router.pathname === "/Internt" ? "active" : ""}`}>{RouterInternt.NAME}</NormalTekstCustomized>
							</LenkeSpacer>
						</Link>
					</li>
				}
			</ul>
		</Nav>
	)
}