import { useRouter } from 'next/router'
import Link from 'next/link'
import styled from 'styled-components'

import Lenke from 'nav-frontend-lenker';
import { Normaltekst, } from "nav-frontend-typografi";

const Nav = styled.nav `
	height: 2.75rem;
    background-color: white;
	border-bottom: #c6c2bf 1px solid;
	display: flex;
	flex-direction: column;
	align-items: center;
	ul {
		gap: 1rem;
		list-style: none;
		padding: 0;
		margin: 0;
		height: 100%;
		width: 100%;
		display: flex;
		justify-content: center;
	}
`

const LenkeCustomized = styled(Lenke)`
	text-decoration: none;
	color: black;
	height: 100%;
	&active {
		border-bottom: var(--navBla) 3px solid;
	}
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
	height: 100%;
	display: flex;
	align-items: center;
	:hover {
		border-bottom: var(--navBla) 3px solid;
		color: var(--navBla);
	}
`;



const NormalTekstCustomized = styled(Normaltekst)`
	font-size: 1rem;
	line-height: 1.375rem;
`;


export default function Navbar() {
	const router = useRouter()


	return (
		<Nav>
			<ul role="tablist">
				<li role="tab">
					<Link href={"/Privatperson"}>
						<LenkeCustomized>
							<LenkeInner className={`${(router.pathname === "/" || router.pathname === "/Privatperson") ? "active" : ""}`}>
								<NormalTekstCustomized>Privatperson</NormalTekstCustomized>
							</LenkeInner>
						</LenkeCustomized>
					</Link>
				</li>
				<li role="tab">
					<Link href="/Arbeidsgiver">
						<LenkeCustomized>
							<LenkeInner className={`${router.pathname === "/Arbeidsgiver" ? "active" : ""}`}>
								<NormalTekstCustomized>Arbeidsgiver</NormalTekstCustomized>
							</LenkeInner>
						</LenkeCustomized>
					</Link>
				</li>
				<li role="tab">
					<Link href="/Samarbeidspartner">
						<LenkeCustomized>
							<LenkeInner className={`${router.pathname === "/Samarbeidspartner" ? "active" : ""}`}>
								<NormalTekstCustomized>Samarbeidspartner</NormalTekstCustomized>
							</LenkeInner>
						</LenkeCustomized>
					</Link>
				</li>
				{/* <li role="tab">
					<LinkWrapper>
						<Link href="/admin">
							<LenkeCustomized>
								<LenkeInner className={`${router.pathname === "/admin" ? "active" : ""}`}>
									<NormalTekstCustomized>Admin</NormalTekstCustomized>
								</LenkeInner>
							</LenkeCustomized>
						</Link>
					</LinkWrapper>
				</li> */}
			</ul>
		</Nav>
	)
}