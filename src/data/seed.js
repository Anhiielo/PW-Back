import 'dotenv/config';
import bcrypt from 'bcrypt';
import { sequelize, User, Game } from '../models/index.js';

// ─── Juegos iniciales (del antiguo mockData.js) ───────────────────────────────
const games = [
  {
    title: "Elden Ring",
    price: 150.00,
    platform: "PC",
    category: "RPG",
    image_url: "https://cdn.akamai.steamstatic.com/steam/apps/1245620/library_600x900.jpg",
    description: "Levántate, Sinluz, y déjate guiar por la gracia para esgrimir el poder del Círculo de Elden y convertirte en el Señor de Elden en las Tierras Intermedias. Un vasto mundo con mazmorras complejas y combates desafiantes.",
    stock: 15,
  },
  {
    title: "EA Sports FC 24",
    price: 199.90,
    platform: "PS5",
    category: "Deportes",
    image_url: "https://cdn.akamai.steamstatic.com/steam/apps/2195250/library_600x900.jpg",
    description: "EA SPORTS FC 24 es una nueva era para The World's Game: más de 19 000 futbolistas con licencia, 700 equipos y 30 ligas en la experiencia futbolística más auténtica jamás creada.",
    stock: 20,
  },
  {
    title: "Cyberpunk 2077",
    price: 120.50,
    platform: "PC",
    category: "Acción",
    image_url: "https://cdn.akamai.steamstatic.com/steam/apps/1091500/library_600x900.jpg",
    description: "Cyberpunk 2077 es un RPG de acción y aventura de mundo abierto ambientado en Night City, una megalópolis obsesionada con el poder, el glamur y la modificación corporal.",
    stock: 12,
  },
  {
    title: "Zelda: Tears of the Kingdom",
    price: 220.00,
    platform: "Switch",
    category: "Aventura",
    image_url: "https://upload.wikimedia.org/wikipedia/en/f/fb/The_Legend_of_Zelda_Tears_of_the_Kingdom_cover.jpg",
    description: "En esta secuela de Breath of the Wild, decidirás tu propio camino a través de los extensos paisajes de Hyrule y las misteriosas islas que flotan en los vastos cielos.",
    stock: 8,
  },
  {
    title: "Hollow Knight",
    price: 45.00,
    platform: "PC",
    category: "Indie",
    image_url: "https://cdn.akamai.steamstatic.com/steam/apps/367520/library_600x900.jpg",
    description: "Forja tu propio camino en Hollow Knight. Una aventura épica de acción en 2D a través de un vasto reino en ruinas de insectos y héroes.",
    stock: 25,
  },
  {
    title: "God of War Ragnarök",
    price: 250.00,
    platform: "PS5",
    category: "Acción",
    image_url: "https://cdn.akamai.steamstatic.com/steam/apps/2322010/library_600x900.jpg",
    description: "Kratos y Atreus deben viajar a cada uno de los Nueve Reinos en busca de respuestas mientras las fuerzas asgardianas se preparan para la batalla profetizada que acabará con el mundo.",
    stock: 10,
  },
  {
    title: "Super Mario Bros. Wonder",
    price: 210.00,
    platform: "Switch",
    category: "Plataformas",
    image_url: "https://images.nintendolife.com/games/nintendo-switch/super_mario_bros_wonder/cover_large.jpg",
    description: "¡Encuentra la maravilla en la siguiente evolución de la diversión de Mario! El juego clásico de desplazamiento lateral cambia drásticamente con las Flores Maravilla.",
    stock: 18,
  },
  {
    title: "Halo Infinite",
    price: 160.00,
    platform: "Xbox",
    category: "Shooter",
    image_url: "https://cdn.akamai.steamstatic.com/steam/apps/1240440/library_600x900.jpg",
    description: "Cuando toda esperanza se ha perdido y el destino de la humanidad pende de un hilo, el Jefe Maestro está listo para enfrentarse al enemigo más despiadado al que jamás haya hecho frente.",
    stock: 14,
  },
  {
    title: "Forza Horizon 5",
    price: 180.00,
    platform: "Xbox",
    category: "Carreras",
    image_url: "https://cdn.akamai.steamstatic.com/steam/apps/1551360/library_600x900.jpg",
    description: "Explora los vibrantes y cambiantes paisajes de mundo abierto de México con una acción de conducción ilimitada y divertida en cientos de los mejores autos del mundo.",
    stock: 16,
  },
  {
    title: "Animal Crossing: New Horizons",
    price: 190.00,
    platform: "Switch",
    category: "Simulación",
    image_url: "https://upload.wikimedia.org/wikipedia/en/1/1f/Animal_Crossing_New_Horizons.jpg",
    description: "Escapa a una isla desierta y crea tu propio paraíso mientras exploras, creas y personalizas en Animal Crossing: New Horizons.",
    stock: 22,
  },
  {
    title: "Red Dead Redemption 2",
    price: 90.00,
    platform: "PC",
    category: "Acción",
    image_url: "https://cdn.akamai.steamstatic.com/steam/apps/1174180/library_600x900.jpg",
    description: "Con más de 175 premios al Juego del Año, RDR2 es una historia épica sobre el honor y la lealtad en el amanecer de la era moderna.",
    stock: 30,
  },
  {
    title: "Spider-Man 2",
    price: 260.00,
    platform: "PS5",
    category: "Acción",
    image_url: "https://image.api.playstation.com/vulcan/ap/rnd/202306/1219/1c7b75d8ed9271516546560d219ad0b22ee0a263b4537bd8.png",
    description: "Los Spider-Men Peter Parker y Miles Morales se enfrentan a la prueba definitiva de fuerza dentro y fuera de la máscara mientras luchan para salvar la ciudad, a los demás y a sus seres queridos de Venom.",
    stock: 11,
  },
];

// ─── Usuarios iniciales ──────────────────────────────────────────────────────
const users = [
  { username: "admin", email: "admin@pekeys.com", password: "admin123", role: "admin" },
  { username: "usuario1", email: "usuario1@pekeys.com", password: "pass123", role: "customer" },
];

// ─── Ejecutar seed ───────────────────────────────────────────────────────────
const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a PostgreSQL establecida.');

    // Sincronizar tablas (force: true las recrea desde cero)
    await sequelize.sync({ force: true });
    console.log('✅ Tablas recreadas.');

    // Insertar juegos
    await Game.bulkCreate(games);
    console.log(`✅ ${games.length} juegos insertados.`);

    // Insertar usuarios con contraseñas encriptadas
    for (const u of users) {
      const hashedPassword = await bcrypt.hash(u.password, 10);
      await User.create({ ...u, password: hashedPassword });
    }
    console.log(`✅ ${users.length} usuarios insertados (contraseñas encriptadas).`);

    console.log('\n🎉 Seed completado exitosamente.');
    console.log('   Usuarios de prueba:');
    console.log('   📧 admin@pekeys.com / admin123 (admin)');
    console.log('   📧 usuario1@pekeys.com / pass123 (customer)\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  }
};

seed();
