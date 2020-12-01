# Cryptocurrencies Monitor API

## Resumen

API que consume el servicio CoinGecko (​https://www.coingecko.com/en/api)​ y utiliza su información.

Permite crear usuarios, iniciar sesión, asignar cryptomonedas y monitorear su valor.

---

## API en Ambiente Producción

La api ha sido publicada en heroku y se encuentra disponible a traves del siguiente enlace:
https://dv-cryptocurrencies-monitor.herokuapp.com

---

## Documentación

La documentación de la API puede ser consultada en:
https://dv-cryptocurrencies-monitor.herokuapp.com/docs/

---

## Clonar Proyecto

Abra su terminal, ubíquese en donde desea almacenar el proyecto y corra el siguiente comando:

```bash
git clone https://github.com/daniel-vega-86/cryptocurrencies-monitor-api.git
```

---

## Instalación

En su terminal corra el siguiente codigo para acceder a la carpeta de la API.

```bash
cd cryptocurrencies-monitor-api
```

A continuación corra el siguiente codigo para instalar las dependencias necesarias.

```bash
npm install
```

---

## Crear Bases de Datos

Es necesario crear dos bases de datos para los ambientes

- Desarrollo (development)
- Prueba (test)

---

## Estableces Variables de Entorno Necesarias

En la raiz de la API cree un archivo llamado ".env" y en el establezca las siguientes variables, vale la pena resaltar que aquellas con valores entre parentesis () deben ser modificadas con la información que se establece:

```
PORT=3000
DB_NAME= (nombre de la base de datos creada para el desarrollo)
DB_NAMETEST= (nombre de la base de datos creada para pruebas)
DB_USER= (Usuario establecido en la base de datos)
DB_PASS= (Contraseña usada en la base de datos)
DB_HOST=127.0.0.1
DB_DIALECT=postgres
NODE_ENV=development
SALT=8
JWT_SECRET=ThisIsMySecretForTokens
EXPIRATION_TIME="6 hours"
BASE_URL=https://api.coingecko.com/api/v3/
```

---

## Correr Migraciones

Es necesario correr migraciones para crear las tablas en las bases de datos, para esto ejecute los siguientes codigos:

- Base de datos para desarrollo

```
npx sequelize-cli db:migrate
```

- Base de datos para pruebas

```
npx sequelize-cli db:migrate --env "test"
```

---

## Correr Servidor Local

Es necesario correr el servidor local para comprobar el correcto funcionamiento de la API, la cual hace uso de la base de datos de desarrollo.

```
npm run dev
```

---

## Correr Pruebas

Con el siguiente codigo se ejecutan todas las pruebas establecidas para la API, haciendo uso de la base de datos para pruebas.

```
npm test
```

---

## Construido con

- [NodeJS](https://nodejs.org/es/)
- [ExpressJS](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Sequelize](https://sequelize.org/)
