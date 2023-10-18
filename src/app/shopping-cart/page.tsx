'use client';

import { 
    Avatar,
    Box, 
    Button, 
    Card, 
    CardActions, 
    CardContent, 
    CardHeader, 
    Grid, 
    Skeleton, 
    Stack, 
    Typography 
} from '@mui/material';
import { 
    Edit as EditIcon,
    AttachMoney as AttachMoneyIcon,
    Menu as MenuIcon
} from '@mui/icons-material';
import { green } from '@mui/material/colors';
import { useEffect, useState } from 'react';

interface GroceryItem {
    id: string;
    name: string;
    category: number;
    stocks: number;
    price: number;
};

interface ShoppingCartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

export default function page() {
    const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);
    const [isLoadingShoppingCartItems, setIsLoadingShoppingCartItems] = useState<boolean>(true);
    const [filteredGroceryItem, setFilteredGroceryItem] = useState<GroceryItem | null>(null);
    const [filteredShoppingCartItem, setFilteredShoppingCartItem] = useState<ShoppingCartItem | null>(null);

    let shoppingCartItems: ShoppingCartItem[] = [];
    
    if (typeof window !== 'undefined') {
        if (localStorage.getItem('tnan_shopping-cart') !== null) {
            shoppingCartItems = JSON.parse(localStorage.getItem('tnan_shopping-cart')!);
        }
    }

    useEffect(() => {
        const loadGroceryItems = async () => {
            try {
                const res = await fetch('/api/grocery-items/-1', {
                    method: 'GET'
                });

                setGroceryItems(JSON.parse(await res.text()));
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoadingShoppingCartItems(false);
            }
        };

        loadGroceryItems()
    }, []);

    return (
        <main className='flex min-h-screen flex-col items-center justify-between p-24'>
            <Box sx={{ width: '100%', maxWidth: 700 }}>
                <Typography variant='h4' align='center'>
                    Your shopping cart
                </Typography>
                <Typography variant='subtitle2' gutterBottom align='center'>
                    Choose the item(s) below:
                </Typography>
            </Box>
            <Grid
                container
                spacing={2}
                sx={{ width: '100%', maxWidth: 700, height: 400, overflow: 'auto', paddingBottom: 2.5 }}
                columns={{ xs: 2, sm: 8, md: 12 }}
            >
                {isLoadingShoppingCartItems ? (
                    <>
                        {[...Array(25).keys()].map((i) => (
                            <Grid
                                key={i}
                                xs={2}
                                sm={4}
                                md={4}
                                item
                                sx={{ paddingBottom: '16px' }}
                            >
                                <Skeleton 
                                    variant='rounded'
                                    width={200}
                                    height={175}
                                    sx={{
                                        animationDelay: `${i * 0.15}s`
                                    }}
                                />
                            </Grid>
                        ))}
                    </>
                ) : (
                    <>
                        {shoppingCartItems.map((shoppingCartItem) => (
                            <Grid
                                key={shoppingCartItem.id}
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
                                        height: 200,
                                        maxHeight: 200,
                                    }}
                                >
                                    
                                    <CardHeader 
                                        avatar={
                                            <Avatar sx={{ backgroundColor: green[500], width: 16, height: 16 }} aria-label={shoppingCartItem.name} src={`/images/products/${shoppingCartItem.name}.png`}>
                                                {shoppingCartItem.name[0]}
                                            </Avatar>
                                        }
                                        title={shoppingCartItem.name}
                                        titleTypographyProps={{
                                            fontSize: '12px'
                                        }}
                                    />
                                    <CardContent>
                                        <Typography fontSize='12px'>Price: ₱{Intl.NumberFormat().format(shoppingCartItem.price)}</Typography>
                                        <Typography fontSize='12px'>Quantity: {shoppingCartItem.quantity}</Typography>
                                        <Typography fontSize='12px'>Total price: ₱{Intl.NumberFormat().format(shoppingCartItem.quantity * shoppingCartItem.price)}</Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            size='small'
                                            color='success'
                                            fullWidth
                                            variant='outlined'
                                            startIcon={<EditIcon fontSize='small' />}
                                            sx={{ mx: '5px' }}
                                        >
                                            Update
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </>
                )}
            </Grid>
            <Stack spacing={2} sx={{ width: '100%', maxWidth: 700 }}>
                <Button href='/categories' variant='contained' color='success' startIcon={<MenuIcon />}>
                    Go back to main menu
                </Button>
                <Button href='/categories' variant='contained' color='success' startIcon={<AttachMoneyIcon />}>
                    Checkout
                </Button>
            </Stack>
        </main>
    )
}