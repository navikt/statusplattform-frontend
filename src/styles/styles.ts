import styled from "styled-components"

export const OpsScheme = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    width: 45rem;
    min-width: 650px;
    flex-direction: cnoneolumn;
    background-color: white;
    padding: 4rem 4rem 3rem;

    border-left: 8px solid transparent;
    border-radius: 0.5rem;

    &.neutral {
        border-color: var(--a-blue-500);
    }

    &.down {
        border-color: var(--a-border-danger);
    }

    &.issue {
        border-color: var(--a-border-warning);
    }

    &.none {
        border-color: var(--a-gray-300);
    }

    .input-area {
        & > * {
            margin: 1rem 0;
        }
    }

    .button-container {
        display: flex;
        flex-direction: row;
        float: right;
        margin: 1rem 0;
        justify-content: right;
    }

    .returnBtn {
        float: left;
        margin: -1.5rem 0 0.6rem -2.6rem;
    }

    @media (min-width: 35rem) {
        .input-area {
            width: 35rem;
        }
    }
`

export const Spacer = styled.div.attrs((props: { height: string }) => props)`
    height: ${(props) => props.height};
`
