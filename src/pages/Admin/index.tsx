import styled from 'styled-components'
import { ToastContainer } from 'react-toastify';

import Layout from '../../components/Layout';
import Admin from '../../components/Admin';
import MenuSelector from '../../components/Admin/MenuSelector';
import { UserStateContext } from '../../components/ContextProviders/UserStatusContext';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { RouterPrivatperson } from '../../types/routes';
import CustomNavSpinner from '../../components/CustomNavSpinner';


const AdminContainer = styled.div`
    width: 100%;
`

export const HorizontalSeparator = styled.span`
    display: block;

    padding: 1px 0;
    margin: 16px 0;

    width: 100%;
    height: 100%;
    background-color: var(--navds-global-color-gray-200);
`

export const DynamicListContainer = styled.div`
    display: flex;
    flex-direction: column;

    gap: 16px;

    .new-list {
        list-style: none;
        padding: 0;
        
        section {
            display: inline-block;
        }

        .colored {
            color: var(--navds-global-color-blue-500);
            text-decoration: underline;
            background-color: none;
            border: none;

            label {
                position: absolute;
                z-index: -1000;
            }

            :hover {
                text-decoration: none;
                cursor: pointer;
            }
        }

        li {
            p {
                margin: 8px 0;

                display: flex;
                justify-content: space-between;
            }
        }
    }
`

 const AdminPage = () => {
    const user = useContext(UserStateContext)
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
     
    useEffect(() => {
        setIsLoading(true)
        const setUpInitial = async () => {
            await user
            await router

        }
        setUpInitial().catch(console.error)
        setIsLoading(false)
    },[router, user])

    
    if(isLoading) {
        return <CustomNavSpinner />
    }

    if(!user.navIdent || user.navIdent.length == 0) {
        router.push(RouterPrivatperson.PATH)
        return <CustomNavSpinner />
    }

    return (
        <Layout>
            <AdminContainer>
                <MenuSelector />
                <Admin />
            </AdminContainer>
            <ToastContainer/>
        </Layout>
    )
}

export default AdminPage