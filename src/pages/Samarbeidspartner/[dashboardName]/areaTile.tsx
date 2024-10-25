import styled from "styled-components";
import { BodyShort, Heading } from "@navikt/ds-react";
import { CheckmarkCircleIcon, BookmarkFillIcon } from '@navikt/aksel-icons';
import { Area } from "../../../types/types";

// Styled component for the container
const BoxContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Alltid 2 kolonner */
  gap: 1.5rem;
  padding: 2rem;
  background-color: #f5f5f1;
  min-width: 1500px;
  min-height: 30vh;
  max-width: max-content;
  align-self: center;
`;

const Box = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  border: 1px solid #e0e0e0;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);
  }
`;

const BoxIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  svg {
    width: 2rem;
    height: 2rem;
    color: #3e3e3e;
  }
`;

const BoxContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
`;

const BoxStatus = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    color: #007b5e;
    width: 1.5rem;
    height: 1.5rem;
  }
`;

interface AreaTilesProps {
  areas: Area[];
}

const AreaTiles = ({ areas }: AreaTilesProps) => {
  return (
      <BoxContainer>

      {areas.map((area, index) => (
        <Box key={index}>
          <BoxIcon>
            {/* Her kan du bytte ut ikonet med et områdeikon */}
            <BookmarkFillIcon />
              </BoxIcon>
          <BoxContent>
            <Heading level="3" size="small">
              {area.name}
            </Heading>
            <BodyShort size="small">Ekstra informasjon hvis nødvendig</BodyShort>
          </BoxContent>
          <BoxStatus>
            {/* Eksempelstatusikon */}
            <CheckmarkCircleIcon />
          </BoxStatus>
        </Box>
      ))}
    </BoxContainer>
  );
};

export default AreaTiles;