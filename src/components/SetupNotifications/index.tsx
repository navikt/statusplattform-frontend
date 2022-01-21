import styled from "styled-components"
import { useState } from "react"

import { BodyShort, Heading, Radio, RadioGroup, TextField } from "@navikt/ds-react"


const NotificationsContainer = styled.div`
    display: flex;
    flex-direction: column;

    justify-self: center;

    .navds-radio-buttons {
        margin-bottom: 24px;
    }

    .otp-input {
        display: flex;
        flex-flow: column wrap;

        white-space: pre-wrap;

        label {
            display: none;
        }

        input {
            max-width: 280px;
        }
    }

    @media (min-width: 600px) {
        max-width: 600px;
    }
`

const CreateNotifications = () => {
    const [chosenOTP, changeChosenOTP] = useState<string>("E-post")
    const [phone, updatePhone] = useState<string>()
    const [email, updateEmail] = useState<string>()

    const [emailSelected, changeEmailSelected] = useState<boolean>(true)

    const handleChangeOTP = (event) => {
        changeChosenOTP(event)
        if(emailSelected) {
            updateEmail("")
        }
        else {
            updatePhone("")
        }
        changeEmailSelected(!emailSelected)
    }

    const handleUpdateEmail = (event) => {
        updateEmail(event.target.value)
    }

    const handleUpdatePhone = (event) => {
        updatePhone(event.target.value)
    }

    
    console.log(email + " " + phone)

    return (
        <NotificationsContainer>
            <Heading spacing level="2" size="medium">For å få "varsler" må du opprette en profil</Heading>

            <BodyShort>For å opprette en profil, trenger vi å sende deg et engangspassord</BodyShort>

            <form>
                <RadioGroup legend="Hvordan vil du ha passordet tilsendt?" defaultValue="E-post" onChange={(event) => handleChangeOTP(event)}>
                    <Radio value="E-post">E-post</Radio>
                    <Radio value="Telefon">Telefon</Radio>
                </RadioGroup>

                {chosenOTP == "E-post" ?
                        <div className="otp-input">
                            <BodyShort>Fyll inn din epost i feltet nedenfor, så sender vi deg engangspassordet på mail</BodyShort>
                            <TextField label="E-post" value={phone} onChange={event => handleUpdatePhone(event)} />
                        </div>
                    :
                        <div className="otp-input">
                            <BodyShort>Fyll inn ditt telefonnummer i feltet under, så sender vi deg engangspassordet på SMS</BodyShort>
                            <TextField label="Sms" value={email} onChange={event => handleUpdatePhone(event)} />
                        </div>
                }
            </form>

        </NotificationsContainer>
    )
}

export default CreateNotifications