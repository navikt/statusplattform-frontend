import { Accordion } from "@navikt/ds-react"
import styled from "styled-components"
import StatusRadUUTjeneste from "./StatusRadUUTjeneste"

const CustomAccordion = styled(Accordion)`
    width: 50rem;
    background: white;
    border: 2px solid var(--a-gray-200);
    border-radius: 8px;

    @media (min-width: 390px) {
        width: 100%;
        display: block;
    }

    @media (min-width: 850px) {
        width: 50rem;
    }
`
const StatusTableUUTjeneste = ({ UUdataTjeneste }) => {
    return (
        <CustomAccordion>
            {UUdataTjeneste &&
                UUdataTjeneste.length > 0 &&
                UUdataTjeneste.map(({ name, krav }, index: any) => (
                    <StatusRadUUTjeneste key={index} name={name} krav={krav} />
                ))}
        </CustomAccordion>
    )
}

export default StatusTableUUTjeneste
