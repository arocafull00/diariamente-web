# DiariaMente

DiariaMente es una PWA de apoyo a la terapia cognitivo-conductual (TCC). Ayuda a las personas pacientes a registrar situaciones emocionales de forma estructurada y permite a sus psicólogos/as consultar esos registros cuando existe una vinculación explícita entre ambos.

No sustituye la terapia, el criterio profesional ni la atención de urgencias. Es una herramienta de seguimiento entre sesiones.

## El problema

Entre sesiones es fácil que se pierda el contexto de una situación emocional: qué ocurrió, qué se pensó, cómo se reaccionó y con qué intensidad se sintieron las emociones. Recordarlo después, de memoria, suele ser incompleto.

Al mismo tiempo, el profesional necesita una forma clara y respetuosa con la privacidad de revisar los registros que una persona decide compartir dentro de su relación terapéutica.

## Para quién es

### Personas pacientes

Personas que trabajan en terapia TCC y quieren registrar sus experiencias emocionales en el momento o poco después de que ocurran.

Pueden:

- Crear registros emocionales guiados.
- Consultar su historial y el detalle de cada registro.
- Vincularse con un/a psicólogo/a mediante una invitación.
- Gestionar su perfil, recordatorios y permisos de notificaciones.

### Psicólogos y psicólogas

Profesionales que acompañan a pacientes y necesitan revisar los registros de las personas con las que tienen una relación activa en la aplicación.

Pueden:

- Generar y gestionar invitaciones para vincular pacientes.
- Consultar su lista de pacientes vinculados.
- Ver los registros autorizados de cada paciente y detectar los aún no revisados.
- Abrir el detalle de un registro y marcarlo como visto.

## Experiencia principal

### Registrar una situación emocional

El paciente completa un recorrido breve de cinco pasos:

1. Cuándo ocurrió.
2. Qué pasó.
3. Qué pensamientos tuvo.
4. Cómo reaccionó.
5. Qué emociones sintió y con qué intensidad.

Las emociones iniciales son alegría, tristeza, miedo, rabia, asco y ansiedad. Cada una se valora de 0 a 10. La aplicación calcula una intensidad global para facilitar la lectura del historial:

- Baja: media inferior a 3.
- Media: media inferior a 6.
- Alta: media igual o superior a 6.

El registro queda disponible para la propia persona paciente y, si existe una vinculación activa, para su profesional.

### Vincular paciente y profesional

El profesional crea un código de invitación con caducidad. El paciente lo introduce desde su perfil. La vinculación solo se crea después de validar que el código es válido, no se ha utilizado y la cuenta corresponde a un paciente sin otra relación activa.

### Revisar los registros en terapia

El profesional navega a un paciente vinculado para ver sus registros. Al abrir uno, puede leer la situación, pensamientos, conductas, emociones, intensidades y fecha. La apertura marca el registro como revisado para actualizar el contador de pendientes.

La persona paciente conserva la posibilidad de corregir la situación, los pensamientos y las conductas de sus propios registros. La edición de emociones no forma parte del alcance inicial.

## Producto instalable y recordatorios

DiariaMente funciona en navegador y puede instalarse como aplicación en móvil, tablet o escritorio compatible. Ofrece una pantalla de conexión no disponible y conserva una política estricta: no guarda en caché páginas autenticadas ni datos clínicos para uso sin conexión.

Las personas pacientes pueden activar recordatorios mediante notificaciones web. Los avisos no incluyen información clínica; invitan de forma general a crear un registro. El permiso siempre depende de la decisión de la persona usuaria.

## Privacidad y límites de acceso

DiariaMente trata información potencialmente sensible. Por ello:

- Cada usuario accede solo a los datos que le corresponden.
- Un profesional solo puede ver datos de pacientes con vínculo activo.
- Las autorizaciones se verifican en el servidor en cada lectura y mutación.
- Los datos clínicos no se incluyen en notificaciones push, analítica ni registros de auditoría.
- Las cuentas y sus datos se eliminan de forma coordinada cuando la persona lo solicita.

El uso de proveedores de infraestructura no constituye por sí mismo conformidad legal o sanitaria. Antes de un uso clínico real deben definirse las políticas de retención, copias de seguridad, tratamiento de datos y los requisitos regulatorios aplicables.

## Principios de producto

- Registro rápido y guiado, sin convertir el ejercicio terapéutico en un formulario innecesariamente complejo.
- Separación clara de roles y consentimiento explícito en la relación paciente-profesional.
- Privacidad por defecto: sin borradores clínicos en almacenamiento local ni caché de contenido autenticado.
- Accesible desde la web e instalable sin depender de una aplicación nativa.
- El profesional obtiene contexto para la sesión; no recibe una herramienta de diagnóstico automático.

## Alcance inicial

El alcance actual se centra en el registro emocional TCC, la relación paciente-profesional, la consulta de registros, las invitaciones y los recordatorios web. No incluye diagnóstico, recomendaciones terapéuticas automatizadas, atención de crisis ni colaboración entre múltiples profesionales sobre un mismo caso.
