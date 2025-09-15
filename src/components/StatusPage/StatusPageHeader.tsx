import styled from "styled-components"
import { Button, Heading } from "@navikt/ds-react"

interface StatusPageHeaderProps {
    title: string
    description?: string
    onSubscribe?: () => void
}

const StatusPageHeader = ({ title, description, onSubscribe }: StatusPageHeaderProps) => {
    return (
        <HeaderContainer>
            <HeaderContent>
                <TitleContainer>
                    <Title size="xlarge">{title}</Title>
                    {description && <Description>{description}</Description>}
                </TitleContainer>
                {onSubscribe && (
                    <SubscribeButton
                        variant="primary"
                        size="medium"
                        onClick={onSubscribe}
                    >
                        Abonner på oppdateringer
                    </SubscribeButton>
                )}
            </HeaderContent>
        </HeaderContainer>
    )
}

const HeaderContainer = styled.div`
    background: white;
    border-bottom: 1px solid #e6e6e6;
    padding: 2rem 0;
    margin-bottom: 0;
`

const HeaderContent = styled.div`
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    padding: 0 3rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    @media (max-width: 1024px) {
        max-width: 900px;
        padding: 0 2rem;
    }

    @media (max-width: 768px) {
        max-width: 100%;
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
        padding: 0 1rem;
    }
`

const TitleContainer = styled.div`
    flex: 1;
`

const Title = styled(Heading)`
    color: #262626;
    margin: 0 0 0.5rem 0;
    font-weight: 600;
`

const Description = styled.p`
    color: #666;
    margin: 0;
    font-size: 1.1rem;
    line-height: 1.5;
`

const SubscribeButton = styled(Button)`
    background-color: #0067c5;
    border-color: #0067c5;

    &:hover {
        background-color: #005aa3;
        border-color: #005aa3;
    }
`

export default StatusPageHeader