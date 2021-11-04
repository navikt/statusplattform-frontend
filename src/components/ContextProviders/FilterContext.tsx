import { createContext, ReactNode, useState } from "react"

interface FilterContextInterface {
    filters: FilterOption[]
    changeFilters: (filters: FilterOption[]) => void
}

export enum FilterOption {
    OK = "Ok",
    REDUSERT = "Redusert funksjonalitet",
    DOWN = "Feil"
}

export const FilterContext = createContext<FilterContextInterface>({
    filters: [],
    changeFilters: () => {}
})

export const FilterProvider: React.FC<{children: ReactNode}> = ({children}) => {
    const [filters, changeFilters] = useState<FilterOption[]>([])
    return (
        <FilterContext.Provider value={{
            filters: filters,
            changeFilters: changeFilters
        }}>
            {children}
        </FilterContext.Provider>
    )
}