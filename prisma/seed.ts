import { PrismaClient, Role, SpaceType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("Admin123!", 10);

  await prisma.user.upsert({
    where: { email: "admin@cospace.com" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@cospace.com",
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  await prisma.space.createMany({
  skipDuplicates: true,
  data: [
    // ESCRITORIOS INDIVIDUALES 
    {
      name: "Nexo Workstation",
      description:
        "Puesto individual en un entorno moderno de coworking, ideal para estudiar, programar y trabajar cómodamente.",
      type: SpaceType.DESK,
      pricePerHour: 5.0,
      imageUrl:
        "https://images.pexels.com/photos/26966416/pexels-photo-26966416.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      name: "Estación Boreal",
      description:
        "Espacio de trabajo luminoso con un ambiente tranquilo, perfecto para organizar tareas y concentrarse.",
      type: SpaceType.DESK,
      pricePerHour: 5.5,
      imageUrl:
        "https://images.pexels.com/photos/9218551/pexels-photo-9218551.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      name: "Puesto Prisma",
      description:
        "Estación individual para proyectos digitales, programación, estudio y trabajo remoto.",
      type: SpaceType.DESK,
      pricePerHour: 6.0,
      imageUrl:
        "https://images.pexels.com/photos/34804001/pexels-photo-34804001.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      name: "Estación Delta",
      description:
        "Área de trabajo funcional con mobiliario de oficina, pensada para avanzar en tus proyectos diarios.",
      type: SpaceType.DESK,
      pricePerHour: 5.0,
      imageUrl:
        "https://images.pexels.com/photos/8606292/pexels-photo-8606292.jpeg?auto=compress&cs=tinysrgb&w=800",
    },

    // SALAS DE REUNIONES
    {
      name: "Sala Atlas",
      description:
        "Sala de reuniones con mesa de conferencias y mobiliario profesional, ideal para reuniones de equipo y presentaciones.",
      type: SpaceType.MEETING_ROOM,
      pricePerHour: 18.0,
      imageUrl:
        "https://images.pexels.com/photos/236730/pexels-photo-236730.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      name: "Sala Vértice",
      description:
        "Sala compacta para encuentros de trabajo, planificación de proyectos y reuniones colaborativas.",
      type: SpaceType.MEETING_ROOM,
      pricePerHour: 15.0,
      imageUrl:
        "https://images.pexels.com/photos/7534213/pexels-photo-7534213.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      name: "Sala Cobalto",
      description:
        "Ambiente profesional para entrevistas, reuniones con clientes y conversaciones privadas de negocios.",
      type: SpaceType.MEETING_ROOM,
      pricePerHour: 16.0,
      imageUrl:
        "https://images.pexels.com/photos/8453806/pexels-photo-8453806.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      name: "Sala Horizonte",
      description:
        "Espacio para reuniones de equipo, sesiones de lluvia de ideas y presentaciones de proyectos.",
      type: SpaceType.MEETING_ROOM,
      pricePerHour: 20.0,
      imageUrl:
        "https://images.pexels.com/photos/4872016/pexels-photo-4872016.jpeg?auto=compress&cs=tinysrgb&w=800",
    },

    // CABINAS PRIVADAS
    {
      name: "Cabina Zen",
      description:
        "Espacio individual de estilo minimalista, adecuado para estudiar, leer y trabajar con concentración.",
      type: SpaceType.CABIN,
      pricePerHour: 8.0,
      imageUrl:
        "https://images.pexels.com/photos/8534373/pexels-photo-8534373.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      name: "Cabina Eclipse",
      description:
        "Cabina de oficina para realizar llamadas, videoconferencias y entrevistas virtuales con mayor privacidad.",
      type: SpaceType.CABIN,
      pricePerHour: 9.0,
      imageUrl:
        "https://images.pexels.com/photos/6794923/pexels-photo-6794923.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      name: "Cabina Silencio",
      description:
        "Espacio reservado para trabajar sin interrupciones y completar tareas que requieren atención constante.",
      type: SpaceType.CABIN,
      pricePerHour: 8.5,
      imageUrl:
        "https://images.pexels.com/photos/11784437/pexels-photo-11784437.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      name: "Cabina Órbita",
      description:
        "Área de trabajo privada dentro de un entorno de oficina moderno, ideal para sesiones individuales y trabajo remoto.",
      type: SpaceType.CABIN,
      pricePerHour: 10.0,
      imageUrl:
        "https://images.pexels.com/photos/6794935/pexels-photo-6794935.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
  ],
});

  console.log("Seed completado — admin@cospace.com / Admin123!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());