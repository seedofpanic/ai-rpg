export interface Location {
    name: string;
    description: string;
    x: number;
    y: number;
    width: number;
    height: number;
    npcs: string[];
}

export const locations: Location[] = [
    {
        name: "locations.marketSquare.name",
        description: "locations.marketSquare.description",
        x: 100,
        y: 100,
        width: 500,
        height: 500,
        npcs: []
    },
    {
        name: "locations.alchemistsShop.name",
        description: "locations.alchemistsShop.description",
        x: 700,
        y: 100,
        width: 300,
        height: 300,
        npcs: []
    },
    {
        name: "locations.blacksmithsForge.name",
        description: "locations.blacksmithsForge.description",
        x: 1100,
        y: 100,
        width: 400,
        height: 400,
        npcs: []
    },
    {
        name: "locations.fishingVillage.name",
        description: "locations.fishingVillage.description",
        x: 100,
        y: 700,
        width: 600,
        height: 400,
        npcs: []
    },
    {
        name: "locations.farm.name",
        description: "locations.farm.description",
        x: 800,
        y: 700,
        width: 500,
        height: 500,
        npcs: []
    },
    {
        name: "locations.jewelersWorkshop.name",
        description: "locations.jewelersWorkshop.description",
        x: 1400,
        y: 700,
        width: 350,
        height: 350,
        npcs: []
    }
];


