# Usa una versión ligera de Node.js
FROM node:18-alpine

# Crea la carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de dependencias primero (para aprovechar la caché de Docker)
COPY package.json package-lock.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código de tu proyecto
COPY . .

# Expone el puerto 3000 (donde corre React)
EXPOSE 3000

# Comando para iniciar la aplicación en modo desarrollo
CMD ["npm", "start"]