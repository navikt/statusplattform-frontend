import "@navikt/ds-css"
import { Accordion, BodyShort, Tag } from "@navikt/ds-react"
import styled from "styled-components"
import { countStatuses } from "../UUStatus/utility"
import {
    ErrorFilledCustomized,
    HelpTextCustomizedGray,
    SuccessFilledCustomized,
} from "../TrafficLights"
import UUStatusDetails from "../../components/UUStatusDetails"

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
const DetailContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin: 0.3rem 0 0.2rem;
    gap: 0.3rem;
`
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

const StatusRadUUTjeneste = ({ name, subItem, uuType }) => {
    return (
        <Accordion.Item>
            <CustomAccordionHeader>
                {name}
                <DetailContainer>
                    {UUStatusDetails(
                        "Passed",
                        countStatuses(subItem, "Passed")
                    )}
                    {UUStatusDetails(
                        "Failed",
                        countStatuses(subItem, "Failed")
                    )}{" "}
                    {UUStatusDetails(
                        "Not checked",
                        countStatuses(subItem, "Not checked")
                    )}
                    {UUStatusDetails(
                        "Not present",
                        countStatuses(subItem, "Not present")
                    )}
                    {UUStatusDetails(
                        "Cannot tell",
                        countStatuses(subItem, "Cannot tell")
                    )}
                </DetailContainer>
            </CustomAccordionHeader>
            {uuType === "krav"
                ? subItem &&
                  subItem.length > 0 &&
                  subItem.map(({ subject, result }, index: number) => (
                      <CustomAccordionContent key={index}>
                          <BodyShort className="serviceName">
                              {subject}
                          </BodyShort>

                          {statusLabel(result)}
                      </CustomAccordionContent>
                  ))
                : subItem &&
                  subItem.length > 0 &&
                  subItem.map(({ id, result }, index: number) => (
                      <CustomAccordionContent key={index}>
                          <BodyShort className="serviceName">{id}</BodyShort>

                          {statusLabel(result)}
                      </CustomAccordionContent>
                  ))}
        </Accordion.Item>
    )
}

export default StatusRadUUTjeneste
