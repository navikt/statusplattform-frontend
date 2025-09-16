import styled from "styled-components"
import { XMarkIcon } from "@navikt/aksel-icons"

export const AdminCategoryContainer = styled.div`
    .category-overflow-container {
        overflow-x: auto;

        div {
            min-width: max-content;
        }
    }

    .centered {
        display: flex;
        justify-content: center;

        margin: 1rem 0 1rem 0;
    }
`

export const NoContentContainer = styled.div`
    height: 100px;

    display: flex;
    justify-content: center;
    align-items: center;
`

export const ModalInner = styled.div`
    padding: 2rem 4.5rem;
    display: flex;
    flex-direction: column;

    button {
        margin: 1rem;
    }
`

export const DependenciesColumn = styled.div`
    margin-right: 5ch;
    max-width: 242px;

    display: flex;
    flex-direction: column;

    .add-element {
        margin: 1rem 0;
    }

    ul {
        max-width: 100%;
        word-break: break-word;

        li {
            border: 1px solid transparent;
            border-radius: 5px;
        }

        li:hover {
            border: 1px solid black;
        }
    }

    label {
        position: absolute;
        z-index: -1000;
    }
`

export const DependencyList = styled.ul`
    list-style: none;
    padding: 0;

    li {
        width: 100%;

        display: flex;
        justify-content: space-between;
        align-items: center;
        height: fit-content;
    }
`

export const HorizontalSeparator = styled.span`
    display: block;

    padding: 1px 0;
    margin: 16px 0;

    background-color: var(--a-gray-200);
`

export const DynamicListContainer = styled.div`
    display: flex;
    gap: 16px;

    max-width: 100%;

    .column {
        flex: 1 1 0;

        padding: 1rem 0;

        button {
            min-width: fit-content;
        }

        .select-wrapper {
            display: flex;
        }
    }

    .new-list {
        list-style: none;
        padding: 0;

        section {
            display: inline-block;
        }

        .colored {
            color: var(--a-blue-500);
            text-decoration: underline;
            background-color: none;
            border: none;

            label {
                position: absolute;
                z-index: -1000;
            }

            :hover {
                text-decoration: none;
                cursor: pointer;
            }
        }

        li {
            p {
                margin: 8px 0;

                display: flex;
                justify-content: space-between;
                word-break: break-word;
            }
        }
    }

    @media (min-width: 600px) {
        .column {
            min-width: 300px;
        }
    }
`

export const ButtonContainer = styled.div`
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;

    margin-top: 2rem;
`

export const CloseCustomized = styled(XMarkIcon)`
    color: red;
    :hover {
        color: grey;
        border: 1px solid;
        cursor: pointer;
    }
`