BEGIN TRANSACTION;
DROP TABLE IF EXISTS "Chats";
CREATE TABLE "Chats" (
	"id"	INTEGER,
	"username_1"	TEXT NOT NULL,
	"username_2"	TEXT NOT NULL,
	"ult_mensaje"	TEXT,
	"fecha_ult"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
DROP TABLE IF EXISTS "Guardados";
CREATE TABLE "Guardados" (
	"user"	TEXT NOT NULL,
	"id"	INTEGER NOT NULL,
	PRIMARY KEY("user","id")
);
DROP TABLE IF EXISTS "Likes";
CREATE TABLE Likes (
    idPost INTEGER,
    idUsuario INTEGER,
    PRIMARY KEY (idPost, idUsuario),
    FOREIGN KEY (idPost) REFERENCES Posts(id) ON DELETE CASCADE,
    FOREIGN KEY (idUsuario) REFERENCES Usuarios(id) ON DELETE CASCADE
);
DROP TABLE IF EXISTS "Mensajes";
CREATE TABLE "Mensajes" (
	"id"	INTEGER,
	"id_chat"	INTEGER NOT NULL,
	"username"	TEXT NOT NULL,
	"fecha"	TEXT NOT NULL,
	"mensaje"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);
DROP TABLE IF EXISTS "Multimedia";
CREATE TABLE "Multimedia" (
	"post_id"	INTEGER NOT NULL,
	"pos"	INTEGER NOT NULL,
	"archivo"	TEXT NOT NULL,
	"texto"	TEXT DEFAULT NULL,
	PRIMARY KEY("post_id","pos"),
	FOREIGN KEY("post_id") REFERENCES "Posts"("id") ON DELETE CASCADE
);
DROP TABLE IF EXISTS "Posts";
CREATE TABLE Posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            creador_1 TEXT NOT NULL,
            creador_2 TEXT NOT NULL,
            creador_3 TEXT,
            creador_4 TEXT,
            creador_5 TEXT,
            fecha TEXT,
            likes INTEGER
        );
DROP TABLE IF EXISTS "Seguimiento";
CREATE TABLE "Seguimiento" (
	"seguidor"	TEXT NOT NULL,
	"seguido"	TEXT NOT NULL,
	PRIMARY KEY("seguidor","seguido")
);
DROP TABLE IF EXISTS "Usuarios";
CREATE TABLE "Usuarios" (
	"id"	INTEGER,
	"username"	TEXT NOT NULL UNIQUE,
	"password"	TEXT NOT NULL,
	"email"	TEXT NOT NULL,
	"rol"	TEXT NOT NULL CHECK("rol" IN ('U', 'A')),
	"fotoperfil"	TEXT,
	PRIMARY KEY("id")
);
COMMIT;
