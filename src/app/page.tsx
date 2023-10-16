'use client';

import { 
    Box, 
    Button, 
    CircularProgress, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogContentText, 
    DialogTitle, 
    Stack, 
    Typography 
} from '@mui/material';
import { 
    ShoppingCart as ShoppingCartIcon,
    ViewCompact as ViewCompactIcon,
    Publish as PublishIcon
} from '@mui/icons-material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();
    const [open, setOpen] = useState<boolean>(false);
    const [isLoadingItems, setIsLoadingItems] = useState<boolean>(false);

    const handleClose = () => {
        setOpen(false);
    }

    const handleLoadGroceryItems = async () => {
        try {
            setIsLoadingItems(true);

            const res = await fetch('/api/load-grocery-items');

            console.log(res);
        } catch (error) { 
            console.error(error);
        } finally {
            setIsLoadingItems(false);
        }
    };

    return (
        <main className='flex min-h-screen flex-col items-center justify-center p-24'>
            <Box sx={{ width: '100%', maxWidth: 500 }}>
                <Typography variant='h4' align='center'>
                    Tindahan ni Aling Nena
                </Typography>
                <Typography variant='subtitle2' gutterBottom align='center'>
                    Made with 💖 by Marlon & Jericho.
                </Typography>
            </Box>
            <Stack spacing={2} sx={{ width: '100%', maxWidth: 500, mt: 5 }}>
                <Box sx={{ position: 'relative' }}>
                    <Button variant='contained' sx={{ width: '100%', maxWidth: 500 }} disabled={isLoadingItems} startIcon={<PublishIcon />} color='success' onClick={handleLoadGroceryItems}>
                        Load grocery items
                    </Button>
                    {isLoadingItems && (
                        <CircularProgress 
                            size={24}
                            color='success'
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                marginTop: '-12px',
                                marginLeft: '-12px'
                            }}
                        />
                    )}
                </Box>
                <Button variant='contained' disabled={isLoadingItems} startIcon={<ViewCompactIcon />} color='success' href='/categories'>
                    Browse categories
                </Button>
                <Button variant='contained' disabled={isLoadingItems} startIcon={<ShoppingCartIcon />} color='success' onClick={() => {
                    if (localStorage.getItem('tnan_shopping-cart') === null) {
                        setOpen(true);
                    } else {
                        router.push('/shopping-cart');
                    }
                }}>
                    View shopping cart
                </Button>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby='alert-dialog-title'
                    aria-describedby='alert-dialog-description'
                >
                    <DialogTitle id='alert-dialog-title'>
                        {'Tindahan ni Aling Nena'}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id='alert-dialog-description'>
                            Your shopping cart is empty. Please add items first to proceed.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} autoFocus>Ok</Button>
                    </DialogActions>
                </Dialog>
            </Stack>
        </main>
    )
}
