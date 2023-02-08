import "@navikt/ds-css"
import { Accordion, BodyShort, Tag } from "@navikt/ds-react"
import styled from "styled-components"
import { countStatuses } from "../UUStatus/utility"
import {
    ErrorFilledCustomized,
    HelpTextCustomizedGray,
    SuccessFilledCustomized,
} from "../TrafficLights"

const CustomAccordionHeader = styled(Accordion.Header)`
    .resultpanel {
        display: flex;
        flex-direction: row;
        align-items: center;
    }
`
const CustomAccordionContent = styled(Accordion.Content)`
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .serviceName {
        margin-top: 0.5rem;
    }
`
const CustomBodyShort = styled(BodyShort)`
    margin-right: 1rem;
    margin-left: 0.3rem;
    color: var(--a-gray-800);
`

const uuServiceName = (name) => {
    let shortName = name.replace("WCAG21:", "")
    let formattedName = shortName.replaceAll("-", " ")
    let capitalizedName =
        formattedName.charAt(0).toUpperCase() + formattedName.slice(1)
    return capitalizedName
}

const statusLabel = (result) => {
    switch (result) {
        case "Passed":
            return (
                <Tag variant="success">
                    Passed <SuccessFilledCustomized />
                </Tag>
            )
        case "Failed":
            return (
                <Tag variant="error">
                    Failed <ErrorFilledCustomized />
                </Tag>
            )
        case "Cannot tell":
            return (
                <Tag variant="neutral">
                    Cannot tell <HelpTextCustomizedGray />
                </Tag>
            )
        case "Not checked":
            return (
                <Tag variant="neutral">
                    Not checked <HelpTextCustomizedGray />
                </Tag>
            )
        case "Not present":
            return (
                <Tag variant="neutral">
                    Not present <HelpTextCustomizedGray />
                </Tag>
            )
        default:
            return <Tag variant="neutral">Ingen status</Tag>
    }
}

// type OwnProps = {
//   name: String;
//   krav: {
//     id: String;
//     result: String;
//     date: String;
//     subject: String;
//   }[];
// };

// const StatusRad = ({ name, krav }: OwnProps) => {
const StatusRadUUTjeneste = ({ name, krav }) => {
    return (
        <Accordion.Item>
            <CustomAccordionHeader>
                {name}
                <div className="resultpanel">
                    <SuccessFilledCustomized />
                    <CustomBodyShort>
                        {countStatuses(krav, "Passed")}
                    </CustomBodyShort>
                    <ErrorFilledCustomized />
                    <CustomBodyShort>
                        {countStatuses(krav, "Failed")}
                    </CustomBodyShort>
                    <HelpTextCustomizedGray />
                    <CustomBodyShort>
                        {krav.length -
                            (countStatuses(krav, "Passed") +
                                countStatuses(krav, "Failed"))}
                    </CustomBodyShort>
                </div>
            </CustomAccordionHeader>

            {krav &&
                krav.length > 0 &&
                krav.map(({ id, result }, index: any) => (
                    <CustomAccordionContent key={index}>
                        <BodyShort className="serviceName">
                            {uuServiceName(id)}
                        </BodyShort>

                        {statusLabel(result)}
                    </CustomAccordionContent>
                ))}
        </Accordion.Item>
    )
}

export default StatusRadUUTjeneste
