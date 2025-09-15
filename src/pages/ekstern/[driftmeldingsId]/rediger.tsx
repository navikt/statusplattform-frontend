import {
    Alert,
    Button,
    Select,
    Switch,
    TextField,
} from "@navikt/ds-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { backendPath } from "../..";
import { UserStateContext } from "../../../components/ContextProviders/UserStatusContext";
import Layout from "../../../components/Layout";
import TextEditor from "../../../components/TextEditor";
import { OpsScheme, Spacer } from "../../../styles/styles";
import {
    OpsMessageI,
    SeverityEnum,
    StatusEnum,
} from "../../../types/opsMessage";
import {  EndPathSpecificOps } from "../../../utils/apiHelper";
import {
    updateSpecificOpsMessage,
} from "../../../utils/opsAPI";
import { checkUserMembershipInTeam } from "../../../utils/teamKatalogAPI";


const OpsMessageContainer = styled.div`
    display: flex;
    width: 100%;
`;
const SubHeader = styled.h3`
    color: var(--a-gray-600);
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
`;

export const getServerSideProps = async (context) => {
    const { driftmeldingsId } = context.query;

    const [resOpsMsg] = await Promise.all([
        fetch(backendPath + EndPathSpecificOps(driftmeldingsId))
    ]);

    const opsMessage: OpsMessageI = await resOpsMsg.json();

    return {
        props: {
            opsMessage,
        },
    };
};

const opsMessageDetails = ({
    opsMessage
}: {
    opsMessage: OpsMessageI;
}) => {
    return (
        <Layout>
            <OpsMessageContainer>
                <Head>
                    <title>
                        Rediger driftsmelding - {opsMessage.externalHeader} - status.nav.no
                    </title>
                </Head>
                <OpsMessageComponent opsMessage={opsMessage} />
            </OpsMessageContainer>
        </Layout>
    );
};

const OpsMessageComponent = ({ opsMessage: serverSideOpsMessage }) => {
    const [opsMessage, changeOpsMessage] = useState<OpsMessageI>(serverSideOpsMessage);
    const [isMember, setIsMember] = useState<boolean>();

    const user = useContext(UserStateContext);


  useEffect(() => {
    const fetchMembership = async () => {
      if (opsMessage.affectedServices.length > 0 && opsMessage.affectedServices[0].teamId) {
        try {
          const result = await checkUserMembershipInTeam(opsMessage.affectedServices[0].teamId, user.navIdent);
          setIsMember(result);
        } catch (error) {
          console.error('Error checking team membership:', error);
          setIsMember(false);
        }
      } else {
        // No team associated or teamId is null - deny editing
        setIsMember(false);
        toast.error("Du har ikke tilgang til å redigere denne driftsmeldingen - ingen team tilknyttet");
      }
    };

    fetchMembership();
  }, [opsMessage, user]);
    
    if (isMember === false) {
        toast.error("Du har ikke tilgang til å redigere denne driftsmeldingen");
    }

    if (!user) {
        return <Alert variant="error">Brukerinformasjon mangler</Alert>;
    }

    return (
        <OpsScheme>
            <div className="header-container">
                <SubHeader>Rediger driftsmelding:</SubHeader>
                <Spacer height="0.8rem" />
            </div>

            <EditOpsMessage
                opsMessage={opsMessage}
                isMember={isMember}
            />
        </OpsScheme>
    );
};

const EditOpsMessage = ({ opsMessage, isMember }) => {
    const [updatedOpsMessage, changeUpdatedOpsMessage] = useState<OpsMessageI>(opsMessage);
    const router = useRouter();

    const handleSubmitChangesOpsMessage = async () => {
        if (checkLength(updatedOpsMessage.externalMessage)) {
            toast.error("Meldingen er for lang");
            return;
        }
        try {
            await updateSpecificOpsMessage(updatedOpsMessage);
            toast.success("Endringer lagret");
            router.push('/Samarbeidspartner');
        } catch (error) {
            console.log(error);
            toast.error("Noe gikk galt ved oppdatering av meldingen");
        }
    };

    const checkLength = (str: string) => {
        return str.length >= 5500;
    }

    const handleToggleActive = () => {
        changeUpdatedOpsMessage(prevState => ({
            ...prevState,
            isActive: !prevState.isActive
        }));
    };

    const changeUpdatedSeverity = (severity: SeverityEnum) => {
        changeUpdatedOpsMessage(prevState => ({
            ...prevState,
            severity: severity
        }));
    };

    const handleUpdateOpsTextArea = (message: string) => {
        changeUpdatedOpsMessage(prevState => ({
            ...prevState,
            externalMessage: message,
            internalMessage: message
        }));
    };

    return (
        <div>
            <TextField
                label="Tittel:"
                value={updatedOpsMessage.externalHeader}
                disabled={!isMember}
                onChange={(e) =>
                    changeUpdatedOpsMessage(prevState => ({
                        ...prevState,
                        externalHeader: e.target.value,
                        internalHeader: e.target.value,
                    }))
                }
            />
            <Select
                label="Velg alvorlighetsgrad"
                value={updatedOpsMessage.severity}
                disabled={!isMember}
                onChange={(e) => changeUpdatedSeverity(e.target.value as SeverityEnum)}
            >
                <option value={SeverityEnum.NEUTRAL}>Nøytral - Blå</option>
                <option value={SeverityEnum.ISSUE}>Middels - Gul</option>
                <option value={SeverityEnum.DOWN}>Høy - Rød</option>
            </Select>

            <Spacer height="1.9rem"/>

            <TextEditor
                editing={true}
                initialValue={updatedOpsMessage.externalMessage}
                title="Tekst:"
                handleUpdateMsg={handleUpdateOpsTextArea}
                isInternal={false}
            />

            <Spacer height="1.9rem"/>

            <Switch
                checked={updatedOpsMessage.isActive}
                onChange={handleToggleActive}
                disabled={!isMember}
            >
                {updatedOpsMessage.isActive ? "Aktiv" : "Inaktiv"}
            </Switch>

            <ButtonContainer>
                <Button variant="secondary" onClick={() => router.back()}>Avbryt</Button>
                <Button variant="primary" onClick={handleSubmitChangesOpsMessage} disabled={!isMember}>Lagre endringer</Button>
            </ButtonContainer>
        </div>
    );
};



export default opsMessageDetails;
