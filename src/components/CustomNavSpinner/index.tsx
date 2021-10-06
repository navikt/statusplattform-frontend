import NavFrontendSpinner from 'nav-frontend-spinner'
import styled from 'styled-components'


const SpinnerCentered = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`

const CustomNavSpinner = () => {
    return (
        <SpinnerCentered>
            <NavFrontendSpinner type="XXL"/>
        </SpinnerCentered>
    )
}

export default CustomNavSpinner