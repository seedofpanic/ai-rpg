import { t } from "localization";

interface BackgroundTemplate {
    name: string;
    race: string;
    background: string;
    trueBackground: string;
    motivation: string;
    uniqueTrait: string;
    beliefs: string;
}

export const backgroundsData = t('backgroundsData') as BackgroundTemplate[];