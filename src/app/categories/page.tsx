'use client';

import { getCategory } from '@/utils/getCategory';
import { 
    Box, 
    Button, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogContentText, 
    DialogTitle, 
    Grid, 
    Stack, 
    Typography 
} from '@mui/material';
import { ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import { green } from '@mui/material/colors';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Page() {
    const [openCheckoutNoticeDialog, setOpenCheckoutNoticeDialog] = useState<boolean>(false);
    
    const router = useRouter();

    const handleNoticeCheckoutClose = () => {
        setOpenCheckoutNoticeDialog(false);
    };

    return (
        <main className='flex min-h-screen flex-col items-center justify-between p-24'>
            <Box sx={{ width: '100%', maxWidth: 500 }}>
                <Typography variant='h4' align='center'>
                    Categories
                </Typography>
                <Typography variant='subtitle2' gutterBottom align='center'>
                    Choose the category below
                </Typography>
            </Box>
            <Grid 
                container 
                spacing={2} 
                sx={{ width: '100%', maxWidth: 500, height: 400, overflow: 'auto', paddingBottom: 2.5 }} 
                columns={{ xs: 2, sm: 8, md: 12 }}
            >
                {[...Array(10).keys()].map((i) => (
                    <Grid 
                        xs={2} 
                        sm={4} 
                        md={4} 
                        key={i} 
                        item
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Box 
                            sx={{ 
                                width: 150, 
                                maxWidth: 150, 
                                height: 150, 
                                maxHeight: 150, 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                backgroundColor: green[500],
                                cursor: 'pointer',
                                ':hover': {
                                    backgroundColor: green[600]
                                } 
                            }}
                            component={'a'}
                            href={`/category/${i}`}
                        >
                            <Typography color='black'>
                                {getCategory(i)}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
            <Stack spacing={2} sx={{ width: '100%', maxWidth: 500 }}>
                <Button href='/' variant='contained' color='success'>
                    Go back to main menu
                </Button>
                <Button variant='contained' startIcon={<ShoppingCartIcon />} color='success' onClick={() => {
                    if (localStorage.getItem('tnan_shopping-cart') === null) {
                        setOpenCheckoutNoticeDialog(true);
                    } else {
                        router.push('/shopping-cart');
                    }
                }}>
                    View shopping cart
                </Button>
                <Dialog
                    open={openCheckoutNoticeDialog}
                    onClose={handleNoticeCheckoutClose}
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
                        <Button onClick={handleNoticeCheckoutClose} autoFocus color='success'>Ok</Button>
                    </DialogActions>
                </Dialog>
            </Stack>
        </main>
    )
}