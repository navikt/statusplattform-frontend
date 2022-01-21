import styled from "styled-components"
import Link from 'next/link'
import { useState } from "react"

import { BodyShort, Button, Checkbox, Heading, Radio, RadioGroup, TextField } from "@navikt/ds-react"
import { useRouter } from "next/router"
import { toast } from "react-toastify"
import { Refresh } from "@navikt/ds-icons"


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

    @media (min-width: 430px) {
        width: 430px;
    }
`

const CreateNotifications = () => {
    const [chosenOTP, changeChosenOTP] = useState<string>("E-post")
    const [phone, updatePhone] = useState<string>()
    const [epost, updateEmail] = useState<string>()

    const [emailSelected, changeEmailSelected] = useState<boolean>(true)
    const [acceptsTerms, updateAcceptsTerms] = useState<string>("")

    const [clickedSendOtp, changeClickedSendOtp] = useState<boolean>(false)

    const router = useRouter()




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

    const handleUpdateAcceptsTerms = (event) => {
        console.log(event)
    }





    if(clickedSendOtp) {
        return <Otp phoneNumber={phone} changeClickedSendOtp={(state: boolean) => changeClickedSendOtp(state)}/>
    }







    return (
        <NotificationsContainer>
            <Heading spacing level="2" size="medium">For å få "varsler" må du opprette en profil</Heading>

            <BodyShort>For å opprette en profil, trenger vi å sende deg et engangspassord</BodyShort>

            <form>
                <RadioGroup legend="Hvordan vil du ha passordet tilsendt?" defaultValue={(chosenOTP) ? chosenOTP : "E-post"} onChange={(event) => handleChangeOTP(event)}>
                    <Radio value="E-post">E-post</Radio>
                    <Radio value="Telefon">Telefon</Radio>
                </RadioGroup>

                <div className="otp-input">
                    <BodyShort>Fyll inn din epost i feltet nedenfor, så sender vi deg engangspassordet på {emailSelected ? "Epost" : "SMS"}</BodyShort>
                    <TextField label="E-post" value={phone} onChange={event => handleUpdatePhone(event)} />
                </div>

                <Checkbox value={acceptsTerms} onChange={event => handleUpdateAcceptsTerms(event)} >Jeg godtar <Link href="#">personvernerklæring og vilkår for bruk</Link></Checkbox>
                
                <ButtonContainer>
                    <Button onClick={() => router.push("/")}>Avbryt</Button>

                    <Button onClick={() => changeClickedSendOtp(true)}>Send passord på {emailSelected ? "Epost" : "SMS"}</Button>
                </ButtonContainer>
            </form>

        </NotificationsContainer>
    )
}




const ButtonContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    
    @media(min-width: 300px) {
        flex-direction: row;
    }
`


const OtpContainer = styled.div`
    display: flex;
    flex-direction: column;

    > * {
        margin-bottom: 20px;
    }
`




const Otp: React.FC<{phoneNumber: string, changeClickedSendOtp: (state) => void }> = ({phoneNumber, changeClickedSendOtp}) => {
    return (
        <OtpContainer>
            <Heading level="2" size="medium">Fyll inn passordet fra SMS</Heading>
            
            <BodyShort>Fyll inn engangspassordet du mottok på SMS.</BodyShort>

            <BodyShort>Mottok du ikke passordet? <Refresh /> <span onClick={() => toast.info("Nytt passord sent")}>Send passordet på nytt</span></BodyShort>

            <TextField label="Engangspassord fra SMS" />

            <ButtonContainer>
                <Button onClick={() => changeClickedSendOtp(false)}>Avbryt</Button>
                <Button>Opprett profil</Button>
            </ButtonContainer>
        </OtpContainer>
    )
}




export default CreateNotifications