import styled from "styled-components";
import { Heading } from "@navikt/ds-react";
import { BookmarkFillIcon } from "@navikt/aksel-icons";
import { Service } from "../../types/types";

interface ServiceTilesProps {
  services: Service[];
}

const ServiceTiles = ({ services }: ServiceTilesProps) => {
  const isSingleService = services.length === 1;

  return (
    <BoxContainer isSingle={isSingleService}>
      {services.map((service, index) => (
        <Box key={index}>
          <BoxIcon>
            <BookmarkFillIcon />
          </BoxIcon>
          <BoxContent>
            {service.name}
          </BoxContent>
        </Box>
      ))}
    </BoxContainer>
  );
};

// Styled component for the container
const BoxContainer = styled.div<{ isSingle: boolean }>`
  display: grid;
  grid-template-columns: ${({ isSingle }) => (isSingle ? "1fr" : "repeat(2, 1fr)")};
  gap: 1rem;
  padding: 1rem;
  min-width: ${({ isSingle }) => (isSingle ? "350px" : "1000px")};
  max-width: ${({ isSingle }) => (isSingle ? "600px" : "1200px")};
  align-self: center;
  justify-content: ${({ isSingle }) => (isSingle ? "center" : "initial")};
  heigth: 2000px;
`;

const Box = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%);
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  border: 1px solid #e0e0e0;
  height: 80px;
  width: 110%;
  

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }

`;

const BoxIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  svg {
    width: 1.5rem;
    height: 1.5rem;
    color: #3e3e3e;
  }
`;

const BoxContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-left: 20px;
  font-size: 25px
`;

export default ServiceTiles;