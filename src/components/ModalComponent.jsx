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

export function ModalComponent({ children, open, onClose }) {

    const [screenSize, setScreenSize] = useState(window.innerWidth < 600 ? window.innerWidth : window.innerWidth - 200)

    window.onresize = () => {
        if (window.innerWidth < 600) {
            setScreenSize(window.innerWidth)
        } else {
            setScreenSize(window.innerWidth - 200)
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
                <Box sx={{ ...style, width: screenSize }}>
                    {children}
                </Box>
            </Fade>
        </Modal>
    );
}