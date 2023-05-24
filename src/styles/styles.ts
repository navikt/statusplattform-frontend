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
        gap: 0.2rem;
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

export const CustomPopoverContent = styled.div`
    display: flex;
    flex-direction: column;

    color: var(--a-gray-800);

    .internalLinks {
        color: var(--a-blue-800);
        text-decoration: none;
        margin: 2.5rem 0 0 2rem;

        :hover {
            text-decoration: underline;
            cursor: pointer;
        }

        .subMenuIcon {
            width: 1.5rem;
            height: 1.5rem;
            margin: 0 0 0 -2rem;
            position: absolute;
        }

        .adminIcon {
            width: 1.3rem;
            height: 1.3rem;
            margin: 0 0 0 -2rem;
            position: absolute;
        }

        .logOutIcon {
            width: 1.2rem;
            height: 1.2rem;
            margin: 0 0 0 -2rem;
            position: absolute;
        }
    }
    .SubMenuHead {
        text-align: center;
        text-decoration: none;

        :hover {
            text-decoration: none;
        }
    }
`
