export function getCategory(categoryId: number): string {
    let category = 'unknown';

    switch (categoryId) {
        case 0: category = 'Fruits'; break;
        case 1: category = 'Vegetables'; break;
        case 2: category = 'Meats'; break;
        case 3: category = 'Seafoods'; break;
        case 4: category = 'Dairy and eggs'; break;
        case 5: category = 'Pantry items'; break;
        case 6: category = 'Drinks'; break;
        case 7: category = 'Others'; break;
        case 8: category = 'Rice cakes'; break;
        case 9: category = 'Sweets'; break;
    }

    return category;
}