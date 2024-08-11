LE MODULE `discord-backup` est à moitié bugué, voici son correctif (Androz, fais ton taff stp)

POUR MODIFIER LE MODULE, `node_modules` => `discord-backup`

1ER
remplacer la ligne 26 du fichier index.js se trouvant dans le dossier `lib` du module par :
```js
const backupData = require(`../../../${backups}${path_1.sep}${file}`);
```

2EME
remplacer la ligne 43 du fichier index.js se trouvant dans le dossier `lib` du module par :
```js
const size = (0, fs_1.statSync)(`${backups}${path_1.sep}${backupID}.json`).size; // Gets the size of the file using fs
```

3EME
remplacer les lignes 202 et 203 du fichier index.js se trouvant dans le dossier `lib` du module par :
```js
require(`../../../${backups}${path_1.sep}${backupID}.json`);
            (0, fs_1.unlinkSync)(path_1.join(__dirname, `/../../../${backups}${path_1.sep}${backupID}.json`));
```

C'EST TOUT POUR LES CHANGEMENTS DU MODULE

⚠️ N'oubliez pas de changer les infos dans le .env
