import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export const PUT = async (req: NextRequest) => {
    const items = [
        [
            ["Mangoes",                 35],
            ["Bananas",                 30],
            ["Pineapples",              30],
            ["Papayas",                 25],
            ["Oranges",                 25],
            ["Apples",                  20],
            ["Grapes",                  35],
            ["Watermelons",             50],
            ["Cantaloupe",              40]
        ],
        [
            ["Broccoli",                15],
            ["Carrots",                 20],
            ["Cauliflower",             15],
            ["Celery",                   5],
            ["Onions",                  10],
            ["Potatoes",                15],
            ["Tomatoes",                15]
        ],
        [
            ["Chicken",                120],
            ["Pork",                   150],
            ["Beef",                   200],
            ["Hotdogs",                 30],
            ["Bacon",                   60],
            ["Sausage",                 40]
        ],
        [
            ["Fish",                   120],
            ["Shrimp",                 150],
            ["Squid",                  150],
            ["Crab",                   135],
            ["Tuna",                   200],
            ["Sardines",               135]
        ],
        [
            ["Milk",                    25],
            ["Cheese",                  40],
            ["Eggs (per tray)",         30],
            ["Yogurt",                  25],
            ["Butter",                  25],
            ["Ice cream",               20]
        ],
        [
            ["Rice (sack)",           1250],
            ["Bread",                   50],
            ["Flour",                   50],
            ["Sugar",                   25],
            ["Salt",                    25],
            ["Pepper",                  10],
            ["Garlic",                   5],
            ["Onions",                   5],
            ["Cooking oil",             10],
            ["Soy sauce",               10],
            ["Vinegar",                 10],
            ["Bagoong isda",            35],
            ["Bagoong alamang",         35],
            ["Patis",                   15],
            ["Sardines (canned)",       20],
            ["Tuna (canned)",           20],
            ["Corned beef",             20],
            ["Fruits (canned)",         20],
            ["Vegetables (canned)",     20],
            ["Instant noodles",         15],
            ["Pasta",                   20],
            ["Cereal",                  20],
            ["Chips",                   15],
            ["Cookies",                 10],
            ["Candy (pack)",            25]
        ],
        [
            ["Water",                   15],
            ["Juice",                   15],
            ["Soda",                    15],
            ["Coffee",                  15],
            ["Tea",                     15]
        ],
        [
            ["Shampoo",                 10],
            ["Soap",                    10],
            ["Toothpaste",              10],
            ["Deodorant",               10],
            ["Pet food",               100],
            ["Baby supplies",           50]
        ],
        [
            ["Puto",                    15],
            ["Bibingka",                25],
            ["Kutsinta",                 5],
            ["Kalamay",                 15]
        ],
        [
            ["Halo-halo",               15],
            ["Leche flan",              25],
            ["Turon",                   15],
            ["Taho",                    10]
        ]
    ];

    try {
        const prisma = new PrismaClient();

        const deleteQueries: any[] = [];
        for (const category in items) {
            deleteQueries.push(prisma.groceryItems.deleteMany({
                where: {
                    category: parseInt(category)
                }
            }));
        }

        const insertQueries: any[] = [];
        for (const category in items) {
            for (const item of items[category]) {
                insertQueries.push(prisma.groceryItems.create({
                    data: {
                        name: `${item[0]}`,
                        category: parseInt(category),
                        price: parseInt(`${item[1]}`),
                        stocks: Math.floor(Math.random() * (250 - 1) + 1)
                    }
                }));
            }
        }
        
        await Promise.all(deleteQueries);
        await Promise.all(insertQueries);

        return new NextResponse('Ok', { status: 200 });
    } catch (err) {
        console.log({ err });
        return new NextResponse('Failed to load grocery items', { status: 500 });
    }
};