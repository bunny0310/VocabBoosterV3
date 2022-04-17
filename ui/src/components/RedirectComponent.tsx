import React from "react"
import { useHistory } from "react-router"
import { _messageBus } from "../App"
import { Messages } from "../services/MessageBus"

export const RedirectComponent = (props: any) => {
    const history = useHistory()
    React.useEffect(() => {
        _messageBus.on(Messages.Redirect, (redirectPath: string) => {
            console.log('redirecting')
            history.replace(redirectPath)
        })
        return () => {
            _messageBus.remove(Messages.Redirect, () => {})
        }
    }, [history])

    return <></>
}