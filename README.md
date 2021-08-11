# Proyecto de Hackaton 2021. Huawei-Conalep Nacional.

## Propósito
Crear un sistema de autentificación de usuarios mediante reconocimiento facial. El sistema tambien cuenta con la opción de tomar temperatura (debido a la pandemia), realizar compras y pagar con el saldo que se tiene en el sistema.

## Qué se utilizó

Se utilizaron librerias de reconocimiento facial, backend con node y bases de datos MySQL

## Cómo funciona

La libreria de reconocimiento facial utiliza imágenes de los alumnos  y los identifica por medio de su ID, despues se hace una petición HTTP hacia la parte de registro con los datos necesarios, tales como hora,alumno y temperatura (el cual por falta de tiempo se genera como numero aleatorio). En el backend se genera un registro para su proxima exportación.
