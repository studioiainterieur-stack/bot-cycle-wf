# Bot Discord Warframe - Cycles Jour/Nuit 🌅🌙

Bot Discord qui surveille automatiquement les cycles jour/nuit de toutes les planètes Warframe et envoie des notifications quand ils changent.

## ✨ Fonctionnalités

- 🌍 **Toutes les planètes** : Cetus, Fortuna, Deimos, Earth
- 🔔 **Notifications automatiques** quand un cycle change
- ⏰ **Vérification toutes les 5 minutes** via GitHub Actions
- 🎨 **Embeds Discord colorés** avec emojis
- 💰 **100% GRATUIT** - Pas de carte bancaire requise !

## 🚀 Installation Rapide

**Voir [QUICKSTART_GITHUB.md](QUICKSTART_GITHUB.md) pour le guide complet !**

### Résumé en 5 étapes :

1. **Créer un webhook Discord** (dans les paramètres de votre serveur)
2. **Créer un repository GitHub** public
3. **Pousser ce code** sur GitHub
4. **Ajouter le webhook** comme secret GitHub
5. **Activer GitHub Actions** - C'est tout ! 🎉

## 📖 Documentation

- **[QUICKSTART_GITHUB.md](QUICKSTART_GITHUB.md)** - Démarrage rapide (5 min)
- **[GITHUB_DEPLOYMENT.md](GITHUB_DEPLOYMENT.md)** - Guide détaillé en français
- **[README.md](README.md)** - Documentation complète (anglais)

## 💰 Coût

**0€ - Totalement gratuit !**

- GitHub Actions : 2000 minutes/mois gratuites
- Ce bot utilise : ~150 minutes/mois
- **Vous utilisez seulement 7.5% du quota !**

Même avec un check toutes les 5 minutes, 24h/24, 7j/7, **c'est gratuit indéfiniment** ! ✅

## 🎯 Comment Ça Marche ?

1. GitHub Actions lance le bot **toutes les 5 minutes**
2. Le bot interroge l'API WarframeStat
3. Compare avec les états précédents (stockés dans `.cycle-states.json`)
4. Si un cycle a changé → **notification Discord** 🔔
5. Sauvegarde le nouvel état pour la prochaine fois

## 🔧 Personnalisation

### Changer la fréquence

Éditez `.github/workflows/check-cycles.yml` :

```yaml
schedule:
  - cron: '*/5 * * * *'   # Toutes les 5 minutes
  # - cron: '*/10 * * * *' # Toutes les 10 minutes
```

### Modifier les messages

Éditez `src/services/discord.ts` pour personnaliser les embeds Discord.

### Ajouter des @mentions

Dans `src/services/discord.ts`, ajoutez un champ `content` :

```typescript
const payload = {
  content: '<@&ROLE_ID> Le cycle a changé !',
  embeds: [embed],
};
```

## 📊 Exemple de Notification

```
🌅 Cetus (Plains of Eidolon) - 🌙 Heure de Nuit

La nuit tombe - Les Eidolons sont actifs !

⏱️ Temps Restant: 2h 30m
🌙 Cycle Actuel: Nuit

Warframe Cycle Tracker
```

## 🛠️ Structure du Projet

```
/Users/zelenion/Desktop/BOT/
├── .github/workflows/
│   └── check-cycles.yml       # GitHub Actions workflow
├── src/
│   ├── services/
│   │   ├── warframe.ts        # API WarframeStat
│   │   └── discord.ts         # Notifications Discord
│   └── utils/
│       ├── cycle-tracker.ts   # Détection des changements
│       └── state-storage.ts   # Sauvegarde des états
├── check-cycles.ts            # Script principal
└── .cycle-states.json         # États sauvegardés
```

## 🐛 Dépannage

### Pas de notifications ?

- Attendez qu'un cycle change réellement (50min-4h selon la planète)
- Vérifiez les logs dans l'onglet **Actions** sur GitHub
- Le webhook Discord est correct ?

### Le workflow ne se lance pas ?

- Le repository est **public** ?
- GitHub Actions sont **activées** ?
- Le secret `DISCORD_WEBHOOK_URL` existe ?

### Tester manuellement

1. Allez dans **Actions** sur GitHub
2. Cliquez sur **Check Warframe Cycles**
3. **Run workflow** → **Run workflow**
4. Vérifiez les logs

## 📝 Tester en Local

```bash
# Installer les dépendances
npm install

# Compiler TypeScript
npm run build

# Tester (nécessite .env.local avec DISCORD_WEBHOOK_URL)
npm run check:local
```

## 🌟 Fonctionnalités Futures

- [ ] Commandes slash Discord
- [ ] Statistiques des cycles
- [ ] @Mentions configurables par planète
- [ ] Serveur web pour voir l'état actuel

## 📜 Licence

MIT - Utilisez et modifiez librement !

## 🙏 Crédits

- **API WarframeStat** : [api.warframestat.us](https://api.warframestat.us)
- **GitHub Actions** : Hébergement gratuit
- **Discord.js** : Intégration Discord

---

**Bon jeu, Tenno !** 🎮

Des questions ? Consultez [GITHUB_DEPLOYMENT.md](GITHUB_DEPLOYMENT.md) pour le guide complet.

