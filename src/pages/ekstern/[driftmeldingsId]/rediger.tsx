import { Back } from "@navikt/ds-icons";
import {
    Alert,
    BodyShort,
    Button,
    Select,
    TextField,
} from "@navikt/ds-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { datePrettifyer } from "../../../utils/datePrettifyer";
import styled from "styled-components";
import { backendPath } from "../..";
import { UserStateContext } from "../../../components/ContextProviders/UserStatusContext";
import CustomNavSpinner from "../../../components/CustomNavSpinner";
import Layout from "../../../components/Layout";
import TextEditor from "../../../components/TextEditor";
import { OpsScheme, Spacer } from "../../../styles/styles";
import {
    OpsMessageI,
    SeverityEnum,
    StatusEnum,
} from "../../../types/opsMessage";
import { RouterError, RouterOpsMeldinger } from "../../../types/routes";
import { Service } from "../../../types/types";
import { EndPathServices, EndPathSpecificOps } from "../../../utils/apiHelper";
import {
    fetchSpecificOpsMessage,
    updateSpecificOpsMessage,
} from "../../../utils/opsAPI";
import { checkUserMembershipInTeam } from "src/utils/teamKatalogAPI";

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
    const [updatedStatus, changeUpdatedStatus] = useState<StatusEnum>(serverSideOpsMessage.status);
    const [isMember, setIsMember] = useState<boolean>(false);

    const user = useContext(UserStateContext);


  useEffect(() => {
    const fetchMembership = async () => {
      if (opsMessage.affectedServices.length > 0) {
        const result = await checkUserMembershipInTeam(opsMessage.affectedServices[0].teamId, user.navIdent);
        setIsMember(result);
      }
    };

    fetchMembership();
  }, [opsMessage, user]);
    
    if (!isMember) {
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
                changeUpdatedStatus={changeUpdatedStatus}
                isMember={isMember}
            />
        </OpsScheme>
    );
};

const EditOpsMessage = ({ opsMessage, changeUpdatedStatus, isMember }) => {
    const [updatedOpsMessage, changeUpdatedOpsMessage] = useState<OpsMessageI>(opsMessage);
    const editorRef = useRef(null);
    const router = useRouter();

    const handleUpdateOpsTextArea = (message: string) => {
        changeUpdatedOpsMessage(prevState => ({
            ...prevState,
            externalMessage: message,
            internalMessage: message
        }));
    };

    const handleSubmitChangesOpsMessage = async () => {
        try {
            await updateSpecificOpsMessage(updatedOpsMessage);
            toast.success("Endringer lagret");
            router.push('/Samarbeidspartner');
        } catch (error) {
            console.log(error);
            toast.error("Noe gikk galt ved oppdatering av meldingen");
        }
    };

    const changeUpdatedSeverity = (severity: SeverityEnum) => {
        changeUpdatedOpsMessage(prevState => ({
            ...prevState,
            severity: severity
        }));
    }

    return (
        <div>
            
            <div>
                <TextField
                    label="Tittel:"
                    value={updatedOpsMessage.externalHeader}
                    onChange={(e) =>
                        changeUpdatedOpsMessage(prevState => ({
                            ...prevState,
                            externalHeader: e.target.value,
                            internalHeader: e.target.value,
                        }))
                    }
                />
            </div>
            <div>
                <Select
                    label="Velg alvorlighetsgrad"
                    value={updatedOpsMessage.severity}
                    onChange={(e) => changeUpdatedSeverity(e.target.value as SeverityEnum)}
                >
                    <option value={SeverityEnum.NEUTRAL}>Nøytral - Blå</option>
                    <option value={SeverityEnum.ISSUE}>Middels - Gul</option>
                    <option value={SeverityEnum.DOWN}>Høy - Rød</option>
                </Select>
            </div>
            <Spacer height="1.9rem"/>
            <div>
                <TextEditor
                    ref={editorRef}
                    editing={true}
                    initialValue={updatedOpsMessage.externalMessage}
                    title="Tekst:"
                    handleUpdateMsg={handleUpdateOpsTextArea}
                    isInternal={false}
                />
            </div>
            <ButtonContainer>
                <Button variant="secondary" onClick={() => router.back()}>Avbryt</Button>
                <Button variant="primary" onClick={handleSubmitChangesOpsMessage} disabled={isMember}>Lagre endringer</Button>
            </ButtonContainer>
        </div>
    );
};

export default opsMessageDetails;
