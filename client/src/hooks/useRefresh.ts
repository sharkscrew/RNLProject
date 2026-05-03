import { useCallback, useState } from "react"

export const useRefresh = (iniitialState: boolean) => {
    const [refresh, setRefresh] = useState(iniitialState)

    const handleRefresh = useCallback(() => {
        setRefresh((prev) => !prev)
    }, [])

    return {refresh, handleRefresh}
}