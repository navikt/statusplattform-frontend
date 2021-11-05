import { createContext, ReactNode, useState } from "react"

interface FilterContextInterface {
    filters: FilterOption[]
    matches: (status: string) => boolean 
    changeFilters: (filters: FilterOption[]) => void
}

export enum FilterOption {
    OK = "Ok",
    ISSUE = "Redusert funksjonalitet",
    DOWN = "Feil"
}


export const FilterContext = createContext<FilterContextInterface>({
    filters: [],
    matches: () => true,
    changeFilters: () => {}
})

const backendStatusToFilterOption = (statusFromBackend: string): FilterOption => {
    switch(statusFromBackend){
        case "OK": return FilterOption.OK;
        case "ISSUE": return FilterOption.ISSUE;
        case "DOWN": return FilterOption.DOWN;
        default: throw new Error("Fikk ukjent statuskode fra server")
    }
}


export const FilterProvider: React.FC<{children: ReactNode}> = ({children}) => {
    const [filters, changeFilters] = useState<FilterOption[]>([])

    const matches = (statusFromBackend: string): boolean => 
        filters.includes(backendStatusToFilterOption(statusFromBackend));

    return (
        <FilterContext.Provider value={{
            filters,
            matches,
            changeFilters
        }}>
            {children}
        </FilterContext.Provider>
    )
}