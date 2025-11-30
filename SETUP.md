# 🚀 Guide de Configuration Détaillé

Guide pas-à-pas pour configurer le Warframe Cycle Bot de A à Z.

## 📋 Table des matières

1. [Créer le Bot Discord](#1-créer-le-bot-discord)
2. [Configurer GitHub](#2-configurer-github)
3. [Créer les Messages Discord](#3-créer-les-messages-discord)
4. [Configurer le Bot](#4-configurer-le-bot)
5. [Activer et Tester](#5-activer-et-tester)
6. [Dépannage](#6-dépannage)

---

## 1. Créer le Bot Discord

### Étape 1.1 : Créer l'Application

1. Va sur https://discord.com/developers/applications
2. Clique sur **"New Application"** (en haut à droite)
3. Donne un nom : `Warframe Cycle Tracker`
4. Accepte les conditions et clique **"Create"**

### Étape 1.2 : Configurer le Bot

1. Dans le menu de gauche, clique sur **"Bot"**
2. Clique sur **"Add Bot"** → **"Yes, do it!"**
3. **Optionnel** : Change l'icône et le nom du bot
4. Sous "Privileged Gateway Intents", active :
   - ✅ **Server Members Intent**
   - ✅ **Message Content Intent**
5. Clique **"Save Changes"**

### Étape 1.3 : Copier le Token

1. Sous "TOKEN", clique sur **"Reset Token"**
2. Copie le token (il ressemble à : `MTA1NjY5ODc4ODg1Mzk1...`)
3. ⚠️ **GARDE-LE SECRET** - Ne le partage JAMAIS !
4. Sauvegarde-le temporairement dans un fichier texte sécurisé

### Étape 1.4 : Inviter le Bot sur ton Serveur

1. Dans le menu de gauche, clique sur **"OAuth2"** → **"URL Generator"**
2. Dans **SCOPES**, sélectionne :
   - ✅ `bot`
3. Dans **BOT PERMISSIONS**, sélectionne :
   - ✅ `Send Messages`
   - ✅ `Embed Links`
   - ✅ `Read Message History`
   - ✅ `Manage Messages`
4. Copie l'URL générée en bas
5. Ouvre l'URL dans un navigateur
6. Sélectionne ton serveur Discord
7. Clique **"Autoriser"**

---

## 2. Configurer GitHub

### Étape 2.1 : Fork le Repository

1. Va sur https://github.com/VOTRE_USERNAME/warframe-cycle-bot
2. Clique sur **"Fork"** (en haut à droite)
3. Attends que le fork se termine

### Étape 2.2 : Ajouter le Token Discord

1. Dans ton repository forké, va dans **"Settings"**
2. Dans le menu de gauche : **"Secrets and variables"** → **"Actions"**
3. Clique **"New repository secret"**
4. Remplis :
   - **Name** : `DISCORD_BOT_TOKEN`
   - **Secret** : Colle le token copié à l'étape 1.3
5. Clique **"Add secret"**

---

## 3. Créer les Messages Discord

### Étape 3.1 : Activer le Mode Développeur

1. Dans Discord, va dans **Paramètres Utilisateur** (⚙️)
2. **Avancé** → Active **"Mode développeur"**
3. Ferme les paramètres

### Étape 3.2 : Choisir un Canal

1. Choisis ou crée un canal dédié (ex: `#warframe-cycles`)
2. Clic droit sur le canal → **"Copier l'identifiant"**
3. Sauvegarde cet ID (c'est le `channelId`)

### Étape 3.3 : Créer les 5 Messages

Dans le canal choisi, envoie ces 5 messages (un par un) :

```
🌅 Cetus - Configuration en cours...
```

```
🏔️ Fortuna - Configuration en cours...
```

```
🦠 Deimos - Configuration en cours...
```

```
🌍 Earth - Configuration en cours...
```

```
🎭 Duviri - Configuration en cours...
```

### Étape 3.4 : Épingler les Messages

Pour chaque message :
1. Clic droit sur le message
2. **"Épingler le message"**
3. Répète pour les 5 messages

### Étape 3.5 : Copier les IDs

Pour chaque message :
1. Clic droit sur le message
2. **"Copier l'identifiant"**
3. Note l'ID quelque part (ex: Bloc-notes)

Tu devrais avoir :
```
Channel ID: 1234567890123456789
Cetus ID:   1234567890123456790
Vallis ID:  1234567890123456791
Cambion ID: 1234567890123456792
Earth ID:   1234567890123456793
Duviri ID:  1234567890123456794
```

---

## 4. Configurer le Bot

### Étape 4.1 : Créer le Fichier de Configuration

1. Dans ton repository GitHub, crée le fichier : `config/message-ids.json`
2. Utilise ce template (remplace les valeurs) :

```json
{
  "channelId": "TON_CHANNEL_ID",
  "messages": {
    "cetus": "ID_MESSAGE_CETUS",
    "vallis": "ID_MESSAGE_VALLIS",
    "cambion": "ID_MESSAGE_CAMBION",
    "earth": "ID_MESSAGE_EARTH",
    "duviri": "ID_MESSAGE_DUVIRI"
  }
}
```

### Exemple Rempli :

```json
{
  "channelId": "1234567890123456789",
  "messages": {
    "cetus": "1234567890123456790",
    "vallis": "1234567890123456791",
    "cambion": "1234567890123456792",
    "earth": "1234567890123456793",
    "duviri": "1234567890123456794"
  }
}
```

### Étape 4.2 : Commit le Fichier

1. Clique **"Commit new file"**
2. Message : `Add message IDs configuration`
3. Clique **"Commit changes"**

---

## 5. Activer et Tester

### Étape 5.1 : Activer GitHub Actions

1. Va dans l'onglet **"Actions"** de ton repository
2. Si demandé, clique **"I understand my workflows, go ahead and enable them"**

### Étape 5.2 : Installer les Dépendances

GitHub Actions doit compiler le code. Attends quelques minutes la première fois.

### Étape 5.3 : Lancer le Premier Test

1. Dans **"Actions"**, clique sur **"Check Warframe Cycles"**
2. Clique **"Run workflow"** → **"Run workflow"**
3. Attends 1-2 minutes

### Étape 5.4 : Vérifier les Résultats

1. Clique sur l'exécution en cours (cercle jaune 🟡)
2. Clique sur **"check-cycles"**
3. Regarde les logs :

**✅ Succès si tu vois :**
```
✅ All cycles calculated
✅ Message IDs configuration valid
📝 Updating Discord messages...
✅ Cycle check completed successfully!
```

**❌ Erreur si tu vois :**
```
❌ Configuration validation failed
❌ Failed to edit message
```

### Étape 5.5 : Vérifier Discord

1. Va dans ton canal Discord
2. Les 5 messages épinglés devraient être mis à jour avec les vrais cycles !

**Exemple de ce que tu devrais voir :**

```
🌅 CETUS - PLAINES D'EIDOLON
C'est la nuit ! Les Eidolons sont actifs...
⏰ Temps restant : 15m 25s
[████████░░░░░░░░] 45%
```

---

## 6. Dépannage

### ❌ Erreur : "DISCORD_BOT_TOKEN is not set"

**Solution :**
1. Va dans Settings → Secrets → Actions
2. Vérifie que `DISCORD_BOT_TOKEN` existe
3. Si non, crée-le (étape 2.2)

---

### ❌ Erreur : "config/message-ids.json not found"

**Solution :**
1. Vérifie que le fichier existe : `config/message-ids.json`
2. Vérifie le nom exact (pas `.json.template`)
3. Crée-le si manquant (étape 4.1)

---

### ❌ Erreur : "Failed to edit message: 403"

**Causes possibles :**

1. **Le bot n'a pas les permissions**
   - Solution : Donne au rôle du bot les permissions nécessaires

2. **Les IDs de messages sont incorrects**
   - Solution : Vérifie que les IDs dans `config/message-ids.json` sont corrects
   - Astuce : Les IDs sont de longs nombres (18-19 chiffres)

3. **Le bot n'est pas dans le serveur**
   - Solution : Réinvite le bot (étape 1.4)

---

### ❌ Erreur : "Failed to edit message: 404"

**Cause :** Les messages ont été supprimés ou les IDs sont incorrects

**Solution :**
1. Recrée les 5 messages (étape 3.3)
2. Copie les nouveaux IDs (étape 3.5)
3. Mets à jour `config/message-ids.json` (étape 4.1)

---

### ✅ Aucune erreur mais les messages ne se mettent pas à jour

**C'est normal si :** Aucun cycle n'a changé depuis le dernier check

Le bot n'édite les messages que quand un cycle **change d'état**.

**Pour forcer une mise à jour :**
1. Supprime le fichier `states/cycle-states.json`
2. Lance le workflow manuellement
3. Tous les messages seront mis à jour

---

### ⏰ Le bot ne vérifie pas toutes les 15 minutes

**Vérifications :**

1. **GitHub Actions est activé ?**
   - Va dans Actions → Vérifie qu'il n'y a pas de message d'avertissement

2. **Le cron est correct ?**
   - Ouvre `.github/workflows/check-cycles.yml`
   - Vérifie : `cron: '*/15 * * * *'`

3. **Le repository est public ?**
   - Les repos privés ont des limitations sur les Actions gratuites

---

## 🎉 Configuration Terminée !

Ton bot devrait maintenant :
- ✅ Vérifier les cycles toutes les 15 minutes
- ✅ Mettre à jour les messages Discord automatiquement
- ✅ Afficher les 5 mondes Warframe en temps réel

**Prochaines étapes :**
- Personnalise les couleurs et descriptions dans `src/types/index.ts`
- Ajuste la fréquence dans `.github/workflows/check-cycles.yml`
- Partage le canal avec ta communauté !

---

## 📞 Besoin d'Aide ?

- 📖 Lis le [README.md](README.md) principal
- 🐛 Ouvre une [Issue GitHub](https://github.com/VOTRE_USERNAME/warframe-cycle-bot/issues)
- 💬 Demande dans la communauté Warframe

**Bon jeu, Tenno ! 🎮**

