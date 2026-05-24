# Manual de Usuario - Panel de Administración KvaTel

Este manual está dirigido a usuarios con conocimientos tecnológicos básicos. Explica cómo acceder, usar y mantener el contenido del sitio web de KvaTel desde el panel de administración.

## Acceso al sistema

1. Abre tu navegador web (Chrome, Firefox, Safari, Edge, etc.).
2. En la barra de direcciones, escribe la siguiente URL y presiona Enter:

   ```
   https://kvatel.com/admin
   ```

3. Si no has iniciado sesión, serás redirigido automáticamente a la página de inicio de sesión.

**Requisitos:** Necesitas conexión a internet y el código de acceso proporcionado por el administrador del sistema.

## Proceso de inicio de sesión

1. En la pantalla de login verás el título **KvaTel Admin** y un campo para ingresar el código de acceso.
2. Escribe el código de acceso en el campo correspondiente.
3. Haz clic en el botón **Entrar** o presiona Enter.
4. Mientras se verifica el código, el botón mostrará **Verificando...**
5. Si el código es correcto, accederás al panel principal (`/admin`).
6. Si el código es incorrecto, aparecerá un mensaje de error en rojo. Verifica que no haya espacios extra y vuelve a intentarlo.

**Nota:** El panel utiliza un código de acceso en lugar de usuario y contraseña tradicionales. No compartas este código con personas no autorizadas.

## Estructura general del panel

Una vez dentro, verás dos áreas principales:

- **Menú lateral izquierdo (barra azul):** Contiene los accesos a todas las secciones. La sección activa se resalta con un fondo más claro.
- **Área de contenido (derecha):** Muestra el formulario y la lista de elementos de la sección seleccionada.

En la parte inferior del menú lateral encontrarás el botón **Cerrar sesión**, que te devuelve a la pantalla de login.

### Patrón común en las secciones de contenido

Varias secciones (Servicios, Trabajos, Clientes y Testimonios) siguen el mismo esquema de trabajo:

1. **Formulario a la izquierda** — Para crear un elemento nuevo o editar uno existente.
2. **Lista a la derecha** — Muestra los elementos actuales con botones **Editar** y **Eliminar**.
3. **Mensajes de confirmación** — Aparecen en verde cuando la acción fue exitosa, o en rojo si hubo un error.
4. **Confirmación al eliminar** — El sistema pedirá confirmación antes de borrar cualquier elemento.

---

## Guía de navegación por secciones

### Inicio

**Ruta:** `/admin`

Pantalla de bienvenida del panel. Muestra tarjetas con acceso directo a cada sección de contenido:

| Sección      | Qué puedes gestionar                          |
|--------------|-----------------------------------------------|
| Servicios    | Título, descripción e icono de cada servicio  |
| Trabajos     | Imagen, título y descripción de cada proyecto |
| Clientes     | Nombres mostrados en la sección de clientes    |
| Testimonios  | Citas con nombre y cargo del cliente          |
| Contacto     | Teléfono, email y dirección                   |
| Mensajes     | Mensajes recibidos del formulario de contacto |
| Configuración| Código de acceso al panel                     |

Haz clic en cualquier tarjeta para ir directamente a esa sección.

---

### Servicios

**Ruta:** `/admin/services`

Administra la sección **Nuestros Servicios** de la página pública.

#### Campos disponibles

| Campo         | Descripción                                              | Obligatorio |
|---------------|----------------------------------------------------------|-------------|
| Icono         | Símbolo visual del servicio (selector desplegable)       | Sí          |
| Título        | Nombre corto del servicio                                | Sí          |
| Descripción   | Texto explicativo del servicio                           | Sí          |

#### Iconos disponibles

Puedes elegir entre: `home`, `business`, `router`, `electrical_services`, `build`, `engineering`, `settings`, `wifi`, `cable` y `power`. Al seleccionar uno, verás una vista previa debajo del selector.

#### Cómo crear un servicio

1. Selecciona un icono del menú desplegable.
2. Escribe el título y la descripción.
3. Haz clic en **Crear servicio**.
4. El nuevo servicio aparecerá en la lista de la derecha y en el sitio web.

#### Cómo editar un servicio

1. En la lista **Servicios actuales**, haz clic en **Editar** junto al servicio deseado.
2. El formulario se llenará con los datos actuales y el título cambiará a **Editar servicio**.
3. Modifica los campos necesarios.
4. Haz clic en **Guardar cambios**, o en **Cancelar** para descartar los cambios.

#### Cómo eliminar un servicio

1. Haz clic en **Eliminar** junto al servicio.
2. Confirma la acción en el diálogo que aparece.
3. El servicio desaparecerá del panel y del sitio web.

---

### Trabajos

**Ruta:** `/admin/portfolio`

Administra la sección **Nuestros Trabajos** (portafolio de proyectos) de la página pública.

#### Campos disponibles

| Campo         | Descripción                                    | Obligatorio |
|---------------|------------------------------------------------|-------------|
| Imagen        | Fotografía del proyecto                        | Sí          |
| Título        | Nombre del proyecto                            | Sí          |
| Descripción   | Breve explicación del trabajo realizado        | Sí          |

#### Cómo subir una imagen

1. Haz clic en **Elegir imagen** (o **Cambiar imagen** si ya hay una cargada).
2. Selecciona un archivo de imagen desde tu computadora.
3. Espera a que termine la carga (el botón mostrará **Subiendo...**).
4. Verás una vista previa de la imagen antes de guardar.

**Restricciones de imagen:**
- Solo se aceptan archivos de imagen (JPG, PNG, WebP, etc.).
- Tamaño máximo: **5 MB**.

#### Cómo crear, editar y eliminar un proyecto

El proceso es igual al de Servicios: completa el formulario con imagen, título y descripción, y usa los botones **Crear proyecto**, **Editar**, **Guardar cambios** o **Eliminar** según corresponda.

---

### Clientes

**Ruta:** `/admin/clients`

Administra la sección **Nuestros Clientes** de la página pública, donde se muestran los nombres de empresas o personas con las que KvaTel ha trabajado.

#### Campos disponibles

| Campo  | Descripción                          | Obligatorio |
|--------|--------------------------------------|-------------|
| Nombre | Nombre del cliente o empresa         | Sí          |

#### Operaciones

- **Crear cliente:** Escribe el nombre y haz clic en **Crear cliente**.
- **Editar cliente:** Haz clic en **Editar**, modifica el nombre y guarda con **Guardar cambios**.
- **Eliminar cliente:** Haz clic en **Eliminar** y confirma la acción.

Esta sección es la más sencilla del panel: solo requiere el nombre del cliente.

---

### Testimonios

**Ruta:** `/admin/testimonials`

Administra las reseñas o citas de clientes que aparecen en la página pública.

#### Campos disponibles

| Campo              | Descripción                              | Obligatorio |
|--------------------|------------------------------------------|-------------|
| Cita               | Texto del testimonio (entre comillas)      | Sí          |
| Nombre del cliente | Persona que dio el testimonio            | Sí          |
| Cargo del cliente  | Rol o empresa de quien da el testimonio  | Sí          |

#### Ejemplo de testimonio

- **Cita:** *"Excelente servicio, muy profesionales y puntuales."*
- **Nombre del cliente:** Juan Pérez
- **Cargo del cliente:** Gerente, Empresa ABC

#### Operaciones

Usa el mismo flujo de crear, editar y eliminar que en las secciones anteriores. En la lista verás una vista previa de cada testimonio con la cita en cursiva y los datos del autor debajo.

---

### Contacto

**Ruta:** `/admin/contact`

Administra la información de contacto que se muestra en la página pública (teléfono, email y dirección).

A diferencia de otras secciones, aquí no se crean elementos individuales: se edita un único registro de contacto.

#### Campos disponibles

| Campo     | Descripción                                              | Obligatorio |
|-----------|----------------------------------------------------------|-------------|
| Teléfono  | Número(s) de contacto. Puedes usar varias líneas         | Sí          |
| Email     | Correo electrónico de contacto                           | Sí          |
| Dirección | Dirección física de la empresa                           | Sí          |

#### Cómo actualizar la información

1. Modifica los campos que necesites.
2. Haz clic en **Guardar cambios**.
3. Verás el mensaje *"Información de contacto actualizada"* si todo fue correcto.

**Consejo para teléfono:** Si tienes más de un número, escríbelos en líneas separadas. Cada línea se mostrará como un número distinto en el sitio.

---

### Mensajes

**Ruta:** `/admin/messages`

Consulta los mensajes enviados por visitantes a través del formulario de contacto de la página pública. Esta sección es de **solo lectura y eliminación** — no puedes crear mensajes manualmente.

#### Información que muestra cada mensaje

| Columna   | Descripción                                      |
|-----------|--------------------------------------------------|
| Fecha     | Fecha y hora de envío (zona horaria Colombia)    |
| Nombre    | Nombre del remitente                             |
| Email     | Correo del remitente                             |
| Teléfono  | Teléfono del remitente (puede estar vacío: —)    |
| Mensaje   | Contenido del mensaje (vista previa truncada)    |
| Acciones  | Botones **Ver** / **Ocultar** y **Eliminar**     |

#### Cómo leer un mensaje completo

1. En la columna **Mensaje**, los textos largos se muestran recortados.
2. Haz clic en **Ver** para expandir y leer el mensaje completo.
3. Haz clic en **Ocultar** para volver a la vista resumida.

#### Cómo eliminar un mensaje

1. Haz clic en **Eliminar** junto al mensaje.
2. Confirma la acción. **Esta operación no se puede deshacer.**

Si no hay mensajes, verás el texto *"No hay mensajes registrados."*

---

### Configuración

**Ruta:** `/admin/settings`

Administra la seguridad del panel cambiando el código de acceso.

#### Estado del código

Al entrar, verás un aviso que indica cómo se valida el código actualmente:

- **Verde:** El código se valida desde la base de datos.
- **Amarillo:** El código se valida desde una variable de entorno temporal. Al guardar un nuevo código aquí, esa variable dejará de usarse.

#### Cómo cambiar el código de acceso

1. Escribe el **Código actual** (el que usas para entrar).
2. Escribe el **Nuevo código**.
3. Repite el nuevo código en **Confirmar nuevo código**.
4. Haz clic en **Actualizar código**.

#### Requisitos del nuevo código

- Mínimo **8 caracteres**.
- El panel muestra un indicador de fortaleza mientras escribes.
- Si el código es considerado débil, deberás marcar una casilla de confirmación antes de poder guardarlo.

#### Después de cambiar el código

Al guardar exitosamente, el sistema te redirige automáticamente a la pantalla de login. Deberás iniciar sesión con el **nuevo código**.

**Importante:** Anota el nuevo código en un lugar seguro. Si lo olvidas, un administrador técnico deberá restablecerlo.

---

## Consejos generales

- **Los cambios son inmediatos:** Al guardar en cualquier sección, el contenido se actualiza en el sitio web público (`https://kvatel.com`) de forma automática.
- **Siempre cierra sesión** cuando termines, especialmente en computadoras compartidas. Usa el botón **Cerrar sesión** del menú lateral.
- **Antes de eliminar**, verifica que realmente quieres borrar el elemento. Las eliminaciones no se pueden deshacer desde el panel.
- **Si algo no carga**, recarga la página con F5 o Ctrl+R. Si el problema persiste, cierra sesión e ingresa de nuevo.
- **Para soporte técnico**, contacta al administrador del sistema si olvidaste el código de acceso o encuentras un error que no puedes resolver.
