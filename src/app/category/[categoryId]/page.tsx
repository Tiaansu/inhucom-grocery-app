'use client';

import { getCategory } from '@/utils/getCategory';
import { 
    Avatar, 
    Box, 
    Button, 
    Card, 
    CardActions, 
    CardContent, 
    CardHeader, 
    Grid, 
    Typography 
} from '@mui/material';
import { green } from '@mui/material/colors';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AddShoppingCart as AddShoppingCartIcon } from '@mui/icons-material';

interface GroceryItemsProps {
    id: string;
    name: string;
    category: number;
    stocks: number;
    price: number;
}

export default function page({ params }: { params: { categoryId: string }}) {
    const categoryId = parseInt(params.categoryId);
    if (categoryId < 0 || categoryId > 10) {
        return notFound();
    }

    const [isLoadingItems, setIsLoadingItems] = useState(true);
    const [groceryItems, setGroceryItems] = useState<GroceryItemsProps[]>([]);

    // const groceryItems = await getGroceryItems(categoryId);
    useEffect(() => {
        const loadGroceryItems = async () => {
            try {
                const res = await fetch(`/api/grocery-items/${categoryId}`, {
                    method: 'GET'
                });
    
                setGroceryItems(JSON.parse(await res.text()));
            } catch (err) {
                console.log(err);
            } finally {
                setIsLoadingItems(false);
            }
        };

        loadGroceryItems()
    }, [categoryId]);

    return (
        <main className='flex min-h-screen flex-col items-center justify-between p-24'>
            <Box sx={{ width: '100%', maxWidth: 700 }}>
                <Typography variant='h4' align='center'>
                    {getCategory(categoryId)}
                </Typography>
                <Typography variant='subtitle2' gutterBottom align='center'>
                    Choose the item(s) below:
                </Typography>
            </Box>
            {isLoadingItems ? (
                <Typography align='center'>
                    Loading...
                </Typography>
            ) : (
                <Grid
                    container
                    spacing={2}
                    sx={{ width: '100%', maxWidth: 700, height: 400, overflow: 'auto', paddingBottom: 2.5 }}
                    columns={{ xs: 4, sm: 8, md: 12 }}
                >
                    {groceryItems.map((groceryItem) => (
                        <Grid
                            key={groceryItem.id}
                            xs={2}
                            sm={4}
                            md={4}
                            item
                            sx={{
                                paddingBottom: '16px'
                            }}
                        >
                            <Card 
                                sx={{ 
                                    maxWidth: 200, 
                                    height: 175, 
                                    maxHeight: 175
                                }} 
                            >
                                <CardHeader 
                                    avatar={
                                        <Avatar sx={{ bgcolor: green[500], width: 16, height: 16 }} aria-label={groceryItem.name} src={`/images/products/${groceryItem.name}.png`}>
                                            {groceryItem.name[0]}
                                        </Avatar>
                                    }
                                    title={groceryItem.name}
                                    titleTypographyProps={{
                                        fontSize: '12px'
                                    }}
                                />
                                <CardContent>
                                    <Typography fontSize='12px'>Price: ₱{groceryItem.price}</Typography>
                                    <Typography fontSize='12px'>Stocks: {groceryItem.stocks ?? 'out of stock'}</Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size='small' color='success' fullWidth variant='outlined' startIcon={<AddShoppingCartIcon fontSize='small'/>} sx={{ mx: '5px' }}>Add to cart</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
            <Button sx={{ width: '100%', maxWidth: 700 }} href='/categories' variant='contained' color='success'>
                Go back to categories
            </Button>
        </main>
    )
}