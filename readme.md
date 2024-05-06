# Ejecución de la app

Para ejecutar este backend se deben ejecutar los scripts que hay en la carpeta database en el archivo database.sql, luego crear un usuario en la tabla empleados "Administrador".
INSERT INTO empleados(
	fecha_ingreso, nombre, salario, rol)
	VALUES (2024-05-05, 'emanuel', 0, 'Administrador');

 Ya que desde front por defecto solo se crean usuarios de tipo empleado. 
 
 Una vez creado se puede ingresar al front sin problema.