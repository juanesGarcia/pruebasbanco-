# Usar la imagen oficial de Node.js como base
FROM node:20-alpine


# Establecer el directorio de trabajo
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json al directorio de trabajo
COPY ./package.json .
COPY ./package-lock.json .


# Instalar dependencias
RUN npm install

# Copiar el resto del código de la aplicación al directorio de trabajo
COPY . .

# Exponer el puerto de la aplicación
EXPOSE 5173

# Comando para ejecutar la aplicación


CMD ["npm", "run","dev-exposed"]
