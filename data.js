// data.js
// AL ADJUNTAR LAS VARIABLES A 'window', SE CONVIERTEN EN GLOBALES
// Y EL script.js PUEDE ACCEDER A ELLAS.

// ====================================================================================
// 1. DATOS DINÁMICOS POR CLASE
//    Formato: "Nombre|Nivel" (0=Nuevo, 1=Veterano/Estándar)
// ====================================================================================

window.ALUMNOS_POR_CLASE = {
    "Lunes": [
        "Alba|0", "Andrea|1", "Beatriz|1", "Beatriz Law|1", "Elena|1", 
        "Estela|1", "Jesús|0", "Lucía|0", "María|0", "Marta|1", 
        "Patricia|1", "Raquel|0", "Victoria|0", "Yolanda|1"
    ],
    "Martes": [
        "Ainhoa|0", "AnaG|1", "Cris|1", "Carlos 1|1", "Judith|1", 
        "Carlos 2|1", "Marcos|1", "Marta|1", "Maite|1", "Nerea|1", 
        "Pablo|1", "Samira|1", "Sofía|1"
    ],
    "Miércoles": [
        "Bea|1", "Chuchi|1", "Elenita|1", "Esther|1", "Isa|1", 
        "Isra|1", "María|1", "Natalia|1", "Paloma|1", "Yesi|1"
    ],
    "Jueves 5": [
        "Alex|0", "David|0", "Elena|1", "Félix|1", "Fuen|1", 
        "Gema|1", "Héctor|1", "Irene|1", "Sara|1"
    ],
    "Jueves 7": [
        "Ángeles|0", "Aroa|0", "Beloki|1", "Elena|1", "Jesús|1", 
        "María|1", "Paula|1", "Pilar|1", "Raúl|1", "Rosa|1", "Virgi|1"
    ],
    "Viernes": [
        "Rubén|0", "Lucía|0", "Guillermo|1", "Marina|1", "Álvaro|1", 
        "Cristina|1", "Jorge|1", "Silvia|1"
    ]
};

// ====================================================================================
// 2. LISTAS DE IMPRO
//    Usa saltos de línea y sigue separando los elementos SÓLO con una coma (,)
// ====================================================================================

window.lugares = `
    

Parque de atracciones,Desierto,Parque de atracciones fantasma,Nube acolchada,Agujero negro,Safari,Coche abandonado,Iglesia,Mundo de Lego,Casa del terror,Río,Estación de tren sin vías,Estrella fugaz,Estación orbital,Mercado callejero,Carpa de circo,Cementerio,Universo paralelo,Lago de fuego,Lago,Coliseo romano,Flor carnívora,Puerta interdimensional,Templo budista,Mansión,Banco,Armario encantado,Árbol de cristal,Cueva,Pirámides de Egipto,Espejo mágico,Colonia espacial,Mezquita,Torreón,Ayuntamiento,Nevera gigante,Baño,Cascada,Muralla china,Ciudad fantasma,Dentro de un huevo,Sinagoga,Prisión de máxima seguridad,Playa,Televisión por dentro,Garaje,Volcán,Autobús escolar,Sala de arena movediza,En una canción,Basílica,Isla volcánica,Montaña,Interior de un videojuego,Oficina,Acantilado,Machu Picchu,Bosque de árboles parlantes,Página de un libro,Catacumbas,Foso de cocodrilos,Bosque,Circo abandonado,Escuela,Campo de flores,Avión estrellado,Campo de relojes derretidos,Bolso sin fondo,Oasis,Muralla medieval,Selva,Sala de espejos infinitos,Biblioteca,Granja,Palacio real,Ciudad de gatos,Cajón del olvido,Monasterio,Campo de refugiados,Habitación de hotel,Atalaya,Supermercado,Viñedo,Cueva prehistórica,Ciudad subterránea,Tejado de cristal,Palacio de hielo,Refugio de montaña,Vestuario,Mirador,Parque,Invernadero,Campo de batalla medieval,Teatro bajo el mar,Ciudad flotante,Galería de arte,Peluquería,Base secreta,Plaza,Parque acuático,Castillo embrujado,Cementerio de robots,Feria de monstruos,Torre transparente,Trastero,Spa,Laboratorio clandestino,Cine,Glaciar,Laboratorio,Biblioteca viviente,Dentro de una lágrima,Cúpula de cristal,Desván,Sauna,Mundo postapocalíptico,Teatro,Polo Norte,Fábrica,Planeta de helado,Fondo del mar de arena,Ciudad bajo tierra,Sótano,Balneario,Refugio nuclear,Restaurante,Circo,Central eléctrica,Calle hecha de chocolate,Callejón oscuro,Mercado intergaláctico,Bodega,Zapato gigante,Marte,Cafetería,Isla desierta,Planta nuclear,Mundo al revés,Azotea,Autobús volador,Casa en ruinas,Piel de dragón,Luna,Bar,Barco,Estudio de grabación,Isla en un frasco,Rascacielos,Colegio virtual,Espacio onírico,Montaña que canta,Tienda de antigüedades,Discoteca,Submarino,Plató de cine,Castillo de naipes,Puente colgante,Sala de realidad aumentada,Laberinto,Desierto de hielo,Rastro,Panadería,Avión,Estación de radio,Pista de atletismo,Túnel,Cápsula del tiempo,Ruinas arqueológicas,Mar de lava,Mercado medieval,Tienda de ropa,Helicóptero,Torre de control,Cancha de baloncesto,Aparcamiento,Edificio inteligente,Plaza de toros,Campo de plumas,Taller de artistas,Farmacia,Cohete espacial,Centro comercial,Campo de fútbol,Tráfico eterno,En un chicle mascado,Establo,Isla de niebla,Biblioteca futurista,Hospital,Estación espacial,Tienda de cómics,Campo de golf,Cabina telefónica,Dentro de una lavadora,Arena de gladiadores,Volcán dormido,Sala de conciertos,Comisaría,Nave extraterrestre,Parque infantil,Tatami,Andén,Cama elástica infinita,Faro abandonado,Jardín eterno,Backstage,Estación de tren,Caravana,Ring de boxeo,Fuente,Nevera parlante,Sala de espera,Estepa infinita,Cámara acorazada,Aeropuerto,Tren bala,Colegio abandonado,Circuito de Fórmula 1,Baño portátil,Baño de oro,Taquilla,Hotel,Carretera que nunca acaba,Metro,Tiovivo,Universidad,Skatepark,Contenedor de basura,Castillo de arena gigante,Vestíbulo,Hostal,Biblioteca de los sueños,Autobús,Dentro de una tostadora,Bosque encantado,Pista de esquí,Nevera vacía,Caja de cerillas,Orfanato,Camping,Castillo en las nubes,Gasolinera,Estómago de ballena,Biblioteca secreta,Pista de patinaje,Armario ropero,Cajón de calcetines,Guardería,Museo,Isla flotante,Taller mecánico,Planeta de chicle,Sala de ordenadores,Playa nudista,Maleta perdida,Dentro de un volcán,Aula vacía,Cárcel,Mina,Gimnasio,Ciudad bajo el mar,Club social,Faro,Lavandería,Globo aerostático pinchado,Taller de coches,Sala de juicios,Pozo,Estadio,Casa inflable,Estación de bomberos,Gruta escondida,Cajero automático,Zoológico,Cocina industrial,Despacho presidencial,Árbol gigante,Piscina,Feria de pueblo,Aeródromo,Pantano,Supermercado 24h,Acuario,Refugio secreto,Sala de profesores,Cementerio de trenes,Cabaña en el lago,Embarcadero,Espacio de Coworking,Torre de vigilancia



`.split(",").map(item => item.trim()).filter(item => item.length > 0); 
// Nota: Se añade .map/.filter para limpiar espacios y líneas vacías creadas por la tabulación.

window.personajes = `
    

Abeja,Abogado,Acrobata,Actor,Adivino,Adolf Hitler,Agricultor,Albañil,Albert Einstein,Alcalde,Alejandro Magno,Alfarero,Alienígena,Alquimista,Ama de llaves,Anciano,Araña,Arqueólogo,Arquitecto,Artista surrealista,Astrólogo,Astronauta,Azafata,Bad Bunny,Bailarín,Ballena,Baloncestista,Banquero,Barbero,Barrendero,Beyoncé,Bibliotecario,Biólogo,Bombero,Brad Pitt,Bruja,Buzo,Caballero Jedi,Caballero medieval,Camarógrafo,Cangrejo,Cantante,Cantinero,Capitán de barco,Carnicero,Carpintero,Cartero,Cazador de fantasmas,Cerrajero,Charles Darwin,Charlie Chaplin,Chico del barrio,Chófer,Ciclista,Científico,Cleopatra,Cocinero,Comediante,Conde,Conductor,Conejo,Corredor,Cristiano Ronaldo,Cristóbal Colón,Cura,Decorador,Delfín,Dependiente,Dentista,Deportista,Detective,DJ,Doctor,Domador,Dragón,Electricista,Elefante,Elon Musk,Empresario,Enfermero,Entrenador,Escritor,Escultor,Esgrimista,Estrella de cine,Estrella de rock,Estudiante,Explorador,Extraterrestre,Fantasma,Florista,Fontanero,Fotógrafo,Freddie Mercury,Frida Kahlo,Frutero,Futbolista,Ganadero,Gato,Genio de la lámpara,Gladiador,Granjero,Guardia de seguridad,Guerrero,Hada,Hechicero,Hipnotizador,Hombre invisible,Hombre lobo,Influencer,Inventor,Investigador,Jardinero,Jinete,Joyero,Juez,Julio César,Ladrón,León,Leonardo da Vinci,Lionel Messi,Lobo,Locutor,Luchador,Madonna,Mago,Marinero,Marilyn Monroe,Mayordomo,Mecánico,Médico,Mensajero,Michael Jackson,Michael Jordan,Michelangelo,Monja,Monje,Mono,Murciélago,Músico,Nadador,Napoleón Bonaparte,Niño,Oso,Pablo Picasso,Panadero,Pastor,Patinador,Payaso,Periodista,Perro,Pescadero,Pescador,Pez,Piloto,Pingüino,Pintor,Pintor de brocha gorda,Pirata,Platón,Poeta,Policía,Político,Presentador,Princesa,Príncipe,Profesor,Ratón,Recepcionista,Reina,Repartidor,Reportero,Rey,Robot,Salvador Dalí,Saltimbanqui,Samurai,Sastre,Sepulturero,Serpiente,Shakira,Sirena,Soldado,Superhéroe,Taxista,Tenista,Tiburón,Tom Cruise,Tom Hanks,Tortuga,Vampiro,Vendedor,William Shakespeare,Zapatero,Zombi


`.split(",").map(item => item.trim()).filter(item => item.length > 0);

window.objetos = `
    

Silla,Proyector,Bolsa,Espátula,Maquinilla de afeitar,Agua oxigenada,Reproductor de música,Collar,Aceite,
Mesa,Pizarra,Mochila,Cuchara,Cortauñas,Jeringa,Semáforo,Pendiente,Bidón,
Sofá,Bolígrafo,Maleta,Tenedor,Pinzas,Medicamentos,Señal de tráfico,Bolso,Herramienta,
Cama,Lápiz,Billetera,Cuchillo,Perfume,Muleta,Farola,Reloj de bolsillo,Martillo,
Almohada,Rotulador,Cartera,Tabla de cortar,Crema,Bastón,Banco de parque,Casco,Destornillador,
Colchón,Goma de borrar,Monedero,Nevera,Pasta de dientes,Silla de ruedas,Gafas,Alicates,
Manta,Sacapuntas,Llave,Congelador,Cepillo de dientes,Andador,Papeleras,Gafas de sol,Llave inglesa,
Sábana,Cuaderno,Candado,Horno,Enjuague bucal,Carrito de bebé,Paraguas,Mochila escolar,Toalla,Carpeta,Cerradura,Microondas,Bastoncillo,Cuna,Sombrilla,Uniforme,Tornillo,
Armario,Libro,Manilla,Tostadora,Pañuelo,Trona,Sombrero,Traje,Clavo,
Espejo,Diccionario,Interruptor,Batidora,Papel higiénico,Juguete,Gorra,Bata,Tuerca,
Lámpara,Agenda,Enchufe,Exprimidor,Servilleta,Pelota,Bufanda,Delantal,Taladro,
Bombilla,Calendario,Cable,Licuadora,Mantel,Muñeca,Guantes,Guantes de cocina,Sierra,
Ventana,Reloj de pulsera,Bombona,Lavavajillas,Estropajo,Osito de peluche,Abrigo,Guantes de obra,Hacha,
Puerta,Reloj de pared,Linterna,Lavadora,Bol,Puzzle,Chaqueta,Casco de obra,Lima,
Persiana,Reloj despertador,Vela,Secadora,Bloques de construcción,Camiseta,Chaleco,Cinta métrica,
Cortina,Regla,Cerillas,Plancha,Cacerola,Coche de juguete,Camisa,Botas de seguridad,Disco duro,
Silla de oficina,Compás,Encendedor,Tabla de planchar,Sopera,Pistola de agua,Vestido,Balón de fútbol,Escalera,
Ordenador,Transportador,Cenicero,Aspiradora,Rallador,Cometa,Falda,Balón de baloncesto,Andamio,
Teclado,Tijeras,Botella,Escoba,Abrelatas,Balón,Pantalón,Balón de rugby,Carretilla,
Ratón,Pegamento,Jarra,Recogedor,Sacacorchos,Raqueta,Pijama,Pelota de tenis,Guantes de trabajo,
Pantalla,Celo,Vaso,Fregona,Palillos,Bicicleta,Calcetines,Pelota de golf,Pincel,
Auriculares,Chinchetas,Copa,Cubo,Salero,Patinete,Zapatos,Palo de golf,Rodillo,
Altavoz,Clip,Plato,Plumero,Pimentero,Monopatín,Zapatillas,Palo de hockey,Bote de pintura,
Teléfono,Grapadora,Taza,Esponja,Aceitera,Pendrive,Botas,Bate de béisbol,Paleta de pintura,
Tablet,Grapas,Tetera,Jabón,Vinagrera,Moto,Sandalias,Guante de béisbol,Lienzo,
Cargador,Sobre,Cafetera,Detergente,Botiquín,Disco de vinilo,Bañador,Casco de moto,Escultura,
Televisión,Carta,Olla,Champú,Termómetro,CD,Cinturón,Cinturón de seguridad,Tinta,
Radio,Sello,Cazo,Gel de ducha,Tirita,DVD,Corbata,Airbag,Pluma estilográfica,
Micrófono,Caja,Sartén,Cepillo,Vendas,Mando a distancia,Pajarita,Volante,Máquina de escribir,
Cámara de fotos,Cajón,Colador,Peine,Gasas,Consola de videojuegos,Anillo,Neumático,Sellos de caucho,
Cámara de vídeo,Estantería,Cucharón,Secador,Alcohol,Barco,Pulsera,Batería,Tinta de impresora,Abridor de botellas,Bandeja,Calculadora,Cinta adhesiva,Frasco,Grapa,Manguera,Moneda,Postal,Tiza


`.split(",").map(item => item.trim()).filter(item => item.length > 0);

window.objetosRaros = `
    

Reloj que camina,Cadena que baila,Pluma que dibuja sola,Peine que silba,Pepino que flota,Silla que canta,Anillo que habla,Tintero que nunca se vacía,Perfume que te elige,Zanahoria que silba,Mesa que se derrite,Collar que flota alrededor,Cuaderno que te responde,Pasta de dientes que brilla,Lechuga que baila,Puerta que desaparece,Pulsera que atrapa pensamientos,Mapa que cambia,Cepillo que flota,Patata que canta,Ventana que abre al mar,Arete que brilla en la oscuridad,Globo terráqueo que gira solo,Papel higiénico infinito,Berenjena que ríe,Cuchillo que corta el tiempo,Sombrero que oculta tormentas,Linterna que ilumina el futuro,Servilleta que se escapa,Calabacín que habla,Cuchara infinita,Guantes que convierten en oro lo que tocan,Cámara que roba almas,Mantel que se estira,Brócoli que grita,Taza que levita,Botas que corren sin ti,Foto que sonríe sola,Estropajo que canta,Coliflor que flota,Sombrero que hace que llueva,Capa de invisibilidad,Pintura que se mueve,Cuchara que nunca cae,Seta que canta,Zapatos que bailan solos,Trono de cristal,Escultura que respira,Tenedor que flota,Seta venenosa que ríe,Calcetines invisibles,Corona que arde,Pincel que pinta sueños,Cuchillo que se esconde,Coche que corre sin conductor,Camisa que grita,Cetro que truena,Paleta que flota,Plato que gira,Avión de papel que nunca cae,Chaqueta que cambia de color según tu humor,Espada que canta,Martillo que canta,Vaso que nunca se rompe,Barco que navega en el aire,Sombrilla de fuego,Escudo que se queja,Destornillador que gira solo,Copa que canta,Submarino que nada en la arena,Paraguas que llora,Arco que dispara luz,Sierra que ríe,Botella que atrapa estrellas,Tren que atraviesa paredes,Cama que flota,Flecha que regresa,Hacha que llora,Barril que llora,Moto que se multiplica,Almohada que susurra,Lanza que flota,Lima que vibra,Jarra que ríe,Bicicleta que vuela,Manta que se mueve sola,Pistola de burbujas infinitas,Clavo que baila,Calabaza que habla,Patinete que canta,Colchón que sueña por ti,Cañón de arcoíris,Tornillo que grita,Manzana que flota,Monopatín que baila,Espejo que te contradice,Robot que sueña,Tuerca que canta,Plátano que corre,Zapato que vuela,Lámpara que ilumina recuerdos,Androide que llora,Carretilla que corre sola,Naranja que canta,Calcetín que habla,Bombilla que canta,Dron que te sigue,Andamio que se dobla,Uva que ríe,Pantalón que corre,Vela que nunca se apaga,Holograma sólido,Escalera infinita,Fresa que grita,Cerilla que se enciende sola,Teléfono que llama a los muertos,Ventilador que congela,Limón que llora,Falda que vuela,Encendedor que congela,Ordenador que escribe solo,Aspiradora que sopla,Piña que vuela,Vestido que canta,Caja que ríe,Pantalla que te mira,Fregona que baila,Mango que canta,Abrigo que arde,Baúl que vuela,Ratón que muerde,Cubo que canta,Coco que rueda solo,Bufanda que flota,Maleta sin fondo,Teclado que canta,Plumero que habla,Durazno que brilla,Gorra que habla,Bolso que muerde,Micrófono que grita,Toalla que se esconde,Pera que flota,Gafas que muestran otros mundos,Llave que abre nubes,Auriculares que cuentan secretos,Jabón que no se gasta,Kiwi que canta,Candado que atrapa sombras,Radio que transmite pensamientos,Champú que canta en la ducha,Granada que explota en risas,Cuerda que se multiplica,Libro que se lee a sí mismo,Cepillo que muerde,Tomate que llora,Espejo que roba reflejos,Telaraña que teje historias,Mano biónica con mente propia,Poción que invierte la gravedad,Lupa que agranda sentimientos,Moneda que compra recuerdos,Libro que cambia de idioma,Cámara que revela miedos,Pala que excava sueños,Huevo que nunca se rompe,Peonza que detiene el tiempo,Tijeras que cortan el aire,Piedra que imita voces,Cofre que oculta el silencio,Soplo que apaga estrellas,Póster que te transporta,Reloj de arena que mide el dolor,Planta que cultiva ideas,Gafas que ven el pasado,Candelabro que quema sombras,Máquina de escribir que adivina,Botella con mensaje que se auto-escribe,Flauta que invoca lluvia,Móvil que solo recibe llamadas del futuro,Cepillo de pelo que peina el alma,Tatuaje temporal que se vuelve real,Trozo de tarta que nunca se acaba,Agujero de gusano de bolsillo,Fósforo que crea calor en el hielo,Pincel que da vida a los dibujos,Puñal que corta la mala suerte,Sopa que otorga sabiduría,Polo que te hace volar,Capa que te hace invisible a las mentiras,Silbato que llama a los lobos,Lámpara que ilumina la verdad,Esfera de cristal que muestra deseos,Ventana que te permite escuchar el espacio,Mazo que construye castillos de arena,Pergamino que reescribe errores,Plato que sirve la felicidad,Televisor que solo emite sueños,Gota de rocío que cura enfermedades,Guijarro que viaja a través de dimensiones,Máscara que revela la personalidad,Instrumento musical que toca el viento,Libreta de direcciones de fantasmas,Burbuja de jabón irrompible,Globo que flota en el subsuelo,Zumo que te da la fuerza de un gigante,Ancla que sujeta el cielo,Bomba de humo que te teletransporta,Dado que siempre cae en seis,Cubo de Rubik que resuelve problemas,Chicle que te permite respirar bajo el agua,Monóculo que ve a través de la materia,Sello que te autentifica como héroe,Alfiler que cose la noche,Caja de música que toca el silencio,Zapato que da pasos en falso,Trono que te hace sentir invencible,Semilla que crece en segundos,Anzuelo que pesca planetas,Teléfono sin cables que habla con animales,Cuchara que remueve la conciencia,Lápiz labial que te da el don de la palabra,Pizarra que se limpia sola con pensamientos,Tostadora que convierte el pan en oro,Mochila que siempre tiene lo que buscas,Cinturón que controla el tiempo,Bufanda que te abriga del miedo,Esponja que absorbe la tristeza,Abrelatas que abre portales,Pistola que dispara estrellas,Ajedrez donde las piezas se mueven solas,Diario que escribe sobre tu futuro,Llave que abre cualquier cerradura,Pértiga que te ayuda a saltar edificios,Rueda que gira hacia el pasado,Venda que cura heridas emocionales,Mortero que machaca la ira,Cepillo de dientes que limpia culpas,Cinturón de seguridad que te protege de errores,Corbata que te hace más inteligente,Anillo que duplica tu suerte,Monedero que siempre tiene un billete,Espejo de mano que muestra tu yo interior,Botella que convierte el agua en vino,Perchero que sostiene el universo,Ladrillo que construye esperanzas,Clavo que sujeta la realidad,Pequeño sol embotellado,Fuente que mana tinta,Guantes que te permiten tocar las nubes,Papel que arde con ideas,Sábana que te envuelve en sueños,Palo que te hace invisible a los ojos malvados,Chupete que da sabiduría,Mechero que crea universos,Peluca que cambia el clima,Regla que mide el miedo,Sombrero que convierte palabras en pájaros,Taza que bebe café sola,Zapatillas que caminan al revés,Lápiz que borra recuerdos


`.split(",").map(item => item.trim()).filter(item => item.length > 0);

window.formatos = `
    

Acción,Ciencia ficción,Cine familiar,Cine mudo,Comedia,Documental,Drama,Fantasía,Histórica,Melodrama,Musical,Ópera,Policíaco,Reality show,Road movie,Romántica,Sitcom,Suspense,Telenovela,Terror,Thriller,Tragicomedia,Western,Artes marciales,Aventura,Cine bélico,Cine religioso,Comedia romántica,Drama judicial,Romántica adolescente,Superhéroes


`.split(",").map(item => item.trim()).filter(item => item.length > 0);

window.sentimientos = `
    

Abatimiento,Aburrimiento,Admiración,Afecto,Agobio,Agresividad,Alegría,Alivio,Altivez,Ambición,Amor,Angustia,Ansiedad,Añoranza,Apatía,Apoyo,Arrepentimiento,Asco,Calma,Celos,Cobardía,Compasión,Confianza,Confusión,Culpabilidad,Curiosidad,Decepción,Deseo,Desilusión,Desprecio,Devoción,Dolor,Duda,Empatía,Empoderamiento,Entusiasmo,Envidia,Escepticismo,Esperanza,Euforia,Exaltación,Éxtasis,Fascinación,Fervor,Frustración,Generosidad,Gozo,Gratitud,Hostilidad,Humildad,Ilusión,Incredulidad,Indiferencia,Inquietud,Inseguridad,Inspiración,Ira,Melancolía,Miedo,Nostalgia,Obstinación,Odio,Orgullo,Pánico,Pasión,Pena,Rabia,Rebeldía,Recelo,Resignación,Respeto,Satisfacción,Serenidad,Sinceridad,Soberbia,Solidaridad,Sorpresa,Temor,Ternura,Traición,Tranquilidad,Tristeza,Valentía,Vergüenza,Vulnerabilidad


`.split(",").map(item => item.trim()).filter(item => item.length > 0);