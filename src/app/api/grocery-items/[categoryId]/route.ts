import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest, { params }: { params: { categoryId: string }}) => {
    const prisma = new PrismaClient();
    try {
        const categoryId = parseInt(params.categoryId);
        if (categoryId !== -1 && (categoryId < -1 || categoryId > 10)) {
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

        prisma.$disconnect();

        return new NextResponse(JSON.stringify(data), { status: 200 });
    } catch (err) {
        return new NextResponse('Failed to load the items on the specified category.', { status: 200 });
    } finally {
        prisma.$disconnect();
    }
};

export const PATCH = async (req: NextRequest) => {
    const prisma = new PrismaClient();
    try {
        const {
            id, enteredQuantity
        }: {
            id: string;
            enteredQuantity: number
        } = await req.json();

        await prisma.groceryItems.update({
            where: {
                id
            },
            data: {
                stocks: -enteredQuantity
            }
        });

        return new NextResponse('Successfully updated the data on the database.', { status: 200 });
    } catch (err) {
        return new NextResponse('Failed to update the data on the database.', { status: 200 });
    } finally {
        prisma.$disconnect();
    }
};