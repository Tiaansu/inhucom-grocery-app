import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest, { params }: { params: { categoryId: string }}) => {
    try {
        const categoryId = parseInt(params.categoryId);
        if (categoryId < 0 || categoryId > 10) {
            throw new Error('Invalid categoryId');
        }

        const prisma = new PrismaClient();

        const data = await prisma.groceryItems.findMany({
            where: {
                category: categoryId
            }
        });

        prisma.$disconnect();

        return new NextResponse(JSON.stringify(data), { status: 200 });
    } catch (err) {
        return new NextResponse('Failed to load the items on the specified category.', { status: 200 });
    }
};