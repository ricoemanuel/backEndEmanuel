CREATE DATABASE "pruebaApi"

CREATE TABLE IF NOT EXISTS public.empleados
(
    id integer NOT NULL DEFAULT nextval('empleados_id_seq'::regclass),
    fecha_ingreso date,
    nombre character varying(50) COLLATE pg_catalog."default",
    salario double precision,
    rol character varying(100) COLLATE pg_catalog."default",
    CONSTRAINT empleados_pkey PRIMARY KEY (id)
)

CREATE TABLE IF NOT EXISTS public.login
(
    correo character varying(300) COLLATE pg_catalog."default",
    contrasena character varying(200) COLLATE pg_catalog."default",
    empleado_id integer,
    CONSTRAINT login_correo_key UNIQUE (correo),
    CONSTRAINT login_empleado_id_fkey FOREIGN KEY (empleado_id)
        REFERENCES public.empleados (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

CREATE TABLE IF NOT EXISTS public.solicitud
(
    id integer NOT NULL DEFAULT nextval('solicitud_id_seq'::regclass),
    codigo character varying(50) COLLATE pg_catalog."default",
    descripcion character varying(50) COLLATE pg_catalog."default",
    resumen character varying(50) COLLATE pg_catalog."default",
    salario double precision,
    empleado_id integer,
    CONSTRAINT solicitud_pkey PRIMARY KEY (id),
    CONSTRAINT solicitud_empleado_id_fkey FOREIGN KEY (empleado_id)
        REFERENCES public.empleados (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)