import { v4 as uuidv4 } from 'uuid';
import { t } from '../localization';

interface Item {
    name: string;
    description: string;
    price: number;
}

export const itemsData = new Map<string, Item>();
const uuid = uuidv4();
itemsData.set(uuid, {
    name: t('itemsData.sword'),
    description: t('itemsData.swordDescription'),
    price: 100,
});

itemsData.set(uuidv4(), {
    name: t('itemsData.shield'),
    description: t('itemsData.shieldDescription'),
    price: 150,
});

itemsData.set(uuidv4(), {
    name: t('itemsData.healthPotion'),
    description: t('itemsData.healthPotionDescription'),
    price: 50,
});

itemsData.set(uuidv4(), {
    name: t('itemsData.magicWand'),
    description: t('itemsData.magicWandDescription'),
    price: 200,
});

itemsData.set(uuidv4(), {
    name: t('itemsData.helmet'),
    description: t('itemsData.helmetDescription'),
    price: 75,
});

itemsData.set(uuidv4(), {
    name: t('itemsData.bow'),
    description: t('itemsData.bowDescription'),
    price: 120,
});

itemsData.set(uuidv4(), {
    name: t('itemsData.arrow'),
    description: t('itemsData.arrowDescription'),
    price: 10,
});

itemsData.set(uuidv4(), {
    name: t('itemsData.boots'),
    description: t('itemsData.bootsDescription'),
    price: 80,
});

itemsData.set(uuidv4(), {
    name: t('itemsData.ringOfStrength'),
    description: t('itemsData.ringOfStrengthDescription'),
    price: 250,
});

itemsData.set(uuidv4(), {
    name: t('itemsData.cloakOfInvisibility'),
    description: t('itemsData.cloakOfInvisibilityDescription'),
    price: 300,
});
