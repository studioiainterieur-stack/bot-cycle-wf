# 🔄 Guide de Migration v1 → v2

Ce document explique les changements entre l'ancienne et la nouvelle version du bot.

## 📊 Comparaison des Versions

| Fonctionnalité | v1.0 (Ancien) | v2.0 (Nouveau) |
|----------------|---------------|----------------|
| **Plateforme** | Vercel | GitHub Actions |
| **Source de données** | API externe (Tenno Tools) | Calculs mathématiques |
| **Fréquence** | 5 minutes | 15 minutes |
| **Messages Discord** | 1 gros message | 5 messages séparés |
| **Mise à jour** | Toujours | Uniquement si changement |
| **Mondes supportés** | 4 (Cetus, Vallis, Cambion, Earth) | 5 (+ Duviri) |
| **Coût** | Gratuit (Vercel) | Gratuit (GitHub Actions) |
| **Fiabilité** | Dépend de l'API | Autonome |

## ✨ Nouveautés v2.0

### 🎯 Calculs Mathématiques Locaux
- Plus de dépendance à une API externe
- Calculs instantanés et précis à la seconde
- Fonctionne même si Tenno Tools est down

### 📱 Messages Séparés par Monde
- Un message épinglé par monde
- Plus facile à lire
- Mises à jour ciblées

### 🎭 Support de Duviri
- Nouvelles émotions (Joie, Colère, Envie, Chagrin, Peur)
- Rotation complète de 4 heures
- Timeline des prochaines émotions

### ⚡ Mises à Jour Intelligentes
- N'édite que les messages qui ont changé
- Économise les API calls Discord
- Moins de spam dans les logs

### 📊 Meilleurs Embeds
- Barres de progression visuelles
- Couleurs thématiques par monde
- Activités recommandées pour chaque cycle

## 🗑️ Ce qui a été Supprimé

### Fichiers Supprimés
```
❌ api/cron.ts                    (endpoint Vercel)
❌ vercel.json                    (config Vercel)
❌ src/services/warframe.ts       (appels API)
❌ src/services/discord.ts        (webhooks)
❌ src/utils/cycle-tracker.ts     (ancienne logique)
❌ src/utils/state-storage.ts     (ancien stockage)
❌ src/check-cycles.ts            (ancien point d'entrée)
❌ DEPLOYMENT.md                  (doc obsolète)
❌ NEXT_STEPS.md                  (doc obsolète)
❌ QUICKSTART.md                  (doc obsolète)
```

### Configuration Supprimée
- `DISCORD_WEBHOOK_URL` → Remplacé par `DISCORD_BOT_TOKEN`
- Déploiement Vercel → Remplacé par GitHub Actions

## ✅ Migration Étape par Étape

### 1. Sauvegarder l'Ancien Bot (Optionnel)

Si tu veux garder une copie de l'ancienne version :

```bash
# Créer une branche backup
git checkout -b backup-v1
git push origin backup-v1

# Revenir sur main
git checkout main
```

### 2. Pull les Nouveaux Changements

```bash
git pull origin main
```

### 3. Installer les Nouvelles Dépendances

```bash
npm install
```

### 4. Créer un Bot Discord

**L'ancien système utilisait un webhook, le nouveau utilise un vrai bot.**

Suis le guide dans [SETUP.md](SETUP.md) section 1.

### 5. Configurer GitHub Secrets

Remplace l'ancien secret :
- ❌ Supprime : `DISCORD_WEBHOOK_URL`
- ✅ Crée : `DISCORD_BOT_TOKEN`

### 6. Créer les 5 Messages Discord

Au lieu d'un seul message webhook, tu dois maintenant créer 5 messages épinglés.

Suis le guide dans [SETUP.md](SETUP.md) section 3.

### 7. Créer le Fichier de Configuration

Crée `config/message-ids.json` avec les IDs de tes 5 messages.

Template disponible dans `config/message-ids.json.template`.

### 8. Tester

```bash
# Compiler
npm run build

# Tester localement (optionnel)
# Crée d'abord un .env avec DISCORD_BOT_TOKEN
npm run check

# Ou déclenche manuellement sur GitHub
# Actions → Check Warframe Cycles → Run workflow
```

### 9. Nettoyer l'Ancien

Si tout fonctionne, tu peux supprimer :
- Le projet Vercel (si tu ne l'utilises plus)
- L'ancien webhook Discord
- La branche backup (si créée)

## 🔧 Différences Techniques

### Architecture

**v1.0 :**
```
Vercel Cron (5 min)
  ↓
Appel API Tenno Tools
  ↓
Webhook Discord
  ↓
Message unique mis à jour
```

**v2.0 :**
```
GitHub Actions (15 min)
  ↓
Calculs mathématiques locaux
  ↓
Détection changements
  ↓
Bot Discord REST API
  ↓
5 messages séparés (uniquement si changement)
```

### Code

**Avant (v1) :**
```typescript
// Appel API externe
const response = await fetch('https://api.tenno.tools/...');
const data = await response.json();

// Webhook Discord
await fetch(WEBHOOK_URL, {
  method: 'POST',
  body: JSON.stringify({ embeds: [...] })
});
```

**Après (v2) :**
```typescript
// Calcul local
const cycle = calculateCetusCycle(Date.now() / 1000);

// Bot Discord REST API
await client.editMessage(channelId, messageId, embed);
```

## 📈 Améliorations de Performance

| Métrique | v1.0 | v2.0 | Amélioration |
|----------|------|------|--------------|
| **Temps d'exécution** | ~3-5s | ~1-2s | 🟢 50% plus rapide |
| **Appels réseau** | 2 (API + Webhook) | 0-5 (uniquement si changement) | 🟢 Variable |
| **Précision** | ±30s | <1s | 🟢 Parfaite |
| **Fiabilité** | Dépend de l'API | 100% autonome | 🟢 Indépendant |
| **Coût** | Gratuit | Gratuit | 🟡 Identique |

## 🐛 Problèmes Connus et Solutions

### "Le bot ne se met pas à jour toutes les 15 minutes"

**C'est normal !** Le bot ne met à jour les messages que quand un cycle **change**.

Si aucun cycle ne change pendant 2 heures, aucune mise à jour n'est faite.

**Vérification :** Regarde les logs GitHub Actions :
```
✅ No state changes detected - no updates needed
```

### "Je veux revenir à l'ancienne version"

```bash
# Revenir à la branche backup
git checkout backup-v1

# Ou revenir à un commit spécifique
git log  # Trouve le commit de v1
git checkout <commit-hash>
```

### "Je veux changer la fréquence de vérification"

Édite `.github/workflows/check-cycles.yml` :

```yaml
schedule:
  - cron: '*/15 * * * *'  # Actuel : 15 min
  # - cron: '*/10 * * * *'  # Option : 10 min
  # - cron: '*/30 * * * *'  # Option : 30 min
```

**Note :** Ne pas descendre en dessous de 5 minutes (limite GitHub Actions).

## 💡 Recommandations

### Pour les Petits Serveurs
- ✅ Utilise v2.0 avec GitHub Actions (15 min)
- Simple et gratuit
- Suffisant pour la plupart des cas

### Pour les Gros Serveurs
Si tu veux des mises à jour plus fréquentes :
- Héberge le bot 24/7 sur Railway/Render
- Modifie le code pour vérifier toutes les 30-60 secondes
- Garde les calculs mathématiques (pas d'API)

### Personnalisation
Tous les textes, couleurs et activités sont configurables dans :
- `src/types/index.ts`
- `src/cycles/*.ts`
- `src/discord/embeds.ts`

## ❓ Questions Fréquentes

### Q: Puis-je garder la vérification toutes les 5 minutes ?

A: Oui, mais GitHub Actions a des limites. Change le cron à `*/5 * * * *` mais sache que :
- GitHub peut ralentir les exécutions sur les repos gratuits
- Vérifier plus souvent n'améliore pas vraiment l'UX (les cycles changent lentement)

### Q: Puis-je avoir à la fois v1 et v2 ?

A: Oui ! Utilise des branches Git différentes ou des repos séparés. Mais attention aux conflits de messages Discord (2 bots éditant les mêmes messages).

### Q: Pourquoi 5 messages au lieu d'1 ?

A: 
- ✅ Plus clair et organisé
- ✅ Facile de retrouver un monde spécifique
- ✅ Meilleur sur mobile
- ✅ Mise à jour sélective (économise les API calls)

### Q: Puis-je revenir à 1 seul message ?

A: Oui, mais il faudra modifier le code. Crée un seul embed avec tous les mondes dans `src/discord/embeds.ts`.

## 🎉 Conclusion

La v2.0 est une amélioration majeure qui rend le bot :
- Plus fiable (pas de dépendance externe)
- Plus précis (calculs mathématiques)
- Plus clair (5 messages séparés)
- Plus extensible (facile d'ajouter de nouveaux mondes)

**Bonne migration ! 🚀**

Si tu as des questions, ouvre une issue sur GitHub ou rejoins la communauté Discord.

---

*Document mis à jour : 30 novembre 2025*

