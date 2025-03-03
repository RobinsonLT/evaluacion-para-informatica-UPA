/******* SERIE 2 ****/
//creamos la tabla punteo_usuario en la base de datos
CREATE TABLE `punteo_usuario` (
  `id` int NOT NULL,
  `punteo` int DEFAULT NULL,
  `ingreso` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


