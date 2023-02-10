import { Accordion } from "@navikt/ds-react"
import styled from "styled-components"
import UUStatusRow from "./UUStatusRow"

interface UUStatusProps {
    name: String
    title: String
    subItem: {
        id: String
        result: String
        date: String
        subject: String
    }[]
}

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

const StatusTableUUTjeneste = ({ UUdata, UUtype }) => {
    return (
        <CustomAccordion>
            {UUdata &&
                UUdata.length > 0 &&
                UUdata.map(
                    ({ name, subItem }: UUStatusProps, index: number) => (
                        <UUStatusRow
                            key={index}
                            name={name}
                            subItem={subItem}
                            uuType={UUtype}
                        />
                    )
                )}
        </CustomAccordion>
    )
}

export default StatusTableUUTjeneste
