# Déploiement sur GitHub (100% Gratuit) 🚀

Ce guide vous montre comment déployer votre bot Warframe sur GitHub Actions - **complètement gratuit** avec des cron jobs toutes les 5 minutes !

## Pourquoi GitHub Actions ?

- ✅ **100% Gratuit** - 2000 minutes/mois gratuites
- ✅ **Cron jobs illimités** - Toutes les 5 minutes sans problème
- ✅ **Pas de carte bancaire** requise
- ✅ **Simple à configurer**

## Étapes de Déploiement

### 1. Créer un Repository GitHub

1. Allez sur [github.com](https://github.com)
2. Cliquez sur **New repository**
3. Nommez-le : `warframe-cycle-bot`
4. Mettez-le en **Public** (pour Actions gratuites)
5. **Ne cochez PAS** "Add README" (vous avez déjà les fichiers)
6. Cliquez **Create repository**

### 2. Pousser Votre Code sur GitHub

Dans votre terminal :

```bash
cd /Users/zelenion/Desktop/BOT

# Initialiser git (si pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Faire le premier commit
git commit -m "Initial commit - Warframe cycle bot"

# Lier au repository GitHub (remplacez USERNAME par votre nom d'utilisateur)
git remote add origin https://github.com/USERNAME/warframe-cycle-bot.git

# Pousser le code
git branch -M main
git push -u origin main
```

### 3. Ajouter le Secret Discord Webhook

Le webhook Discord doit être ajouté comme secret pour la sécurité.

1. Sur GitHub, allez dans votre repository
2. Cliquez sur **Settings** (onglet en haut)
3. Dans le menu de gauche : **Secrets and variables** → **Actions**
4. Cliquez **New repository secret**
5. Configurez :
   - **Name:** `DISCORD_WEBHOOK_URL`
   - **Secret:** Collez votre URL webhook Discord
6. Cliquez **Add secret**

### 4. Activer GitHub Actions

1. Dans votre repository, allez à l'onglet **Actions**
2. Si demandé, cliquez **I understand my workflows, go ahead and enable them**
3. Vous devriez voir le workflow "Check Warframe Cycles"

### 5. Tester le Workflow

#### Test Manuel (Immédiat)

1. Allez dans **Actions** → **Check Warframe Cycles**
2. Cliquez **Run workflow** → **Run workflow**
3. Attendez ~30 secondes
4. Le workflow s'exécute et vous verrez les logs
5. Vérifiez Discord pour voir si ça marche !

#### Test Automatique

Le bot s'exécute maintenant **automatiquement toutes les 5 minutes** ! 🎉

### 6. Vérifier les Logs

Pour voir ce qui se passe :

1. Allez dans **Actions**
2. Cliquez sur un run (par exemple le plus récent)
3. Cliquez sur **check-cycles**
4. Vous verrez les logs :
   ```
   ⏰ Cycle check started: 2024-11-25T12:00:00.000Z
   📡 Fetching cycle data from WarframeStat API...
   📊 Fetched 4 cycles: cetus=day, vallis=night, cambion=day, earth=night
   🔍 Checking for cycle changes...
   ✅ No cycle changes detected
   ✅ Cycle check completed successfully
   ```

## Comment Ça Marche ?

### Workflow GitHub Actions

Le fichier `.github/workflows/check-cycles.yml` :

```yaml
# S'exécute toutes les 5 minutes
schedule:
  - cron: '*/5 * * * *'
```

### Stockage des États

- Les états des cycles sont sauvegardés dans `.cycle-states.json`
- Ce fichier est **commité automatiquement** par GitHub Actions
- Permet de détecter les changements entre les exécutions

### Processus

1. **Toutes les 5 minutes** : GitHub Actions lance le workflow
2. **Checkout** : Récupère le code et le fichier d'état
3. **Build** : Compile le TypeScript
4. **Run** : Exécute le script de vérification
5. **Commit** : Sauvegarde le nouvel état (si changé)
6. **Notification** : Envoie Discord webhook si cycle a changé

## Configuration

### Changer la Fréquence

Éditez `.github/workflows/check-cycles.yml` :

```yaml
schedule:
  # Toutes les 5 minutes (actuel)
  - cron: '*/5 * * * *'
  
  # Toutes les 10 minutes
  # - cron: '*/10 * * * *'
  
  # Toutes les 15 minutes
  # - cron: '*/15 * * * *'
```

Après modification, commit et push :
```bash
git add .github/workflows/check-cycles.yml
git commit -m "Change cron schedule"
git push
```

### Ajouter des Notifications

Le bot commit automatiquement les changements d'état. Si vous voulez désactiver ça, vous pouvez modifier le workflow.

## Monitoring

### Voir l'Historique

- **Actions** tab : Tous les runs passés
- Chaque run a ses logs complets
- Vous pouvez voir si/quand des notifications ont été envoyées

### Recevoir des Alertes d'Erreur

GitHub peut vous envoyer un email si un workflow échoue :

1. Settings → Notifications
2. Cochez "GitHub Actions"

## Dépannage

### Le workflow ne se lance pas

**Vérifiez :**
- Repository est **public** (obligatoire pour Actions gratuites)
- Actions sont activées (onglet Actions)
- Le fichier `.github/workflows/check-cycles.yml` existe

### Pas de notifications Discord

**Vérifiez :**
- Secret `DISCORD_WEBHOOK_URL` est bien configuré
- L'URL du webhook est correcte
- Regardez les logs du workflow pour les erreurs
- Le cycle doit **vraiment changer** pour envoyer une notification

### Erreur "Resource not accessible"

- Assurez-vous que le repository est **public**
- Ou activez Actions dans Settings → Actions → General

### Erreur de build

```bash
# Testez localement d'abord
npm install
npm run build
npm run check:local
```

## Limites Gratuites

### GitHub Actions (Plan Gratuit)

- ✅ **2000 minutes/mois** d'exécution
- ✅ **Repositories publics : ILLIMITÉ** 🎉
- ✅ Cron jobs sans restriction

### Utilisation de Votre Bot

**Avec cron toutes les 5 minutes :**
```
Exécutions/jour : 288
Durée/exécution : ~30 secondes
Total/mois : 144 minutes/mois

Conclusion : Largement en dessous de 2000 minutes !
```

## Coût Total : 0€ 💰

Ce setup est **100% gratuit** et le restera indéfiniment tant que :
- Le repository est public
- Vous utilisez moins de 2000 minutes/mois (vous en utilisez ~150)

## Next Steps

Une fois déployé :

1. ✅ Attendez 5 minutes et vérifiez les Actions
2. ✅ Vérifiez Discord pour les notifications
3. ✅ Personnalisez les messages dans `src/services/discord.ts`
4. ✅ Ajustez la fréquence si nécessaire

## Commandes Utiles

```bash
# Tester localement
npm run check:local

# Voir les logs du dernier commit
git log -1

# Forcer un push (si problème)
git push --force-with-lease

# Voir le statut git
git status
```

## Alternative : Garder le Repository Privé

Si vous voulez un repository **privé** :
- Vous avez 2000 minutes/mois gratuites
- Votre bot utilise ~150 minutes/mois
- **Toujours gratuit !** ✅

Pour rendre privé :
1. Settings → General
2. Scrollez en bas → Danger Zone
3. Change visibility → Make private

---

**C'est tout !** Votre bot tourne maintenant gratuitement sur GitHub ! 🎮🚀

