/**
 * Service de notifications Discord
 * Envoie des messages embed formatés pour les changements de cycle
 */

import { CycleInfo, EMBED_COLORS, LOCATION_NAMES, LOCATION_EMOJIS } from '../types/index.js';
import { DISCORD_WEBHOOK_URL } from '../config.js';

/**
 * Structure d'un embed Discord
 * Amélioré avec le support des images et thumbnails
 */
interface DiscordEmbed {
  title: string;
  description: string;
  color: number;
  fields?: Array<{
    name: string;
    value: string;
    inline?: boolean;
  }>;
  footer?: {
    text: string;
  };
  timestamp?: string;
  thumbnail?: {
    url: string;
  };
  image?: {
    url: string;
  };
  author?: {
    name: string;
    icon_url?: string;
  };
}

/**
 * Payload du webhook Discord
 */
interface WebhookPayload {
  embeds: DiscordEmbed[];
}

/**
 * Envoyer une notification de changement de cycle sur Discord
 * Cette fonction est appelée quand un lieu change de jour à nuit ou vice versa
 */
export async function sendCycleChangeNotification(cycle: CycleInfo): Promise<void> {
  if (!DISCORD_WEBHOOK_URL) {
    console.error('L\'URL du webhook Discord n\'est pas configurée');
    return;
  }
  
  try {
    const embed = createCycleEmbed(cycle);
    const payload: WebhookPayload = {
      embeds: [embed],
    };
    
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error(`Échec du webhook Discord: ${response.status} ${response.statusText}`);
    }
    
    console.log(`✅ Notification envoyée pour ${cycle.id}: ${cycle.state}`);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification Discord:', error);
    throw error;
  }
}

/**
 * Obtenir le nom du cycle selon le lieu
 * Retourne les vrais noms : Fass/Vome, Chaud/Froid, Jour/Nuit
 */
function getCycleStateName(locationId: string, state: string): string {
  if (locationId === 'cambion') {
    return state === 'day' ? '🔥 Fass' : '🌊 Vome';
  } else if (locationId === 'vallis') {
    return state === 'day' ? '☀️ Chaud' : '❄️ Froid';
  } else {
    return state === 'day' ? '☀️ Jour' : '🌙 Nuit';
  }
}

/**
 * Créer un embed Discord pour un changement de cycle
 * L'embed est formaté avec des couleurs, emojis et informations pertinentes
 * Amélioré avec des médias riches (thumbnails, images, infos auteur, etc.)
 */
function createCycleEmbed(cycle: CycleInfo): DiscordEmbed {
  const locationName = LOCATION_NAMES[cycle.id];
  const emoji = LOCATION_EMOJIS[cycle.id];
  const color = EMBED_COLORS[cycle.state];
  
  // Créer le titre basé sur l'état et le lieu
  // Utilise les vrais noms : Fass/Vome pour Cambion, Chaud/Froid pour Vallis
  let stateText: string;
  if (cycle.id === 'cambion') {
    stateText = cycle.state === 'day' ? '🔥 Fass' : '🌊 Vome';
  } else if (cycle.id === 'vallis') {
    stateText = cycle.state === 'day' ? '☀️ Chaud' : '❄️ Froid';
  } else {
    stateText = cycle.state === 'day' ? '☀️ Jour' : '🌙 Nuit';
  }
  
  // Images haute qualité pour chaque lieu et état
  // URLs directes du site officiel Warframe et du Wiki
  const images = {
    // Cetus (Plaines d'Eidolon)
    cetus_night: 'https://www-static.warframe.com/uploads/thumbnails/c52f54dd9f6a2cc704f04f590a0512f1_1600x900.jpg', // Plaines de nuit
    cetus_day: 'https://images.steamusercontent.com/ugc/931551292831672419/2A30C4AB354C9DABBC4D9D6EFDF70400B20952DD/?imw=637&imh=358&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true', // Plaines de jour
    
    // Vallis (Orb Vallis - Fortuna)
    vallis_cold: 'https://warframe.market/static/assets/items/images/en/orb_vallis_scene.ec0d83fb585311c59e4dd5c3b668ca4e.png', // Orb Vallis froid
    vallis_warm: 'https://warframe.market/static/assets/items/images/en/orb_vallis_scene.ec0d83fb585311c59e4dd5c3b668ca4e.png', // Orb Vallis chaud
    
    earth_night: 'https://www-static.warframe.com/uploads/thumbnails/c52f54dd9f6a2cc704f04f590a0512f1_1600x900.jpg', // Plaines de nuit
    earth_day: 'https://images.steamusercontent.com/ugc/931551292831672419/2A30C4AB354C9DABBC4D9D6EFDF70400B20952DD/?imw=637&imh=358&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true', // Plaines de jour
    // Cambion Drift (Deimos)
    cambion_night: 'https://static.wikia.nocookie.net/warframe/images/1/11/VomeWyrm.png/revision/latest?cb=20230913133813&path-prefix=fr', // Cycle Vome (nuit)
    cambion_day: 'https://static.wikia.nocookie.net/warframe/images/e/e1/FassWyrm.png/revision/latest/scale-to-width-down/1000?cb=20230913133745&path-prefix=fr', // Cycle Fass (jour)
  };
  
  // Miniatures pour les embeds (petites icônes)
  const thumbnails = {
    cetus_night: 'https://static.wikia.nocookie.net/warframe/images/2/28/CephalonIconLightGold.png/revision/latest?cb=20150212031821&path-prefix=fr', // Icône nuit
    cetus_day: 'https://static.wikia.nocookie.net/warframe/images/2/28/CephalonIconLightGold.png/revision/latest?cb=20150212031821&path-prefix=fr', // Icône jour
    vallis_cold: 'https://static.wikia.nocookie.net/warframe/images/2/28/CephalonIconLightGold.png/revision/latest?cb=20150212031821&path-prefix=fr', // Icône froid
    vallis_warm: 'https://static.wikia.nocookie.net/warframe/images/2/28/CephalonIconLightGold.png/revision/latest?cb=20150212031821&path-prefix=fr', // Icône chaud
    earth_night: 'https://static.wikia.nocookie.net/warframe/images/2/28/CephalonIconLightGold.png/revision/latest?cb=20150212031821&path-prefix=fr', // Icône nuit
    earth_day: 'https://static.wikia.nocookie.net/warframe/images/2/28/CephalonIconLightGold.png/revision/latest?cb=20150212031821&path-prefix=fr', // Icône jour
    cambion_night: 'https://static.wikia.nocookie.net/warframe/images/2/28/CephalonIconLightGold.png/revision/latest?cb=20150212031821&path-prefix=fr', // Icône Vome
    cambion_day: 'hhttps://static.wikia.nocookie.net/warframe/images/2/28/CephalonIconLightGold.png/revision/latest?cb=20150212031821&path-prefix=fr', // Icône Fass
  };
  
  // Mapper les états de Vallis (day=warm, night=cold)
  const stateKey = cycle.id === 'vallis' 
    ? (cycle.state === 'day' ? 'warm' : 'cold')
    : cycle.state;
  
  const imageKey = `${cycle.id}_${stateKey}` as keyof typeof images;
  const thumbnailKey = `${cycle.id}_${stateKey}` as keyof typeof thumbnails;
  
  const embed: DiscordEmbed = {
    title: `${emoji} ${locationName} - ${stateText}`,
    description: cycle.shortDesc,
    color: color,
    fields: [
      {
        name: '⏰ Temps Restant',
        value: cycle.timeLeft,
        inline: true,
      },
      {
        name: '🔄 Cycle Actuel',
        value: getCycleStateName(cycle.id, cycle.state),
        inline: true,
      },
      {
        name: '📍 Localisation',
        value: locationName,
        inline: false,
      },
    ],
    footer: {
      text: 'Warframe - Suivi des Cycles',
    },
    timestamp: new Date().toISOString(),
  };
  
  // Ajouter la miniature si disponible
  if (thumbnails[thumbnailKey]) {
    embed.thumbnail = {
      url: thumbnails[thumbnailKey],
    };
  }
  
  // Ajouter l'image principale si disponible
  if (images[imageKey]) {
    embed.image = {
      url: images[imageKey],
    };
  }
  
  return embed;
}

/**
 * Envoyer une notification groupée pour plusieurs changements de cycle
 * Utile quand le bot démarre et détecte plusieurs changements
 */
export async function sendBatchNotifications(cycles: CycleInfo[]): Promise<void> {
  if (!DISCORD_WEBHOOK_URL) {
    console.error('L\'URL du webhook Discord n\'est pas configurée');
    return;
  }
  
  try {
    const embeds = cycles.map(createCycleEmbed);
    const payload: WebhookPayload = {
      embeds: embeds,
    };
    
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error(`Échec du webhook Discord: ${response.status} ${response.statusText}`);
    }
    
    console.log(`✅ Notification groupée envoyée pour ${cycles.length} cycles`);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification groupée Discord:', error);
    throw error;
  }
}

