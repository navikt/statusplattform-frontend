import Link from "next/link";
import styled from "styled-components";
import { Dashboard } from "../../types/types";

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); // Two columns layout
  gap: 2rem; // Larger gap between items
  padding: 2rem 4rem; // More padding around the grid
`;

const DashboardCard = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s, box-shadow 0.2s;
  padding: 2rem 2rem; // Increased padding for a larger card
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  font-size: 1.6rem; // Larger font size for readability

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }
`;

const DashboardLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  width: 100%;
`;

const DashboardIcon = styled.div`
  margin-right: 1.5rem;
  font-size: 3rem; // Larger icon size for better visibility
  color: #0070f3;
`;

const DashboardName = styled.h3`
  font-size: 1.6rem; // Larger font size for the title
  margin: 0;
  color: #333;
`;

interface PortalDashboardTileProps {
  dashboards: Dashboard[];
}

export const PortalDashboardTile = ({ dashboards }: PortalDashboardTileProps) => {
  return (
    <>
      <h2 style={{ padding: "1rem" }}>Dashboards for samarbeidspartner:</h2>
      <DashboardGrid>
        {dashboards.map((dashboard) => (
          <DashboardLink href={`/Samarbeidspartner/${dashboard.name}`} key={dashboard.id}>
            <DashboardCard>
              <DashboardIcon>
                {/* Insert an icon here if needed (you can use an <svg> or icon component) */}
                🗂️ {/* Example icon */}
              </DashboardIcon>
              <DashboardName>{dashboard.name}</DashboardName>
            </DashboardCard>
          </DashboardLink>
        ))}
      </DashboardGrid>
    </>
  );
};