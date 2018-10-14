# Comentando

El desarrollo es una web de publicación de comentarios realizada con REACT & Redux.
Para el desarrollo se ha intentado incluir los conocimientos adquiridos en el modulo.

## Instalación

Descargar del repositorio la rama master.

Dentro del directorio raiz ejecutaremos:
```bash
npm install
```

## Ejecución

Una vez instaladas las dependencias podremos ejecutar la web, para ello, dentro del directorio raiz ejecutaremos:
```bash
npm run start
```
este paso arrancara la aplicación.

## backend

El frontend se nutre del api https://randomuser.me/api?results=100&seed=abc.
Para realizar el login una vez cargados los usuarios del API, se realiza una busqueda con el usuario y password dentro del listado proporcionado en el api.

Para la parte de persistencia de comentarios y suscripciones se ha utilizado LocalStorage, para cada usuario se creara una estructura similar a la siguiente:
{"subscriptions":[{"username":"nombreEjemplo","isaccepted":false}],"comments":["ejemplo comentario"]}

### Url de prueba para la web

Si la web se ha levantado correctamente podremos probarla lanzando la siguiente url y se mostraran el home con el boton para realizar el login en la aplicacion de comentarios:

```bash
http://localhost:3000/

```

## Version

 V1.0

## License
[![CC0](https://licensebuttons.net/p/zero/1.0/88x31.png)](https://creativecommons.org/publicdomain/zero/1.0/)