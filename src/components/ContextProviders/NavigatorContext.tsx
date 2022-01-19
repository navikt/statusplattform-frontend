import { NextRouter, useRouter } from "next/router";
import { createContext, ReactNode, useEffect, useState } from "react"

interface NavigatorContextInterface {
    navigatorRoutes: NavigatorElement[]
    changeRoutes: (newRoutes: NavigatorElement[]) => void
}


export const NavigatorContext = createContext<NavigatorContextInterface>({
    navigatorRoutes: [],
    changeRoutes: () => {}
})


export interface NavigatorElement {
    stringifiedPathName: string
    path: string
    home?: boolean
    lastElement?: boolean
}


export const NavigatorProvider: React.FC<{children: ReactNode}> = ({children}) => {
    const [navigatorRoutes, changeRoutes] = useState<NavigatorElement[]>([])

    const router = useRouter()

    useEffect(() => {
        (async () => {
            changeRoutes(convertRouteToNavigatorElementList())
        })()
    }, [router])

    // const matches = (statusFromBackend: string): boolean => 
    //     navigatorRoutes.includes(backendStatusToFilterOption(statusFromBackend));


    const convertRouteToNavigatorElementList = (): NavigatorElement[] => {
        const routerAsPath = router.asPath

        let splitList: string[] = routerAsPath.split("/")

        const convertedRoute: NavigatorElement[] = []

        // Dette må trimmes bort også: ?tab=
        splitList.map((element, index) => {
            const convertedElement: NavigatorElement = {
                    stringifiedPathName: decodeURIComponent(element).replace(/([A-Z])/g, ' $1').trim(),
                    path: "",
                    home: false,
                    lastElement: false
            }

            convertedElement.stringifiedPathName = convertedElement.stringifiedPathName.replace(/[^a-zæøåA-ZÆØÅ0-9 ?= ]/g, '')

            // console.log(convertedElement.stringifiedPathName.replace('/#\w+\s*/', ' $1'))

            // Mulig løsning: [?]tab[=]
            // convertedElement.stringifiedPathName = element.replace(/[?]tab[=]/g, "/")
            
            // convertedElement.stringifiedPathName.replace(/^?tab=+/i, '')

            const formattedElement = handleCreateFormattedElement(element, index, convertedElement, splitList, convertedRoute)

            convertedRoute.push(formattedElement)
        })

        return convertedRoute
    }


    const handleCreateFormattedElement = (
                element: string, index: number, convertedElement: NavigatorElement, splitList: string[], convertedRoute: NavigatorElement[]
            ): NavigatorElement => {


        switch (index) {

            case 0:
                convertedElement.path = "/"
                convertedElement.stringifiedPathName = "Status Digitale Tjenester"
                convertedElement.home = true
                break

            case ((index == splitList.length-1) && (index = 1)):
                convertedElement.path = convertedRoute[index-1].path + element
                convertedElement.lastElement = true
                break
            case 1:

                convertedElement.path = convertedRoute[0].path + element
                break

            case (index = splitList.length-1):
                convertedElement.path = convertedRoute[index-1].path + "/" + element
                convertedElement.lastElement = true
                break

            default:
                convertedElement.path = convertedRoute[index-1].path + "/" + element
                break;
        }

        return convertedElement
    }

    return (
        <NavigatorContext.Provider value={{
            navigatorRoutes: navigatorRoutes,
            changeRoutes: changeRoutes
        }}>
            {children}
        </NavigatorContext.Provider>
    )
}