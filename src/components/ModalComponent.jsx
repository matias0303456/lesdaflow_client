import { useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 3,
    borderRadius: 1
};

export function ModalComponent({ children, open, onClose, dynamicContent = false }) {

    const [screenWidth, setScreenWidth] = useState(window.innerWidth < 700 ? window.innerWidth : window.innerWidth - 300)
    const [screenHeight] = useState(dynamicContent ?
        { height: window.innerHeight - 100, overflowY: 'scroll' } :
        { height: 'auto', maxHeight: window.innerHeight - 50, overflowY: 'scroll' })

    window.onresize = () => {
        if (window.innerWidth < 700) {
            setScreenWidth(window.innerWidth)
        } else {
            setScreenWidth(window.innerWidth - 300)
        }
    }

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={onClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
            <Fade in={open}>
                <Box sx={{ ...style, ...screenHeight, width: screenWidth }}>
                    {children}
                </Box>
            </Fade>
        </Modal>
    );
}