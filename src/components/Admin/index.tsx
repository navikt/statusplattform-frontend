import { useContext } from 'react';
import styled from 'styled-components'

import { Close } from '@navikt/ds-icons';

import AreaTable from './AreaTable';
import TjenesteTable from './TjenesteTable';
import DashboardTable from './DashboardTable';
import { adminMenu, useFindCurrentTab } from './MenuSelector';
import KomponentTable from './KomponentTable';
import { TitleContext } from '../ContextProviders/TitleContext';
import { Heading } from '@navikt/ds-react';
import { UserData } from '../../types/userData';




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
`;



const AdminConfigsContainer = styled.div`
    background-color: white; 
       
    width: 100%;
    padding: 0 1rem;
    
    h2 {
        margin: 0 0 .5rem;
        display: flex;
        justify-content: space-between;
    }
`;

const HeadingWrapper = styled.div`
    margin-top: 2rem;

    display: flex;
    justify-content: center;
`


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




export interface Props {
    selectedMenu?: string
}

const AdminDashboard: React.FC<({user: UserData})> = ({user}) => {
    const selectedMenu = useFindCurrentTab(adminMenu)
    const {title} = useContext(TitleContext)

    const approvedUsers: string[] = [
        "L152423", "H161540", "K146221", "J104568", "G124938", "M106261",
    ]
    
    
	return (
        <AdminDashboardContainer>
            <AdminConfigsContainer>
                <HeadingWrapper>
                    <Heading size="large" level="2">{title}</Heading>
                </HeadingWrapper>
                {approvedUsers.includes(user.navIdent) &&
                    <>
                        {selectedMenu === "Dashbord" &&
                            <DashboardTable />
                        }
                        {selectedMenu === "Områder" &&
                            <AreaTable />
                        }
                    </>
                }

                
                {selectedMenu === "Tjenester" && 
                    <TjenesteTable />
                }
                {selectedMenu === "Komponenter" &&
                    <KomponentTable />
                }
            </AdminConfigsContainer>
        </AdminDashboardContainer>
    )
}





/* ----------------------------- HELPER BELOW ----------------------------- */

export const CloseCustomized = styled(Close)`
    color: red;
    :hover {
        color: grey;
        border: 1px solid;
        cursor: pointer;
    }
`



export default AdminDashboard