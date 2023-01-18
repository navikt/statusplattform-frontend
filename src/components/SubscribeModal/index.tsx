import React from "react"
import styled from "styled-components"

import { Telephone, Email } from "@navikt/ds-icons"
import { Button, TextField } from "@navikt/ds-react"

import { ISource, SourceType } from "../../types/source"

const SubscribeModalContainer = styled.div`
    position: relative;
    background-color: var(--a-gray-100-light);
    box-shadow: 1px 1px 4px 5px #ccc;
    max-width: 250px;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;

    ul > li {
        list-style: none;
        border: solid rgba(0, 0, 0, 25%);
        border-width: 0 1px;
        padding: 0.5rem 1rem;
        display: inline;
    }
    ul {
        padding: 0;
        margin: 0;
        border-bottom: 1px solid #ccc;
        background-color: var(--a-gray-400);

        font-size: 1.5rem;
        color: white;
        display: flex;
        justify-content: space-between;
    }
`

const ListItemWrapper = styled.li`
    height: 3rem;
    width: 25%;
    //Use !important to override nav-Telephone and nav-Email styles
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    border: 1px solid black;
    :hover {
        cursor: pointer;
        background-color: var(--a-blue-100);
    }
    img {
        min-height: 3rem;
    }
    :active {
        background: var(--a-gray-800);
    }
`

const SubscribeModalContent = styled.div`
    padding: 1rem;
    display: flex;
    flex-direction: column;
    p {
        margin-top: 0;
    }
    div {
        display: flex;
        flex-direction: column;
        :first-child {
            margin-bottom: 10px;
        }
    }
`

const CustomLukknapp = styled(Button)`
    border: none;
    color: var(--a-gray-100-light);
    :hover {
        background-color: transparent;
    }
`

const handleSlack = (e) => {
    e.preventDefault()
    alert("ikke implementert")
}

const subscribeSources: ISource[] = [
    {
        id: SourceType.phone,
        title: "Telefon",
        content: <Telephone />,
        text: "Du kan motta sms-varsler når statusmeldinger oppdateres. Dersom du ønsker dette, fyll inn nummeret nedenfor: ",
    },
    {
        id: SourceType.email,
        title: "Epost",
        content: <Email />,
        text: "Ved oppdaterte statusmeldinger kan du motta varsling på email. Fyll inn epost nedenfor om dette er ønskelig",
    },
    {
        id: SourceType.slack,
        title: "Slack",
        content: (
            <img
                src="/sp/assets/images/slack-icon.svg"
                alt="Slack icon"
                aria-labelledby="Slack-ikon"
            />
        ),
        text: "Du kan få statusmeldinger rett i Slack. Trykk nedenfor for å starte abonnering",
    },
    {
        id: SourceType.close,
        title: "Close",
        content: <CustomLukknapp />,
    },
]

interface ClickHandler {
    toggleSubscribeModal()
}

const SubscribeModal: React.FC<ClickHandler> = (props) => {
    const [currentActiveSource, setActiveSource] = React.useState<ISource>(
        subscribeSources[0]
    )

    const handleActiveSourceChange = (source: ISource) => {
        setActiveSource(source)
        if (source.id === SourceType.close) {
            props.toggleSubscribeModal()
        }
    }

    const handleSubmit = (id, e) => {
        e.preventDefault()
        alert("ikke implementert")
    }

    return (
        <SubscribeModalContainer>
            <ul>
                {subscribeSources.map((source) => (
                    <ListItemWrapper
                        key={source.id}
                        id={source.id}
                        onClick={(e) => handleActiveSourceChange(source)}
                    >
                        {source.content}{" "}
                    </ListItemWrapper>
                ))}
            </ul>
            <SubscribeModalContent>
                {currentActiveSource.id === SourceType.slack ? (
                    <>
                        <form>
                            <p>{currentActiveSource.text}</p>
                            <Button onClick={(e) => handleSlack(e)}>
                                Abonner
                            </Button>
                        </form>
                    </>
                ) : (
                    <>
                        <p>{currentActiveSource.text}</p>
                        <form>
                            <TextField label={currentActiveSource.title} />
                            <Button
                                onClick={(e) =>
                                    handleSubmit(currentActiveSource.id, e)
                                }
                            >
                                Abonner
                            </Button>
                        </form>
                    </>
                )}
            </SubscribeModalContent>
        </SubscribeModalContainer>
    )
}

export default SubscribeModal
