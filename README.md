# Guanentino Responda

Plataforma web para practicar las pruebas Saber 11. Cada estudiante responde una pregunta al día en cada una de las cinco áreas, recibe la explicación al instante, gana puntos, mantiene una racha y compite en un ranking. Los docentes administran las preguntas y los estudiantes desde un panel propio.

Este proyecto es la reescritura completa de una primera versión en PHP que quedó inconclusa durante mis estudios de bachillerato (`guanentino_responda`).

## Qué hace

**Para los estudiantes**

- Registro e inicio de sesión con validación en tiempo real
- Una pregunta del día por cada área, sin repetirse hasta agotar el banco
- Resultado inmediato con la explicación de la respuesta correcta
- Puntos, racha de días seguidos y ranking con los 10 mejores
- Perfil con estadísticas y avatar de ícono y color
- Página de progreso con el porcentaje de aciertos por área y las preguntas falladas para repasar
- Reporte de preguntas con errores
- Configuración de cuenta con edición de datos, cambio de correo y de clave, modo claro y oscuro y opción para no aparecer en el ranking
- Descarga de los propios datos y eliminación de la cuenta
- Instalable en el teléfono como una aplicación

**Para los docentes**

- Crear, editar y borrar preguntas
- Importar muchas preguntas a la vez desde un archivo JSON
- Ver estudiantes, restablecer claves y eliminar cuentas
- Revisar los reportes de los estudiantes
- Ver las preguntas que más se fallan

## Tecnologías

| Parte | Herramienta |
|---|---|
| Interfaz y servidor | Next.js 16 con App Router y React |
| Estilos | Tailwind CSS 4 |
| Íconos | Lucide |
| Base de datos | PostgreSQL alojado en Neon |
| Acceso a datos | Prisma 7 |
| Autenticación | Auth.js (next-auth 5 beta) con sesiones JWT |
| Seguridad | bcryptjs y zod |
| Despliegue | Vercel |

## Estructura del proyecto

```
app/                  páginas y acciones del servidor
  api/                ruta de Auth.js y descarga de datos
  docente/            panel del docente
  login/ registro/    entrada a la plataforma
  perfil/             perfil, configuración y cambio de clave
  pregunta/           preguntas del día
  progreso/           avance y errores para repasar
  ranking/            ranking
  privacidad/         política de privacidad
components/           piezas de interfaz reutilizables
lib/                  utilidades, permisos y reglas de validación
services/             lógica del negocio, como elegir la pregunta del día
prisma/               modelo de datos y migraciones
public/icons/         íconos de la aplicación instalable
auth.js               configuración de Auth.js
```

## Puesta en marcha

Se necesita una versión reciente de Node.js (LTS) y una base de datos PostgreSQL, por ejemplo una gratuita en Neon.

1. Clonar el repositorio e instalar las dependencias.

```bash
git clone https://github.com/fsadriann/guanentino.git
cd guanentino
npm install
```

2. Crear un archivo `.env` en la raíz con estas variables.

```
DATABASE_URL="cadena de conexión directa de PostgreSQL"
AUTH_SECRET="llave secreta larga y aleatoria"
```

Una llave aleatoria se genera con este comando.

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

El archivo `.env` nunca se sube a GitHub.

3. Crear las tablas y generar el cliente de Prisma.

```bash
npx prisma migrate dev
npx prisma generate
```

4. Cargar las cinco áreas con este SQL, por ejemplo en el editor de Neon.

```sql
insert into "Area" (nombre) values
  ('Lectura crítica'),
  ('Matemáticas'),
  ('Sociales y ciudadanas'),
  ('Ciencias naturales'),
  ('Inglés');
```

5. Encender el servidor de desarrollo.

```bash
npm run dev
```

La aplicación queda en `http://localhost:3000`.

## Primer docente

Todas las cuentas nuevas son de estudiante. Para convertir una en docente se registra primero la cuenta y luego se corre este SQL con su usuario.

```sql
update "Usuario" set rol = 'DOCENTE' where usuario = 'nombre_de_usuario';
```

Después de cambiar el rol hay que cerrar sesión y volver a entrar.

## Importar preguntas

En el panel del docente, en la sección Importar preguntas, se sube un archivo JSON con este formato.

```json
[
  {
    "area": "Matemáticas",
    "enunciado": "Texto de la pregunta",
    "opciones": ["Opción A", "Opción B", "Opción C", "Opción D"],
    "correcta": "B",
    "explicacion": "Por qué esa es la respuesta correcta"
  }
]
```

La carga es de todo o nada. Si hay un solo error no se guarda ninguna pregunta, y las preguntas repetidas se omiten. Se admiten hasta 200 preguntas por archivo.

## Bases de datos y despliegue

El proyecto usa dos ramas de base de datos en Neon.

- La rama `desarrollo` es la que usa el `.env` del computador, para probar sin riesgo
- La rama `production` es la que usa el sitio publicado en Vercel

Cuando se cambia el modelo de datos el orden es siempre el mismo.

1. Se cambia `prisma/schema.prisma` y se corre `npx prisma migrate dev` contra la rama de desarrollo
2. Se prueba todo en el computador
3. Se aplica la misma migración a producción con la conexión directa de esa rama

```powershell
$env:DATABASE_URL="cadena directa de production"
npx prisma migrate deploy
Remove-Item Env:DATABASE_URL
```

4. Solo después se hace el `git push`, que despliega el código nuevo en Vercel

Si el código se sube antes de crear las columnas o tablas nuevas en producción, el sitio falla porque busca datos que todavía no existen.

En Vercel se configuran las variables `DATABASE_URL`, con la cadena de producción, y `AUTH_SECRET`, con una llave distinta a la del computador. En la función de Vercel conviene elegir la región más cercana a la base de datos.

## Roles

| Rol | Puede |
|---|---|
| Estudiante | Responder, ver su progreso, editar su perfil y reportar preguntas |
| Docente | Todo lo anterior y además administrar preguntas, estudiantes y reportes |
| Administrador | Lo mismo que el docente, con permiso para restablecer claves de otros docentes |

Los permisos se revisan siempre en el servidor y no en el navegador.

## Reglas de los formularios

Las mismas reglas se usan en el navegador, para avisar en tiempo real, y en el servidor, que es quien decide. Están en `lib/validaciones.js`.

| Campo | Regla |
|---|---|
| Usuario | De 3 a 20 caracteres. Solo letras minúsculas sin tildes, números, punto y guion bajo |
| Nombre y apellido | De 2 a 50 caracteres. Letras con tildes, espacios, guion y apóstrofo |
| Correo | Debe tener un solo @ y un dominio con punto. Máximo 100 caracteres |
| Clave | De 8 a 64 caracteres, con al menos una letra y un número, sin espacios |
| Colegio | Opcional. Máximo 100 caracteres |

## Seguridad y privacidad

- Las claves se guardan cifradas con bcrypt
- El inicio de sesión, el cambio de clave y de correo y la eliminación de cuenta tienen límite de intentos fallidos
- Quien restablece una clave obliga al estudiante a crear una nueva en su primer ingreso
- La respuesta correcta nunca se envía al navegador antes de responder
- Cada persona puede descargar sus datos y eliminar su cuenta
- La política de privacidad está en la ruta `/privacidad`

Antes de abrir la plataforma a menores de edad, el colegio debe revisar la política y gestionar la autorización de los acudientes.

## Contenido de las preguntas

Las preguntas del banco inicial son originales y siguen el estilo de las pruebas Saber 11. No se copió material oficial del ICFES. Un docente de cada área debe revisar las respuestas y explicaciones antes de abrir las preguntas a los estudiantes.

## Problemas comunes

- En Windows, si PowerShell no deja correr `npm`, se ejecuta `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` una sola vez
- No se debe instalar Prisma 8 rc. El proyecto usa la versión 7 estable
- Si nadie puede iniciar sesión después de un despliegue, casi siempre falta aplicar una migración a la rama de producción

## Próximos pasos

- Recuperación de clave y verificación del correo
- Soporte de imágenes y fórmulas en las preguntas
- Cursos y grupos, con ranking por curso y exportación a Excel
- Práctica libre y simulacros con cronómetro
- Pruebas automáticas y monitoreo de errores

## Autor

Proyecto de [fsadriann](https://github.com/fsadriann).