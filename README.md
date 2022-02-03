# Prueba BSale

### Explicacion de la prueba

Construir una tienda online que muestre productos agrupados por categorías, separando el backend (API REST) y frontend (aplicación que la consuma).

Además, agregar un buscador, el cual tiene que listar los productos segun el texto ingresado (API REST), el backend puede ser desarrollado con el lenguaje y framework a libre elección. Es decir, los datos de los productos deben llegar filtados al cliente.

### Solución

Para completar la prueba se desarrollo el frontend utilizando HTML con JavaScript Vanilla y Bootstrap.
En el archivo JavaScript se encuentra comentado lo que se hace en cada funcion para entender su funcionamiento.

# BackEnd
Para la API REST se utilizó el lenguaje de Jaca con el framework de SpringBoot con JPA para las consultas a la Base de Datos. El codigo se encuenta comentado para hacer mas facil entender su funcionamiento.
Para ver más sobre el API REST implementado se deja el siguiente enlace:
https://github.com/renatorq/BackEndBsale.git

# FrontEnd
En el FrontEnd cuenta con la pagina principal que consume uno de los servicios que devuelve la lista de productos paginada y otro que lista las categorías.

En la parte superior se encuentra una barra de navegación que se desplaza mientras bajas en la pagina, donde se podran hacer los filtros por categoria o utilizar el buscardor para obtener los productos necesarios.

En la parte derecha, debajo de la busqueda, se muestra una opcion para mostrar la cantidad del productos a mostrar en la pagina.

Debajo de la barra de navegacion se encuentra el menú de paginación

Finalmente más abajo se muestra los productos cargados por defecto en una cantidad de 10 productos ordenadas en 4 columnas.

Para ver sobre el codigo del frontEnd se deja el siguiente enlace:
https://github.com/renatorq/FrontEndBsale.git

Para visualizar la pagina en funcionamiento, se subio al siguiente enlace:

https://heuristic-ride-6d6cb6.netlify.app


### Tecnologías utilizadas

- HTML 5.
- Javascript (Vanilla js).
- Bootstrap 5.1
