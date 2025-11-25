# Démarrage Rapide - GitHub Actions 🚀

Configuration en 5 minutes chrono !

## Ce Dont Vous Avez Besoin

- Un compte GitHub (gratuit)
- Votre webhook Discord
- 5 minutes

## Étapes

### 1️⃣ Créer le Webhook Discord (2 min)

1. Discord → Votre Serveur → ⚙️ Paramètres
2. Intégrations → Webhooks → Nouveau Webhook
3. Choisir le salon pour les notifications
4. **Copier l'URL du webhook** 📋

### 2️⃣ Créer un Repository GitHub (1 min)

1. Aller sur [github.com/new](https://github.com/new)
2. Nom : `warframe-cycle-bot`
3. **Public** ✅ (pour Actions gratuites)
4. Créer

### 3️⃣ Pousser le Code (1 min)

```bash
cd /Users/zelenion/Desktop/BOT

git init
git add .
git commit -m "Bot Warframe"
git remote add origin https://github.com/VOTRE_USERNAME/warframe-cycle-bot.git
git branch -M main
git push -u origin main
```

### 4️⃣ Ajouter le Secret (1 min)

Sur GitHub :
1. **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret**
3. Nom : `DISCORD_WEBHOOK_URL`
4. Valeur : Coller votre webhook Discord
5. **Add secret**

### 5️⃣ Lancer ! (30 sec)

1. Onglet **Actions**
2. Activer les workflows si demandé
3. **Run workflow** → **Run workflow**
4. Attendre 30 secondes
5. ✅ Vérifier Discord !

## C'est Fait ! 🎉

Le bot tourne maintenant **automatiquement toutes les 5 minutes** !

## Vérifier Que Ça Marche

### Voir les Logs
1. Actions → Dernier run
2. Cliquez dessus → Logs

Vous devriez voir :
```
⏰ Cycle check started
📡 Fetching cycle data...
📊 Fetched 4 cycles
✅ Cycle check completed
```

### Première Notification
- Le bot détecte les cycles au premier run
- Il enverra une notification au **prochain changement** de cycle
- Patience ! Les cycles durent 50min-4h selon la planète

## Changer la Fréquence

Éditer `.github/workflows/check-cycles.yml` :

```yaml
# Toutes les 5 minutes (actuel)
- cron: '*/5 * * * *'

# Toutes les 10 minutes
- cron: '*/10 * * * *'
```

Puis :
```bash
git add .github/workflows/check-cycles.yml
git commit -m "Changement fréquence"
git push
```

## Coût

**0€ - Totalement gratuit !** 💰

- GitHub Actions : 2000 minutes/mois gratuites
- Votre bot utilise : ~150 minutes/mois
- **Vous utilisez 7.5% de votre quota** ✅

## Problèmes ?

### Pas de notification ?
- Attendez qu'un cycle change réellement
- Vérifiez les logs dans Actions
- Le webhook Discord est correct ?

### Workflow ne se lance pas ?
- Repository est public ?
- Actions sont activées ?
- Secret `DISCORD_WEBHOOK_URL` existe ?

### Tester Manuellement
Actions → Check Warframe Cycles → Run workflow

## Documentation Complète

- **[GITHUB_DEPLOYMENT.md](GITHUB_DEPLOYMENT.md)** - Guide détaillé
- **[README.md](README.md)** - Documentation complète

---

**Enjoy!** 🎮 Votre bot surveille maintenant les cycles Warframe 24/7 !

