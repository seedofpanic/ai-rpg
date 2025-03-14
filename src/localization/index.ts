import { makeAutoObservable } from "mobx";
import lore_en from "./lore_en";
import lore_ru from "./lore_ru";
import { backgroundsData_en } from "localization/backgroundsData_en";
import { backgroundsData_ru } from "localization/backgroundsData_ru";

const translations = {
  en: {
    lore: lore_en,
    characterCustomization: "Character Customization",
    name: "Name",
    gender: "Gender",
    race: "Race",
    class: "Class",
    startGame: "Start Game",
    inventory: "Inventory",
    gold: "Gold",
    noItems: "No items in inventory.",
    shop: "Shop",
    buy: "Buy",
    noItemsAvailable: "No items available.",
    enterMessage: "Enter a message...",
    send: "Send",
    close: "Close",
    npcNotFound: "NPC not found",
    contextCreator: {
        npcIntroduction: "You are an NPC named {name}. Player can lie to you, rely mostly on your personal knowledge. Here is your context:",
        basicInformation: "Basic Information",
        race: "Race",
        role: "Role",
        background: "Background",
        trueBackground: "True Background",
        motivation: "Motivation",
        uniqueTrait: "Unique Trait",
        beliefs: "Beliefs",
        inventory: "You have only items that are in your inventory",
        noItems: "No items in inventory",
        gold: "Gold",
        knowledgeAndExperience: "Knowledge and Experience",
        loreAndBeliefs: "Lore and beliefs",
        location: "Location",
        environment: "Environment",
        nearbyNpcs: "Nearby NPCs",
        relationshipsWithOtherNpcs: "Relationships with other NPCs",
        relationshipWithPlayer: "Relationship with Player",
        increaseSellingPrice: "Increase selling price if you don't like the player.",
        otherLocations: "Other Locations",
        npcsThere: "NPCs there",
        player: "Player",
        responseInstructions: "Respond based on this context, considering your environment and current location. Mention location details, events, and other NPCs if relevant. Keep it brief.\nIf you liked the player's message, add \"*like*\".\nIf you found the player's message confusing, add \"*confused*\".\nIf you found the player's message offensive, add \"*offensive*\".\nIf you found the player's message interesting, add \"*interesting*\".\nIf you found the player's message unfriendly or hostile, add \"*unfriendly*\".\nIf you are talking about trade, add a list of items with prices wrapped in <sell></sell>. Example: <sell>Iron Sword,50;Red mask,34</sell>",
        playersMessage: "Player's message",
    },
    totalDialogTokensCount: "Total dialog tokens count:",
    boughtItem: "Bought {itemName} for {itemPrice} gold.",
    notEnoughGold: "Not enough gold.",
    failedToSendMessage: "Failed to send message:",
    male: "Male",
    female: "Female",
    human: "Human",
    elf: "Elf",
    orc: "Orc",
    dwarf: "Dwarf",
    warrior: "Warrior",
    mage: "Mage",
    archer: "Archer",
    thief: "Thief",
    english: "English",
    russian: "Russian",
    locations: {
      marketSquare: {
        name: "Market Square",
        description: "A bustling trading square in the city center, surrounded by various shops and stores"
      },
      alchemistsShop: {
        name: "Alchemist's Shop",
        description: "A small shop on the corner of the market square, filled with vials, herbs, and magical items"
      },
      blacksmithsForge: {
        name: "Blacksmith's Forge",
        description: "A hot and noisy forge where blacksmith Ivan forges weapons and armor"
      },
      fishingVillage: {
        name: "Fishing Village",
        description: "A small village on the riverbank where fishermen live"
      },
      farm: {
        name: "Farm",
        description: "A large farm outside the city where various crops are grown"
      },
      jewelersWorkshop: {
        name: "Jeweler's Workshop",
        description: "A workshop where jeweler Olga creates exquisite jewelry"
      }
    },
    itemsData: {
        sword: "Sword",
        swordDescription: "A sharp sword for battle.",
        shield: "Shield",
        shieldDescription: "A sturdy shield for protection.",
        healthPotion: "Health Potion",
        healthPotionDescription: "A potion that restores health.",
        magicWand: "Magic Wand",
        magicWandDescription: "A wand imbued with magical powers.",
        helmet: "Helmet",
        helmetDescription: "A helmet to protect your head.",
        bow: "Bow",
        bowDescription: "A bow for ranged attacks.",
        arrow: "Arrow",
        arrowDescription: "Ammunition for the bow.",
        boots: "Boots",
        bootsDescription: "Boots to increase your speed.",
        ringOfStrength: "Ring of Strength",
        ringOfStrengthDescription: "A ring that increases your strength.",
        cloakOfInvisibility: "Cloak of Invisibility",
        cloakOfInvisibilityDescription: "A cloak that makes you invisible.",
    },
    backgroundsData: backgroundsData_en,
    npc: {
      names: [
        "Mikhail", "Vasily", "Peter", "Anna", "Ivan", "Alexey", "Dmitry", "Nikolay", 
        "Elena", "Olga", "Maria", "Sergey", "Andrey", "Tatyana", "Yulia", 
        "Alexander", "Vladimir", "Ekaterina", "Natalya", "Galina"
      ],
      roles: [
        "Merchant", "Alchemist", "Guard", "Baker", "Blacksmith", "Fisherman", 
        "Hunter", "Farmer", "Tailor", "Jeweler"
      ],
      personalities: [
        "Friendly", "Eccentric", "Serious", "Cheerful", "Reserved", 
        "Sociable", "Modest", "Ambitious"
      ],
      knowledgePool: [
        "Knows everything about goods and prices in the city",
        "Aware of the latest city events",
        "Has connections with other merchants",
        "Expert in potion making and alchemy",
        "Knows many rare recipes",
        "Studies the magical properties of plants",
        "Master in blacksmithing",
        "Knows the best fishing spots",
        "Experienced hunter",
        "Knows everything about agriculture",
        "Master of sewing and tailoring",
        "Expert in jewelry making"
      ]
    },
    npcGreeting: "Hello, I am {name}, the {role}. How can I help you?",
  },
  ru: {
    lore: lore_ru,
    "characterCustomization": "Настройка персонажа",
    "name": "Имя",
    "gender": "Пол",
    "race": "Раса",
    "class": "Класс",
    "startGame": "Начать игру",
    "inventory": "Инвентарь",
    "gold": "Золото",
    "noItems": "Нет предметов в инвентаре.",
    "shop": "Магазин",
    "buy": "Купить",
    "noItemsAvailable": "Нет доступных предметов.",
    "enterMessage": "Введите сообщение...",
    "send": "Отправить",
    "close": "Закрыть",
    "npcNotFound": "NPC не найден",
    "contextCreator": {
        "npcIntroduction": "Вы — NPC по имени {name}. Игрок может лгать вам, полагайтесь в основном на свои знания. Вот ваш контекст:",
        "basicInformation": "Основная информация",
        "race": "Раса",
        "role": "Роль",
        "background": "Предыстория",
        "trueBackground": "Истинная предыстория",
        "motivation": "Мотивация",
        "uniqueTrait": "Уникальная особенность",
        "beliefs": "Убеждения",
        "inventory": "У вас есть только те предметы, которые находятся в вашем инвентаре",
        "noItems": "Нет предметов в инвентаре",
        "gold": "Золото",
        "knowledgeAndExperience": "Знания и опыт",
        "loreAndBeliefs": "Лор и убеждения",
        "location": "Локация",
        "environment": "Окружение",
        "nearbyNpcs": "Ближайшие NPC",
        "relationshipsWithOtherNpcs": "Отношения с другими NPC",
        "relationshipWithPlayer": "Отношение к игроку",
        "increaseSellingPrice": "Увеличивайте цену товаров, если вам не нравится игрок.",
        "otherLocations": "Другие локации",
        "npcsThere": "NPC в этих локациях",
        "player": "Игрок",
        "responseInstructions": "Отвечайте, основываясь на этом контексте, учитывая своё окружение и текущую локацию. Упоминайте детали местоположения, события и других NPC, если это уместно. Будьте кратки.\nЕсли вам понравилось сообщение игрока, добавьте \"*like*\".\nЕсли сообщение игрока сбило вас с толку, добавьте \"*confused*\".\nЕсли сообщение игрока показалось вам оскорбительным, добавьте \"*offensive*\".\nЕсли сообщение игрока показалось вам интересным, добавьте \"*interesting*\".\nЕсли сообщение игрока было недружелюбным или враждебным, добавьте \"*unfriendly*\".\nЕсли речь идёт о торговле, добавьте список товаров с ценами в теге <sell></sell>. Пример: <sell>Железный меч,50;Красная маска,34</sell>",
        "playersMessage": "Сообщение игрока"
    },
    "totalDialogTokensCount": "Общее количество токенов в диалоге:",
    "boughtItem": "Куплено {itemName} за {itemPrice} золота.",
    "notEnoughGold": "Недостаточно золота.",
    "failedToSendMessage": "Не удалось отправить сообщение:",
    "male": "Мужчина",
    "female": "Женщина",
    "human": "Человек",
    "elf": "Эльф",
    "orc": "Орк",
    "dwarf": "Дварф",
    "warrior": "Воин",
    "mage": "Маг",
    "archer": "Лучник",
    "thief": "Вор",
    "english": "Английский",
    "russian": "Русский",
    "itemsData": {
        "sword": "Меч",
        "swordDescription": "Острый меч для битвы.",
        "shield": "Щит",
        "shieldDescription": "Прочный щит для защиты.",
        "healthPotion": "Зелье здоровья",
        "healthPotionDescription": "Зелье, восстанавливающее здоровье.",
        "magicWand": "Волшебная палочка",
        "magicWandDescription": "Палочка, наделённая магической силой.",
        "helmet": "Шлем",
        "helmetDescription": "Шлем для защиты головы.",
        "bow": "Лук",
        "bowDescription": "Лук для дальних атак.",
        "arrow": "Стрела",
        "arrowDescription": "Боеприпасы для лука.",
        "boots": "Сапоги",
        "bootsDescription": "Сапоги, увеличивающие скорость.",
        "ringOfStrength": "Кольцо силы",
        "ringOfStrengthDescription": "Кольцо, увеличивающее вашу силу.",
        "cloakOfInvisibility": "Плащ невидимости",
        "cloakOfInvisibilityDescription": "Плащ, делающий вас невидимым."
    },
    backgroundsData: backgroundsData_ru,
    "npc": {
        "names": [
            "Михаил", "Василий", "Пётр", "Анна", "Иван", "Алексей", "Дмитрий", "Николай", 
            "Елена", "Ольга", "Мария", "Сергей", "Андрей", "Татьяна", "Юлия", 
            "Александр", "Владимир", "Екатерина", "Наталья", "Галина"
        ],
        "roles": [
            "Торговец", "Алхимик", "Стражник", "Пекарь", "Кузнец", "Рыбак", 
            "Охотник", "Фермер", "Портной", "Ювелир"
        ],
        "personalities": [
            "Дружелюбный", "Эксцентричный", "Серьёзный", "Жизнерадостный", "Сдержанный", 
            "Общительный", "Скромный", "Амбициозный"
        ],
        "knowledgePool": [
            "Знает всё о товарах и ценах в городе",
            "В курсе последних событий в городе",
            "Имеет связи с другими торговцами",
            "Эксперт в зельеварении и алхимии",
            "Знает множество редких рецептов",
            "Изучает магические свойства растений",
            "Мастер кузнечного дела",
            "Знает лучшие рыболовные места",
            "Опытный охотник",
            "Знает всё о сельском хозяйстве",
            "Мастер шитья и портняжного дела",
            "Эксперт в ювелирном мастерстве"
        ]
    },
    "npcGreeting": "Привет, я {name}, {role}. Чем могу помочь?",
    locations: {
      marketSquare: {
        name: "Рыночная площадь",
        description: "Оживлённая торговая площадь в центре города, окружённая магазинами и лавками"
      },
      alchemistsShop: {
        name: "Магазин алхимика",
        description: "Небольшой магазин на углу рыночной площади, полный склянок, трав и магических предметов"
      },
      blacksmithsForge: {
        name: "Кузница",
        description: "Горячая и шумная кузница, где кузнец Иван кует оружие и доспехи"
      },
      fishingVillage: {
        name: "Рыбацкая деревня",
        description: "Небольшая деревня на берегу реки, где живут рыбаки"
      },
      farm: {
        name: "Ферма",
        description: "Большая ферма за пределами города, где выращивают различные культуры"
      },
      jewelersWorkshop: {
        name: "Ювелирная мастерская",
        description: "Мастерская, где ювелир Ольга создаёт изысканные украшения"
      }
    }
  }
};

export const currentLanguage = makeAutoObservable({
    lang: "en",
    setLanguage(lang: string) {
        this.lang = lang;
    }
});

const getTranslationByPath = (path: string, obj: any): any => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

export const t = (key: string, replaces: Record<string, string> = {}): string => {
    let translation = getTranslationByPath(key, translations[currentLanguage.lang]) || key;
    for (const [placeholder, value] of Object.entries(replaces)) {
        translation = translation.replace(`{${placeholder}}`, value);
    }
    return translation;
};
