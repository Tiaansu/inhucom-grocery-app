'use client';

import { getCategory } from '@/utils/getCategory';
import { Box, Button, Grid, Typography } from '@mui/material'

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
                sx={{ width: '100%', maxWidth: 500, height: 400, overflow: 'auto' }} 
                columns={{ xs: 4, sm: 8, md: 12 }}
            >
                {[...Array(10).keys()].map((i) => (
                    <Grid 
                        xs={2} 
                        sm={4} 
                        md={4} 
                        key={i} 
                        item
                        sx={(theme) => ({
                            backgroundColor: '#1A2027',
                            cursor: 'pointer',
                            ":hover": {
                                backgroundColor: '#27303b'
                            }
                        })}
                        component={'a'}
                        href={`/category/${i}`}
                    >
                        <Box sx={{ width: '125px', height: '125px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography marginTop={'-15%'}>
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