import { createContext, useState } from "react";
import { Alert, Snackbar } from "@mui/material";

export const MessageContext = createContext({
    openMessage: false,
    setOpenMessage: () => { },
    severity: 'success',
    setSeverity: () => { },
    message: '',
    setMessage: () => { }
})

export function MessageProvider({ children }) {

    const [openMessage, setOpenMessage] = useState(false)
    const [severity, setSeverity] = useState('success')
    const [message, setMessage] = useState('')

    return (
        <MessageContext.Provider value={{
            openMessage,
            setOpenMessage,
            severity,
            setSeverity,
            message,
            setMessage
        }}>
            {children}
            <Snackbar
                open={openMessage}
                autoHideDuration={3000}
                onClose={() => setOpenMessage(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity={severity} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </MessageContext.Provider>
    )
}