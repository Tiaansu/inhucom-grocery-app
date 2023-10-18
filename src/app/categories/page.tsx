'use client';

import { getCategory } from '@/utils/getCategory';
import { Box, Button, Grid, Typography } from '@mui/material';
import { green } from '@mui/material/colors';

export default function page() {
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
            <Button sx={{ width: '100%', maxWidth: 500 }} href='/' variant='contained' color='success'>
                Go back to main menu
            </Button>
        </main>
    )
}