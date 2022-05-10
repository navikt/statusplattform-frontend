import { Button, Select, Textarea } from "@navikt/ds-react"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import { toast } from "react-toastify"
import styled from "styled-components"
import { UserStateContext } from "../../components/ContextProviders/UserStatusContext"
import Layout from "../../components/Layout"
import { RouterInternt, RouterPrivatperson } from "../../types/routes"

const FeedbackFormPage = () => {
    return (
        <Layout>
            <ReportFormComponent />
        </Layout>
    )
}

export default FeedbackFormPage









const ReportFormContainer = styled.div`
    background: white;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    border-radius: 0.25rem;
    padding: 1.5rem;
    max-width: 50rem;
    margin: 0 auto;

    display: flex;
    flex-flow: column wrap;
    gap: 15px;
`


const ReportFormComponent = () => {
    const [selectedOption, setSelectedOption] = useState<string>("")
    const [isLoading, setIsLoading] = useState(true)
    const [message, changeMessage] = useState("")

    const { navIdent } = useContext(UserStateContext)

    const router = useRouter()

    useEffect(() => {
        setIsLoading(true)
        if(router.isReady) {
            setIsLoading(false)
        }
    })


    const handleNewOption = (event) => {
        setSelectedOption(event.target.value)
    }

    const handleMessageChange = () => {
        changeMessage((event.target as HTMLTextAreaElement).value)
    }

    const submitForm = () => {
        event.preventDefault()
        if(selectedOption === "" || message == "") {
            toast.error("Velg en feil")
        } else {
            toast.info("Takk for din tilbakemelding")
            setTimeout(() => {
                if(navIdent.length > 0) {
                    router.push(RouterInternt.PATH)
                }
                router.push(RouterPrivatperson.PATH)
            }, 4000)
        }
    }
    

    return (
        <form onSubmit={submitForm}>
            <ReportFormContainer>
                <Select
                    label="Hva skjer?"
                    size="medium"
                    onChange={handleNewOption}
                >

                    <option value="">Velg typen feil å rapportere</option>
                    <option value="Fant ikke siden jeg ønsket">Fant ikke siden jeg ønsket</option>
                    <option value="Noe feilet i eksisterende side">Noe feilet i eksisterende side</option>
                    <option value="Forslag til forbedring eller ønsket funksjonalitet">Forslag til forbedring eller ønsket funksjonalitet</option>

                </Select>

                <Textarea label="Informasjon om hva du vil rapportere" onChange={handleMessageChange} value={message} />

                <Button type="submit">Send inn</Button>

            </ReportFormContainer>
        </form>
    )
}