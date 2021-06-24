
import styled from 'styled-components'
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

const options = [
    <Bag />, 'two', 'three'
  ];
  const defaultOption = options[0];


const DropdownContainer = styled(Dropdown)`
    transition: 0.4s;
`

export const IconDropDown = () => {
    return (
        <DropdownContainer>
            <Dropdown options={options} onChange={getBag()} value={defaultOption} placeholder="Select an option" />

        </DropdownContainer>
    )
}