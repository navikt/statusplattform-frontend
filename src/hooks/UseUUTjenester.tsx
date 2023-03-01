import { useEffect, useState } from "react"

const UseUUTjenster = () => {
    const [UUTjenester, setUUtjenester] = useState<any[]>([])

    useEffect(() => {}, [])
}

export default UseUUTjenster

/*

export async function getServerSideProps(context) {
    console.log("Context inside getserverSideProps: " + context)
    const [resUUTjenester, resUUKrav] = await Promise.all([
        fetch(backendPath + EndPathUUTjeneste()),
        fetch(backendPath + EndPathUUKrav()),
    ])
    const [UUDataTjenester, UUDataKrav] = await Promise.all([
        resUUTjenester.json(),
        resUUKrav.json(),
    ])
    return { props: { UUDataTjenester, UUDataKrav } }
} */
