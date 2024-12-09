Projet de Réseau Social Technique

**Description**

-Ce projet est un test technique visant à créer un site de réseau social avec plusieurs fonctionnalités. Le site est entièrement responsive et ne fait pas usage de frameworks CSS comme Bootstrap ou Tailwind. L'organisation des fichiers et des classes CSS est un critère important pour ce projet.

**Exigences Techniques**
_Pages à créer_

**Page de Feed**

Affichage de posts (texte ou photo + texte) ajoutés à partir d’un fichier JSON en utilisant la gestion du DOM.
Tous les articles (texte et photos) doivent avoir les mêmes formats et clés JSON, simulant ainsi le retour d’une API.
-Fonctionnalités :

Réagir aux posts (Like / Dislike / Love) avec une animation de particules pour chaque réaction.
Commenter les posts et les commentaires.
Afficher la photo en plein écran si le post en contient une.

**Page de Messagerie**

Affichage d’une liste de conversations, gérée dynamiquement via le DOM depuis un fichier JSON pour simuler une API ou websocket.
-Fonctionnalités :
Afficher le dernier message de chaque conversation.
Afficher le détail d’une conversation avec un historique de messages.
Gestion des messages en JSON (ne développer qu’un seul côté de la conversation).
Affichage d’horodatage, nom, photo de profil de l’expéditeur, et contenu du message.
Envoi de nouveaux messages qui s’ajoutent à la fois dans le JSON et sur l’interface.

**Page de Liste d’Amis**

Pas besoin de JSON (amis codés en dur).
L'HTML et CSS doivent présenter une redondance dans les classes CSS des amis.
-Fonctionnalités :
Filtrer les amis par nom et prénom.
Lien vers la messagerie depuis chaque ligne d’ami.
Implémenter une fonction de "drag and drop" pour réorganiser la liste d’amis.
Instructions de Rendu
Le travail devra être rendu sur un dépôt Git.
Commits réguliers avec un descriptif suffisant et des titres clairs pour suivre l'évolution du projet.

**Fonctionnalités Implémentées**

-Page de Feed

Affichage des Posts : Les posts sont affichés à partir d'un fichier JSON et gérés dynamiquement via le DOM.
Réactions aux Posts : Possibilité de réagir aux posts avec des animations de particules pour chaque réaction (Like, Dislike, Love).
Commentaires : Possibilité de commenter les posts et les commentaires.
Affichage en Plein Écran : Les photos des posts peuvent être affichées en plein écran.

-Page de Messagerie

Liste de Conversations : Affichage dynamique de la liste des conversations à partir d'un fichier JSON.
Détail des Conversations : Affichage du dernier message de chaque conversation et du détail d'une conversation avec un historique de messages.
Envoi de Messages : Possibilité d'envoyer de nouveaux messages qui s'ajoutent à la fois dans le JSON et sur l'interface.

-Page de Liste d’Amis

Filtrage des Amis : Possibilité de filtrer les amis par nom et prénom.
Lien vers la Messagerie : Lien vers la messagerie depuis chaque ligne d’ami.
Drag and Drop : Fonction de "drag and drop" pour réorganiser la liste d’amis.

**Comment Utiliser**

-Cloner le dépôt :

git clone <https://github.com/Christelleca/Social-network.git>

-Lancer le projet :
Ouvrez le fichier index.html dans votre navigateur pour accéder à la page de feed. Les autres pages peuvent être accédées via les liens de navigation.
