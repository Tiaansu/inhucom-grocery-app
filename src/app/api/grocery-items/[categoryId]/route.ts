import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

interface ShoppingCartItem {
    id: number;
    dbId: string;
    name: string;
    price: number;
    quantity: number;
}

export const GET = async (req: NextRequest, { params }: { params: { categoryId: string }}) => {
    let prisma: PrismaClient | null = null;
    const searchParams = req.nextUrl.searchParams;
    
    try {
        prisma = new PrismaClient();
        const categoryId = parseInt(params.categoryId);

        if (Boolean(searchParams.get('isPage')) && categoryId === -1) {
            throw new Error('Invalid categoryId');
        }

        if (categoryId < -1 || categoryId > 10) {
            throw new Error('Invalid categoryId');
        }

        let data = null;

        if (categoryId === -1) {
            data = await prisma.groceryItems.findMany();
        } else {
            data = await prisma.groceryItems.findMany({
                where: {
                    category: categoryId
                }
            });
        }
        
        return new NextResponse(JSON.stringify(data), { status: 200 });
    } catch (err) {
        return new NextResponse('Failed to load the items on the specified category.', { status: 200 });
    } finally {
        if (prisma) {
            prisma.$disconnect();
        }
    }
};

export const PATCH = async (req: NextRequest, { params }: { params: { categoryId: string }}) => {
    let prisma: PrismaClient | null = null;
    const seachParams = req.nextUrl.searchParams;

    try {
        const categoryId = parseInt(params.categoryId);
        prisma = new PrismaClient();

        if (Boolean(seachParams.get('isPage')) && categoryId === -1) {
            throw new Error('Invalid categoryId');
        }

        if (categoryId < -1 || categoryId > 10) {
            throw new Error('Invalid categoryId');
        }

        const shoppingCartItems: ShoppingCartItem[] = await req.json();
        const transactions = [];

        for (const item of shoppingCartItems) {
            const data = await prisma.groceryItems.findFirst({
                where: {
                    id: item.dbId
                }
            });

            if (data === null) {
                continue;
            }
            transactions.push(prisma.groceryItems.update({
                where: {
                    id: item.dbId
                },
                data: {
                    stocks: data.stocks -= item.quantity
                }
            }));
        }

        await Promise.all(transactions);

        return new NextResponse('Successfully updated the data on the database.', { status: 200 });
    } catch (err) {
        return new NextResponse('Failed to update the data on the database.', { status: 200 });
    } finally {
        if (prisma) {
            prisma.$disconnect();
        }
    }
};