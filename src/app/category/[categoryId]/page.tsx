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
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogContentText, 
    DialogTitle, 
    Grid, 
    Skeleton, 
    Stack, 
    TextField, 
    Typography 
} from '@mui/material';
import { green } from '@mui/material/colors';
import { notFound, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
    AddShoppingCart as AddShoppingCartIcon,
    ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';

interface GroceryItem {
    id: string;
    name: string;
    category: number;
    stocks: number;
    price: number;
};

interface ShoppingCartItem {
    id: number;
    dbId: string;
    name: string;
    price: number;
    quantity: number;
}

export default function Page({ params }: { params: { categoryId: string }}) {
    const [isLoadingItems, setIsLoadingItems] = useState<boolean>(true);
    const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);
    const [openAddToCart, setOpenAddToCart] = useState<boolean>(false);
    const [enteredQuantity, setEnteredQuantity] = useState<number>(0);
    const [selectedItem, setSelectedItem] = useState<string>('');
    const [filteredItem, setFilteredItem] = useState<GroceryItem | null>(null);
    const [openCheckoutNoticeDialog, setOpenCheckoutNoticeDialog] = useState<boolean>(false);

    let shoppingCartItems: ShoppingCartItem[] = [];

    if (typeof window !== 'undefined') {
        if (localStorage.getItem('tnan_shopping-cart') !== null) {
            shoppingCartItems = JSON.parse(localStorage.getItem('tnan_shopping-cart')!);
        }
    }

    const categoryId = parseInt(params.categoryId);

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

    const router = useRouter();

    if (categoryId < 0 || categoryId > 10) {
        return notFound();
    }

    const handleOpen = (item: GroceryItem) => {
        setFilteredItem(item);

        setOpenAddToCart(true);
    };

    const handleClose = () => {
        setOpenAddToCart(false);
        resetStates();
    };

    const handleNoticeCheckoutClose = () => {
        setOpenCheckoutNoticeDialog(false);
    };

    const resetStates = () => {
        setOpenAddToCart(false);

        setSelectedItem('');
        setEnteredQuantity(0);
    };

    const isGroceryItemInTheShoppingCart: boolean = shoppingCartItems.findIndex((item) => item.name === selectedItem) !== -1;

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
            <Grid
                container
                spacing={2}
                sx={{ width: '100%', maxWidth: 700, height: 400, overflow: 'auto', paddingBottom: 2.5 }}
                columns={{ xs: 2, sm: 8, md: 12 }}
            >
                {isLoadingItems ? (
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
                                            <Avatar sx={{ backgroundColor: green[500], width: 16, height: 16 }} aria-label={groceryItem.name} src={`/images/products/${groceryItem.name}.png`}>
                                                {groceryItem.name[0]}
                                            </Avatar>
                                        }
                                        title={groceryItem.name}
                                        titleTypographyProps={{
                                            fontSize: '12px'
                                        }}
                                    />
                                    <CardContent>
                                        <Typography fontSize='12px'>Price: ₱{Intl.NumberFormat().format(groceryItem.price)}</Typography>
                                        <Typography fontSize='12px'>Stocks: {groceryItem.stocks ?? 'out of stock'}</Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button 
                                            size='small' 
                                            color='success' 
                                            fullWidth 
                                            variant='outlined' 
                                            startIcon={<AddShoppingCartIcon fontSize='small' />} 
                                            sx={{ mx: '5px' }}
                                            onClick={() => {
                                                setSelectedItem(groceryItem.name);
                                                handleOpen(groceryItem);
                                            }}
                                        >
                                            Add to cart
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                        {filteredItem && (
                            <Dialog open={openAddToCart} onClose={handleClose}>
                                <DialogTitle>{isGroceryItemInTheShoppingCart ? `Update item ${filteredItem.name}`: `Add ${filteredItem.name} to cart`}</DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        Please enter the {isGroceryItemInTheShoppingCart ? 'new' : null} quantity below: (Make sure it&apos;s lower than {filteredItem.stocks})
                                    </DialogContentText>
                                    <TextField 
                                        autoFocus
                                        id='quantity'
                                        label='Quantity'
                                        type='number'
                                        fullWidth
                                        variant='standard'
                                        color='success'
                                        sx={{
                                            marginTop: 1
                                        }}
                                        value={enteredQuantity < 0 ? 0 : (enteredQuantity > filteredItem.stocks ? filteredItem.stocks : enteredQuantity)}
                                        onChange={(e) => setEnteredQuantity(parseInt(e.target.value))}
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button 
                                        onClick={() => {
                                            const wantToContinue = confirm(`Want to add ${filteredItem.name} with ${enteredQuantity} quantity to your shopping cart? It will add ₱${Intl.NumberFormat().format(filteredItem.price * enteredQuantity)} to your shopping cart's total price.`);

                                            if (wantToContinue) {
                                                if (isGroceryItemInTheShoppingCart) {
                                                    const newShoppingCartItems = [...shoppingCartItems];
                                                    const updatedIndex = newShoppingCartItems.findIndex((item) => item.name === filteredItem.name);
                                                    newShoppingCartItems[updatedIndex].quantity = enteredQuantity;
                                                    shoppingCartItems = newShoppingCartItems;
                                                } else {
                                                    const newShoppingCartItem = {
                                                        id: shoppingCartItems.length,
                                                        dbId: filteredItem.id,
                                                        name: filteredItem.name,
                                                        price: filteredItem.price,
                                                        quantity: enteredQuantity,
                                                    };
                                                    shoppingCartItems.push(newShoppingCartItem);
                                                }
                                                
                                                localStorage.setItem('tnan_shopping-cart', JSON.stringify(shoppingCartItems));
                                                resetStates();
                                            }
                                        }}
                                        color='success'
                                        disabled={enteredQuantity <= 0 || enteredQuantity > filteredItem.stocks}
                                    >
                                        Add to cart
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        )}
                    </>
                    
                )}
            </Grid>
            <Stack spacing={2} sx={{ width: '100%', maxWidth: 700 }}>
                <Button href='/categories' variant='contained' color='success'>
                    Go back to categories
                </Button>
                <Button variant='contained' disabled={isLoadingItems} startIcon={<ShoppingCartIcon />} color='success' onClick={() => {
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