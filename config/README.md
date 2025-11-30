# 📁 Configuration Directory

Ce dossier contient les fichiers de configuration du bot.

## 📄 Fichiers

### `message-ids.json` ✅
**Fichier de configuration principal** contenant les IDs des messages Discord.

**Statut : Configuré**
- Channel ID : `1362594845440479473`
- 5 messages configurés

**Ne pas supprimer ce fichier !**

### `message-ids.json.template`
Template de référence pour la configuration.

**Usage :** Si tu dois reconfigurer le bot, copie ce template vers `message-ids.json`.

---

## 🔄 Comment Mettre à Jour

Si tu dois changer les messages Discord :

1. **Créer 5 nouveaux messages** dans Discord
2. **Épingler** chaque message
3. **Copier les IDs** (clic droit → Copier l'identifiant)
4. **Éditer** `message-ids.json` avec les nouveaux IDs
5. **Commit et push** les changements

---

## ⚠️ Important

- `message-ids.json` est **ignoré par git** (dans `.gitignore`)
- Ne commit **jamais** ce fichier en public (il contient tes IDs Discord)
- Garde une copie locale de sauvegarde

