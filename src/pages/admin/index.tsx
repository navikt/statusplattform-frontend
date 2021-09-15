import styled from 'styled-components'

import Layout from 'components/Layout';
import Admin from 'components/Admin';
import MenuSelector from 'components/Admin/MenuSelector';
import { useState } from 'react';

const AdminContainer = styled.div`
    //margin-top:30px;
`

 const AdminPage = () => {
    const [selectedMenu, changeSelectedMenu] = useState("Områdemeny")

    const onClickChangeSelectedMenu = (newMenu: string) => {
        console.log(newMenu)
        changeSelectedMenu(newMenu)
    }

    return (
        <Layout>
            <AdminContainer>
                <MenuSelector currentSelectedMenu = {selectedMenu} onClickSelectedMenu={onClickChangeSelectedMenu}/>
                <Admin selectedMenu={selectedMenu}/>
            </AdminContainer>
        </Layout>
    )
}

export default AdminPage