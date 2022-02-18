import styled from 'styled-components'

import Layout from '../../components/Layout';
import Admin from '../../components/Admin';
import MenuSelector from '../../components/Admin/MenuSelector';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

const AdminContainer = styled.div`
    width: 100%;
`

export const HorizontalSeparator = styled.span`
    display: block;

    padding: 1px 0;
    margin: 16px 0;

    width: 100%;
    height: 100%;
    background-color: var(--navGra20);
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
            color: var(--navBla);
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