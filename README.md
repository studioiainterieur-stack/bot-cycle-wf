# 🌍 Warframe Cycle Bot - Real-time Discord Tracker

Un bot Discord automatique qui suit les cycles jour/nuit de tous les mondes Warframe et met à jour des messages épinglés en temps réel. Utilise des **calculs mathématiques locaux** (pas d'API externe) et fonctionne gratuitement sur GitHub Actions.

## ✨ Fonctionnalités

### 🌐 Tous les mondes Warframe
- **🌅 Cetus (Plaines d'Eidolon)** - Jour/Nuit (150 min)
- **🏔️ Fortuna (Vallée d'Orb)** - Chaud/Froid (160 min)
- **🦠 Deimos (Puits de Cambion)** - Fass/Vome (150 min)
- **🌍 Terre (Earth)** - Jour/Nuit (240 min)
- **🎭 Duviri (Spiral)** - 5 émotions (240 min)

### 🎯 Fonctionnalités principales
- ✅ **5 messages séparés** - Un message épinglé par monde
- ✅ **Mises à jour intelligentes** - Édite uniquement quand un cycle change
- ✅ **Calculs mathématiques** - Pas de dépendance à une API externe
- ✅ **Précision à la seconde** - Calculs instantanés et précis
- ✅ **Embeds magnifiques** - Couleurs et emojis pour chaque état
- ✅ **100% gratuit** - Fonctionne sur GitHub Actions (vérification toutes les 15 min)

## 📸 Aperçu

Chaque monde a son propre message Discord qui affiche :
- État actuel (avec emoji et couleur)
- Temps restant avant le prochain changement
- Activités recommandées pour ce cycle
- Barre de progression visuelle
- Heure de la prochaine transition

## 🚀 Installation rapide

### Prérequis
- Un serveur Discord où vous êtes administrateur
- Un compte GitHub (gratuit)
- 10 minutes de configuration

### Étape 1 : Créer le bot Discord

1. Va sur [Discord Developer Portal](https://discord.com/developers/applications)
2. Clique sur **"New Application"**
3. Donne un nom à ton bot (ex: "Warframe Cycles")
4. Va dans **"Bot"** → **"Add Bot"**
5. **Copie le Token** (garde-le secret !)
6. Active ces **Privileged Gateway Intents** :
   - ✅ Server Members Intent
   - ✅ Message Content Intent
7. Va dans **"OAuth2"** → **"URL Generator"**
   - Sélectionne : `bot`
   - Permissions : `Send Messages`, `Embed Links`, `Read Message History`, `Manage Messages`
8. Copie l'URL générée et invite le bot sur ton serveur

### Étape 2 : Configurer le repository GitHub

1. **Fork ou clone** ce repository sur ton compte GitHub
2. Va dans **Settings** → **Secrets and variables** → **Actions**
3. Crée un nouveau secret :
   - Nom : `DISCORD_BOT_TOKEN`
   - Valeur : Le token copié à l'étape 1
4. Clique sur **"Add secret"**

### Étape 3 : Créer les messages Discord

Tu dois créer 5 messages épinglés dans ton canal Discord. Tu as 2 options :

#### Option A : Création manuelle (recommandé)

1. Dans ton canal Discord, envoie 5 messages (un pour chaque monde) :
   ```
   Cetus - Configuration en cours...
   Fortuna - Configuration en cours...
   Deimos - Configuration en cours...
   Earth - Configuration en cours...
   Duviri - Configuration en cours...
   ```

2. **Épingle chaque message** (clic droit → Épingler)

3. **Copie l'ID de chaque message** :
   - Active le mode développeur : Paramètres → Avancés → Mode développeur
   - Clic droit sur chaque message → Copier l'ID

4. Crée le fichier `config/message-ids.json` avec ces IDs :
   ```json
   {
     "channelId": "VOTRE_ID_CANAL",
     "messages": {
       "cetus": "ID_MESSAGE_CETUS",
       "vallis": "ID_MESSAGE_FORTUNA",
       "cambion": "ID_MESSAGE_DEIMOS",
       "earth": "ID_MESSAGE_EARTH",
       "duviri": "ID_MESSAGE_DUVIRI"
     }
   }
   ```

5. Commit et push ce fichier sur GitHub

#### Option B : Script automatique (avancé)

Un script pour créer automatiquement les 5 messages sera ajouté prochainement.

### Étape 4 : Activer GitHub Actions

1. Va dans l'onglet **"Actions"** de ton repository
2. Active les workflows si demandé
3. Clique sur **"Run workflow"** pour tester immédiatement

### Étape 5 : C'est fait ! 🎉

Le bot vérifie maintenant les cycles **toutes les 15 minutes** et met à jour les messages automatiquement !

## 🔧 Comment ça fonctionne

### Architecture

```
GitHub Actions (toutes les 15 min)
    ↓
Calculs mathématiques locaux
    ↓
Détection des changements d'état
    ↓
Mise à jour Discord (uniquement si changement)
    ↓
Sauvegarde du nouvel état
```

### Calculs mathématiques

Chaque monde Warframe suit un cycle déterministe basé sur une **epoch** (point de départ) :

```typescript
// Exemple : Cetus
epoch: 1er janvier 2018, 00:00 UTC
cycle: 150 minutes (100 min jour / 50 min nuit)

// Calcul du cycle actuel :
temps_écoulé = maintenant - epoch
position_dans_cycle = temps_écoulé % 9000 secondes
état = position < 6000 ? "jour" : "nuit"
```

**Avantages :**
- ✅ Aucune API externe requise
- ✅ Calculs instantanés (<1ms)
- ✅ Précision parfaite
- ✅ Fonctionne hors ligne

## 📁 Structure du projet

```
warframe-cycle-bot/
├── .github/workflows/
│   └── check-cycles.yml          # GitHub Actions (15 min)
├── src/
│   ├── index.ts                  # Point d'entrée principal
│   ├── config.ts                 # Gestion configuration
│   ├── cycles/                   # Calculs mathématiques
│   │   ├── calculator.ts         # Fonctions communes
│   │   ├── cetus.ts              # Cetus
│   │   ├── vallis.ts             # Vallis
│   │   ├── cambion.ts            # Cambion
│   │   ├── earth.ts              # Earth
│   │   └── duviri.ts             # Duviri
│   ├── discord/                  # Intégration Discord
│   │   ├── client.ts             # Client REST API
│   │   ├── embeds.ts             # Construction embeds
│   │   └── messages.ts           # Gestion messages
│   ├── storage/                  # Persistance
│   │   └── state-manager.ts     # Sauvegarde états
│   └── types/
│       └── index.ts              # Types TypeScript
├── config/
│   └── message-ids.json          # IDs messages Discord
├── states/
│   └── cycle-states.json         # États actuels (auto-généré)
└── package.json
```

## 🛠️ Développement local

### Installation

```bash
# Cloner le repo
git clone https://github.com/VOTRE_USERNAME/warframe-cycle-bot.git
cd warframe-cycle-bot

# Installer les dépendances
npm install

# Créer le fichier de configuration
cp config/message-ids.json.template config/message-ids.json
# Éditer message-ids.json avec vos IDs

# Créer .env pour le token (ne pas commit)
echo "DISCORD_BOT_TOKEN=votre_token" > .env
```

### Lancer en local

```bash
# Compiler TypeScript
npm run build

# Lancer une vérification
npm run check

# Dev (compile + check)
npm run dev
```

### Tests

```bash
# Vérifier les types TypeScript
npm run type-check

# Nettoyer les fichiers compilés
npm run clean
```

## ⚙️ Configuration avancée

### Changer la fréquence de vérification

Éditez `.github/workflows/check-cycles.yml` :

```yaml
schedule:
  - cron: '*/15 * * * *'  # Toutes les 15 min (actuel)
  # - cron: '*/10 * * * *'  # Toutes les 10 min
  # - cron: '*/30 * * * *'  # Toutes les 30 min
```

**Note :** GitHub Actions a une limite de fréquence. Ne pas descendre en dessous de 5 minutes.

### Personnaliser les embeds

Les couleurs, descriptions et activités sont configurables dans :
- `src/types/index.ts` - Couleurs et noms
- `src/cycles/*.ts` - Descriptions par monde
- `src/discord/embeds.ts` - Structure des embeds

## 🐛 Dépannage

### Le bot ne met pas à jour les messages

1. **Vérifier les logs GitHub Actions** :
   - Va dans Actions → Dernière exécution → Check Warframe cycles
   - Regarde les logs pour les erreurs

2. **Vérifier la configuration** :
   ```bash
   # Les IDs de messages sont-ils corrects ?
   cat config/message-ids.json
   ```

3. **Vérifier les permissions du bot** :
   - Le bot doit pouvoir : Envoyer des messages, Gérer les messages, Lire l'historique

### Erreur "Configuration validation failed"

- Le token `DISCORD_BOT_TOKEN` n'est pas configuré dans GitHub Secrets
- Le fichier `config/message-ids.json` est manquant ou invalide

### Les messages ne se mettent pas à jour en temps réel

C'est normal ! Le bot vérifie toutes les **15 minutes**. Un changement de cycle sera détecté dans les 15 minutes suivant sa survenue.

### État "No changes detected"

C'est normal ! Le bot n'édite les messages que quand un cycle **change d'état**. Si tous les cycles sont stables, aucune mise à jour n'est nécessaire.

## 📊 Logs et monitoring

Les logs GitHub Actions montrent :
- ✅ États calculés pour chaque monde
- 🔍 Détection des changements
- 📝 Messages Discord mis à jour
- 💾 Sauvegarde des nouveaux états

Exemple de log :
```
🔢 Calculating cycles mathematically...
📊 CETUS: État: night, Temps restant: 15m 25s
✨ 1 world(s) have changed: CETUS
📝 Updating CETUS message...
✅ Cycle check completed successfully!
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésite pas à :
- Ouvrir une issue pour signaler un bug
- Proposer de nouvelles fonctionnalités
- Améliorer la documentation
- Soumettre des pull requests

## 📝 Changelog

### v2.0.0 (Actuel)
- ✨ Refonte complète du bot
- ✅ Calculs mathématiques locaux (pas d'API)
- ✅ 5 messages séparés par monde
- ✅ Support de Duviri (5 émotions)
- ✅ Mises à jour intelligentes (uniquement si changement)
- ✅ GitHub Actions toutes les 15 minutes

### v1.0.0 (Ancien)
- Webhook Vercel + API externe
- Message unique pour tous les mondes
- Vérification toutes les 5 minutes

## 📜 Licence

MIT License - Utilise et modifie librement !

## 🙏 Remerciements

- Communauté Warframe pour les timings de cycles
- Digital Extremes pour Warframe
- Discord pour l'API Bot

## 📞 Support

Besoin d'aide ? 
- 📖 Lis d'abord ce README
- 🐛 Ouvre une issue sur GitHub
- 💬 Rejoins la communauté Discord Warframe

---

**Profite bien du tracking des cycles ! 🎮**

*Made with ❤️ for the Warframe community*
