import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Alert } from "@navikt/ds-react";
import { UserData } from "../../types/userData";
import { Service } from "../../types/types";
import StatusList from "./statusList";
import ServiceTiles from "./serviceTile";

interface DashboardTemplateProps {
  services: Service[];
  user?: UserData;
}

const DashboardTemplate = ({ services, user }: DashboardTemplateProps) => {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0);
  const services_ids_list = services.map((service: Service) => service.id)
  const maxWidth = calculateMaxWidth(width);
    
  useEffect(() => {
    // Update the width when the window is resized
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  

  return (
    <DashboardContainer>
      <DigitalServicesContainer>
        {services.length > 0 && (
          <PortalServiceTileContainer maxWidth={maxWidth}>
            <ServiceTiles services={services} />
          </PortalServiceTileContainer>
        )}
          </DigitalServicesContainer>
          
      <OpsMessagesLabelContainer>
        <ActivityLabel> Aktivitet </ActivityLabel>
       {user ? ( <AddOpsMessageLabel> <a href={"/sp/ekstern/OpprettMelding"}> Legg til ny driftsmelding </a> </AddOpsMessageLabel>) : <></>}
      </OpsMessagesLabelContainer>
          
      <StatusList service_ids={services_ids_list}/>
    </DashboardContainer>
  );
};

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 70%;
`;

const DigitalServicesContainer = styled.div`
  width: 100%;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PortalServiceTileContainer = styled.div<{ maxWidth: number }>`
  width: 70%;
  flex: 1;
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  max-width: ${(props) => props.maxWidth}px;
`;

const ActivityLabel = styled.div`
  padding: 0;
  font-size: 25px;
`;

const AddOpsMessageLabel = styled.div`
  padding: 0;
  font-size: 15px;
  text-align: end;
`;

const OpsMessagesLabelContainer = styled.div`
  width: 100%;
  padding: 0;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
`;
const calculateMaxWidth = (width: number) => {
  return width > 1275 + 84 ? 1275 + 84 : width > 850 + 52 ? 850 + 52 : 425;
};

export default DashboardTemplate;