import { NOMPersonPhone } from "../../types/types"
import { Alert, Button, TextField } from "@navikt/ds-react"
import { ChangeEvent, useState } from "react"
import styled from "styled-components"
import Layout from "../../components/Layout"
import { checkLoginInfoAndState } from "src/utils/checkLoginInfoAndState"
import { GetServerSideProps } from "next"

export const NumberChangerContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1em;
`

export const ChangeNumberBtn = styled.div`
    width: 10em;
`

export const PhoneWarning = styled.div`
    width: 30em;
`

type Props = {
    data: NOMPersonPhone
}

export const getServerSideProps: GetServerSideProps<Props> = async (
    context
) => {
    const userInfo = await checkLoginInfoAndState()
    const shoutOutUrl = `${process.env.SHOUT_OUT_URL}`

    try {
        const res = await fetch(
            `${shoutOutUrl}/api/v1/number/${userInfo.navIdent}`
        )
        if (!res.ok) {
            throw new Error(`Failed to fetch data, status: ${res.status}`)
        }
        const data: NOMPersonPhone = await res.json()

        return {
            props: {
                data,
            },
        }
    } catch (err) {
        console.error(err)
        // TODO Handle errors, possibly redirect or return default props
        return {
            props: {
                data: null, // TODO Handle null in your component or use a default value
            },
        }
    }
}

const Profile: React.FC<Props> = ({ data }) => {
    const [newNumber, setNewNumber] = useState("")
    const [displayedNumber] = useState(data.phoneNumber)
    const [status, setStatus] = useState<"success" | "error" | undefined>()
    const [statusMessage, setStatusMessage] = useState<string | undefined>()

    const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
        setNewNumber(e.target.value)

    const displayNumber = () => (
        <div>
            Ditt prefererte varslingsnummer er{" "}
            <strong>{displayedNumber.substring(3)}</strong>
        </div>
    )

    const saveNumber = async () => {
        if (newNumber.length !== 8) {
            setStatus("error")
            setStatusMessage("Telefonnummer må være 8 tall.")
            return
        }

        const updatedPersonPhone: NOMPersonPhone = {
            navident: data.navident,
            phoneNumber: "+47" + newNumber,
        }

        try {
            const res = await fetch("/api/v1/number", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(updatedPersonPhone),
            })

            if (!res.ok) throw new Error("Network response was not ok.")

            setStatus("success")
            setStatusMessage(`Telefonnummer ${newNumber} er lagret`)
        } catch (e) {
            console.error("Saving new number to DB failed: ", e)
            setStatus("error")
            setStatusMessage("Feil ved lagring av nummer.")
        } finally {
            setNewNumber("")
        }
    }

    return (
        <Layout>
            <h1>Hei {data.navident}</h1>
            <NumberChangerContainer>
                <PhoneWarning>
                    {status && <Alert variant={status}>{statusMessage}</Alert>}
                </PhoneWarning>
                {displayNumber()}
                <TextField
                    name="phoneNumber"
                    label="Nytt nummer"
                    type="tel"
                    value={newNumber}
                    autoComplete="off"
                    inputMode="numeric"
                    style={{ width: "10rem" }}
                    onChange={handleChange}
                />
                <Button
                    className="navds-button--secondary-neutral change-number-btn"
                    onClick={saveNumber}
                    as={ChangeNumberBtn}
                >
                    Endre nummer
                </Button>
            </NumberChangerContainer>
        </Layout>
    )
}

export default Profile
