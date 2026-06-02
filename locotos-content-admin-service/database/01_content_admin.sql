CREATE DATABASE IF NOT EXISTS StreamingDB_Content;
USE StreamingDB_Content;

CREATE TABLE IF NOT EXISTS Contenido (
  id_contenido INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(180) NOT NULL,
  tipo ENUM('Pelicula', 'Serie') NOT NULL DEFAULT 'Pelicula',
  genero VARCHAR(80) NOT NULL,
  anio INT,
  director VARCHAR(140),
  autor VARCHAR(140),
  temporadas INT NULL,
  reparto JSON,
  sinopsis TEXT,
  trailer_url VARCHAR(500),
  poster VARCHAR(500),
  duracion VARCHAR(60),
  calificacion VARCHAR(10),
  reproducciones INT NOT NULL DEFAULT 0,
  fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_contenido_genero (genero),
  INDEX idx_contenido_reproducciones (reproducciones)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS Reproduccion (
  id_reproduccion INT AUTO_INCREMENT PRIMARY KEY,
  id_contenido INT NOT NULL,
  fecha_reproduccion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reproduccion_contenido
    FOREIGN KEY (id_contenido) REFERENCES Contenido(id_contenido)
    ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO Contenido
  (titulo, tipo, genero, anio, director, autor, temporadas, reparto, sinopsis, trailer_url, poster, duracion, calificacion, reproducciones)
VALUES
  ('La Ruta del Locoto', 'Pelicula', 'Aventura', 2024, 'Valeria Quiroga', 'Mario Salazar', NULL, JSON_ARRAY('Ana Rojas', 'Luis Peredo', 'Camila Arce'), 'Una cocinera recorre Bolivia para recuperar una receta familiar antes de que se pierda para siempre.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80', '1h 48m', '8.4', 124),
  ('Cordillera Roja', 'Serie', 'Aventura', 2023, 'Andres Baldiviezo', 'Elena Vargas', 2, JSON_ARRAY('Diego Molina', 'Noelia Paz', 'Ruben Choque'), 'Un equipo de rescate enfrenta tormentas, secretos y decisiones limite en la zona andina.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=600&q=80', '8 episodios', '8.1', 98),
  ('Codigo Salar', 'Pelicula', 'Suspenso', 2025, 'Nicolas Pinto', 'Sofia Mercado', NULL, JSON_ARRAY('Marcos Linares', 'Paola Guzman', 'Hugo Rios'), 'Una analista descubre una red de datos ocultos bajo una operacion minera aparentemente normal.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80', '2h 03m', '8.7', 183),
  ('Archivo 16', 'Serie', 'Suspenso', 2022, 'Renata Suarez', 'Tomas Villca', 1, JSON_ARRAY('Lucia Flores', 'Esteban Calle', 'Mara Ibarra'), 'Una periodista reabre un caso archivado y encuentra pruebas que cambian toda la historia.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=600&q=80', '6 episodios', '7.9', 77),
  ('Domingos de Barrio', 'Serie', 'Comedia', 2024, 'Carla Mamani', 'Pedro Aponte', 3, JSON_ARRAY('Javier Soria', 'Daniela Arias', 'Oscar Terceros'), 'Una familia intenta administrar una tienda vecinal mientras cada domingo trae un problema nuevo.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80', '10 episodios', '8.0', 141),
  ('Plan Casi Perfecto', 'Pelicula', 'Comedia', 2021, 'Gabriel Aramayo', 'Laura Ribera', NULL, JSON_ARRAY('Bruno Lopez', 'Adriana Torrico', 'Mateo Vaca'), 'Dos amigos preparan una sorpresa que sale mal en cada paso, hasta convertir la ciudad en su escenario.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80', '1h 35m', '7.6', 63);
