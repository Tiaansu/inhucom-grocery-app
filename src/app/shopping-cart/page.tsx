'use client';

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
    Slide, 
    Stack, 
    TextField, 
    Typography 
} from '@mui/material';
import { 
    Edit as EditIcon,
    AttachMoney as AttachMoneyIcon,
    Check as CheckIcon,
    Delete as DeleteIcon,
    ArrowBackIos as ArrowBackIosIcon,
} from '@mui/icons-material';
import { green } from '@mui/material/colors';
import { ReactElement, Ref, forwardRef, useEffect, useState } from 'react';
import { TransitionProps } from '@mui/material/transitions';
import { useRouter } from 'next/navigation';

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

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: ReactElement<any, any>;
    },
    ref: Ref<unknown>,
) {
    return <Slide direction='up' ref={ref} {...props} />;
});

export default function Page() {
    const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);
    const [isLoadingShoppingCartItems, setIsLoadingShoppingCartItems] = useState<boolean>(true);
    const [filteredGroceryItem, setFilteredGroceryItem] = useState<GroceryItem | null>(null);
    const [filteredShoppingCartItem, setFilteredShoppingCartItem] = useState<ShoppingCartItem | null>(null);
    const [openEditCartItem, setOpenEditCartItem] = useState<boolean>(false);
    const [enteredQuantity, setEnteredQuantity] = useState<number>(0);
    
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [openCheckoutDialog, setOpenCheckoutDialog] = useState<boolean>(false);

    let shoppingCartItems: ShoppingCartItem[] = [];

    const router = useRouter();
    
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

    const handleOpen = (item: ShoppingCartItem) => {
        setFilteredShoppingCartItem(item);

        setFilteredGroceryItem(groceryItems.filter((groceryItem) => groceryItem.name === item.name)[0]);

        setOpenEditCartItem(true);
    };

    const handleClose = () => {
        resetStates();
    };

    const resetStates = () => {
        setOpenEditCartItem(false);

        setEnteredQuantity(0);
    };

    const handleOpenCheckout = () => {
        setOpenCheckoutDialog(true);
    };

    const handleCloseCheckout = () => {
        setOpenCheckoutDialog(false);
    };

    const handleCheckout = async () => {
        const wantToContinue = confirm('Want to continue?');

        if (wantToContinue) {
            try {
                await fetch('/api/grocery-items/-1', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(shoppingCartItems)
                });
            } catch (error) {
                console.error(error);
            } finally {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('tnan_shopping-cart');
                }
                router.push('/');
            }
        }
    };

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
                                            onClick={() => handleOpen(shoppingCartItem)}
                                        >
                                            Update
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                        {(filteredGroceryItem && filteredShoppingCartItem) && (
                            <Dialog open={openEditCartItem} onClose={handleClose}>
                                <DialogTitle>Update {filteredGroceryItem.name}</DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        Please enter the new quantity below: (Make sure it&apos;s lower than {filteredGroceryItem.stocks})
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
                                        value={enteredQuantity < 0 ? 0 : (enteredQuantity > filteredGroceryItem.stocks ? filteredGroceryItem.stocks : enteredQuantity)}
                                        onChange={(e) => {
                                            let quantity = parseInt(e.target.value);

                                            quantity = quantity < 0 ? 0 : (quantity > filteredGroceryItem.stocks ? filteredGroceryItem.stocks : quantity);
                                            setEnteredQuantity(quantity);
                                        }}
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button
                                        onClick={() => {
                                            if (enteredQuantity <= 0) {
                                                const wantToContinue = confirm(`Want to remove item ${filteredShoppingCartItem.name} with ${filteredShoppingCartItem.quantity} of quantity in your shopping cart? It will decrease your shopping cart's total price by ₱${Intl.NumberFormat().format(filteredShoppingCartItem.price * filteredShoppingCartItem.quantity)}.`);
                                                
                                                if (wantToContinue) {
                                                    shoppingCartItems = shoppingCartItems.filter((shoppingCartItem) => shoppingCartItem.name !== filteredShoppingCartItem.name);
                                                }
                                            } else {
                                                const wantToContinue = confirm(`Want to set item ${filteredShoppingCartItem.name}'s quantity to ${enteredQuantity} (${filteredShoppingCartItem.quantity} before)? Its total price will be ₱${Intl.NumberFormat().format(filteredShoppingCartItem.price * enteredQuantity)}.`);
                                            
                                                if (wantToContinue) {
                                                    const newShoppingCartItems = [...shoppingCartItems];
                                                    const updatedIndex = newShoppingCartItems.findIndex((item) => item.name === filteredShoppingCartItem.name);
                                                    newShoppingCartItems[updatedIndex].quantity = enteredQuantity;
                                                    shoppingCartItems = newShoppingCartItems;
                                                }
                                            }

                                            localStorage.setItem('tnan_shopping-cart', JSON.stringify(shoppingCartItems));
                                            resetStates();
                                        }}
                                        color={enteredQuantity <= 0 ? 'error' : 'success'}
                                        startIcon={enteredQuantity <= 0 ? <DeleteIcon /> : <CheckIcon />}
                                        disabled={enteredQuantity > filteredGroceryItem.stocks}
                                    >
                                        {enteredQuantity <= 0 ? 'Remove' : 'Update'}
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        )}
                    </>
                )}
            </Grid>
            <Stack spacing={2} sx={{ width: '100%', maxWidth: 700 }}>
                <Button 
                    variant='contained' 
                    color='success' 
                    startIcon={<ArrowBackIosIcon />}
                    onClick={() => {
                        router.back();
                    }}
                >
                    Go back to last page
                </Button>
                <Button 
                    variant='contained' 
                    color='success' 
                    startIcon={<AttachMoneyIcon />}
                    onClick={() => {
                        let rawTotalAmount = 0;
                        for (const shoppingCartItem of shoppingCartItems) {
                            rawTotalAmount += shoppingCartItem.price * shoppingCartItem.quantity;
                        }
                        setTotalAmount(rawTotalAmount);

                        const wantToContinue = confirm(`Want to checkout ${shoppingCartItems.length} item(s) in your shopping cart? It's total price is ₱${Intl.NumberFormat().format(rawTotalAmount)}.`);

                        if (wantToContinue) {
                            handleOpenCheckout();
                        }
                    }}
                >
                    Checkout
                </Button>
            </Stack>

            {/* Checkout dialog */}
            <Dialog 
                open={openCheckoutDialog} 
                onClose={handleCloseCheckout}
                TransitionComponent={Transition}
                keepMounted
                scroll='paper'
                maxWidth='sm'
                fullWidth
            >
                <DialogTitle>Checkout menu</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Here&apos;s the summary of your order.
                    </DialogContentText>
                    <DialogContentText mt={2}>
                        <table width={550} cellSpacing={0}>
                            <thead>
                                <tr>
                                    <th align='left'>Item</th>
                                    <th align='right'>Quantity</th>
                                    <th align='right'>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {shoppingCartItems.map((item) => (
                                    <tr key={item.dbId}>
                                        <td>{item.name}</td>
                                        <td align='right'>{item.quantity}</td>
                                        <td align='right'>₱{Intl.NumberFormat().format(item.price * item.quantity)}</td>
                                    </tr>
                                ))}
                                <tr>
                                    <td>&nbsp;</td>
                                    <td align='right'><strong>Subtotal</strong></td>
                                    <td align='right'>₱{Intl.NumberFormat().format(totalAmount)}</td>
                                </tr>
                                <tr>
                                    <td colSpan={3} align='center'>
                                        Your order id is TNAN-{Math.floor(Math.random() * (90_000_000 - 10_000_000) + 10_000_000)}. Please wait up to 3 hours for your order to be delivered. And also prepare ₱{Intl.NumberFormat().format(totalAmount)} for the payment.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        startIcon={<AttachMoneyIcon />}
                        color='success'
                        onClick={handleCheckout}
                    >
                        Checkout
                    </Button>
                </DialogActions>
            </Dialog>
        </main>
    )
}