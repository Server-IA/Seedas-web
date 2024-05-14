// Importa los módulos necesarios
const { requireSession } = require('@clerk/nextjs/api');
const { PrismaClient } = require('@prisma/client');

// Crea una instancia de PrismaClient
const prisma = new PrismaClient();

// Controlador para manejar la autenticación del usuario y guardar los datos en la base de datos
const handler = async (req, res) => {
  try {
    // Verifica si el usuario está autenticado con Clerk
    const session = await requireSession(req, res);

    // Obtiene los datos del usuario autenticado desde Clerk
    const user = session.user;

    // Guarda o actualiza los datos del usuario en la base de datos MySQL utilizando Prisma
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: user.id }, // Suponiendo que tienes una columna clerkId en tu tabla de usuarios
    });

    if (existingUser) {
      // Si el usuario ya existe, actualiza sus datos
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          // Actualiza los campos necesarios según la información proporcionada por Clerk
          name: user.fullName, // Suponiendo que el nombre del usuario se almacena en una columna 'name'
          // Otros campos...
        },
      });
    } else {
      // Si el usuario no existe, créalo
      await prisma.user.create({
        data: {
          clerkId: user.id,
          email: user.emailAddresses[0].email, // Suponiendo que el correo electrónico se almacena en una columna 'email'
          name: user.fullName,
          // Otros campos...
        },
      });
    }

    // Enviar una respuesta exitosa
    res.status(200).json({ message: 'User authenticated and saved to database successfully' });
  } catch (error) {
    // Manejar errores
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Exporta el controlador
module.exports = handler;
