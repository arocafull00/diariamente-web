# DiariaMente — Adaptación a PWA con Next.js

## Qué es

DiariaMente será una **Progressive Web App** de apoyo a la terapia cognitivo-conductual (TCC), accesible desde navegador e instalable en móvil, tablet y escritorio.

Conecta a **pacientes** y **psicólogos/as** para que el paciente registre situaciones emocionales de forma estructurada y el profesional pueda revisar esos registros de sus pacientes vinculados.

La nueva versión sustituye la aplicación React Native / Expo por una única aplicación web con:

- Next.js con App Router.
- Tailwind CSS.
- Componentes shadcn/ui.
- Clerk para autenticación.
- Neon PostgreSQL como base de datos.
- Zustand para estado global exclusivamente de cliente.
- Renderizado en servidor como estrategia principal.
- Funcionalidad PWA e instalación desde el navegador.

Modo visual inicial: solo claro.
Zona horaria funcional: `Europe/Madrid`.

---

## Objetivos de la adaptación

1. Mantener todos los flujos actuales de pacientes y psicólogos.
2. Priorizar Server Components y SSR para reducir JavaScript enviado al cliente.
3. Evitar cargar datos sensibles desde el navegador cuando puedan obtenerse en el servidor.
4. Centralizar autenticación y gestión de sesiones en Clerk.
5. Utilizar Neon como PostgreSQL administrado y fuente de verdad de los datos de negocio.
6. Convertir la aplicación en una PWA instalable y responsive.
7. Sustituir las notificaciones locales de Expo por web push gestionado desde backend.
8. Mantener una arquitectura sencilla, sin convertir cada botón en una ceremonia distribuida.

---

## Stack técnico

| Capa | Tecnología |
|---|---|
| Framework | Next.js con App Router |
| Lenguaje | TypeScript estricto |
| Renderizado | React Server Components y SSR por defecto |
| Estilos | Tailwind CSS |
| Componentes | shadcn/ui |
| Autenticación | Clerk |
| Base de datos | Neon PostgreSQL |
| ORM | Drizzle ORM |
| Driver | `@neondatabase/serverless` |
| Estado de cliente | Zustand |
| Validación | Zod |
| Formularios | React Hook Form + componentes shadcn/ui |
| Mutaciones | Server Actions |
| Endpoints externos | Route Handlers |
| PWA | Web App Manifest + Service Worker |
| Notificaciones | Web Push + VAPID + tarea programada |
| Despliegue | Vercel |
| Tests | Vitest, Testing Library y Playwright |

### Responsabilidad de cada herramienta

- **Clerk** gestiona identidad, sesiones, login con email, Google, recuperación de contraseña y eliminación de la identidad.
- **Neon** almacena perfiles, relaciones, invitaciones, registros emocionales, emociones personalizadas, recordatorios y suscripciones push.
- **Drizzle** define el esquema, migraciones y consultas tipadas.
- **Zustand** gestiona únicamente estado interactivo del navegador, como pasos del wizard, borradores temporales y estado de diálogos.
- **Server Components** obtienen los datos iniciales y generan la interfaz protegida en el servidor.
- **Server Actions** realizan las operaciones de escritura y vuelven a validar las rutas afectadas.

---

## Principios de arquitectura SSR

### Server Components por defecto

Todas las páginas serán Server Components salvo las partes que necesiten eventos del navegador, estado local o APIs exclusivamente de cliente.

Ejemplos renderizados en servidor:

- Redirección inicial por sesión y rol.
- Lista de registros del paciente.
- Lista de pacientes del psicólogo.
- Detalle de un registro.
- Perfil del usuario.
- Verificación de permisos.
- Lectura de invitaciones y vínculos.

### Client Components limitados

Se usará `"use client"` únicamente en componentes como:

- Wizard de creación de registros.
- Stepper.
- Selectores de emociones.
- Slider de intensidad.
- Diálogos y dropdowns interactivos.
- Configuración de recordatorios.
- Registro del Service Worker.
- Suscripción a notificaciones push.

### Datos de servidor frente a Zustand

Zustand no almacenará:

- La sesión de Clerk.
- El perfil completo.
- La lista canónica de registros.
- La lista canónica de pacientes.
- Los permisos del usuario.

Estos datos se consultarán desde Server Components o Server Actions. Zustand podrá almacenar:

- Paso actual del wizard.
- Datos temporales del nuevo registro antes de enviarlo.
- Estado visual del sidebar móvil.
- Filtros locales no persistentes.
- Estado del aviso de instalación PWA.

El store debe crearse por árbol de React y evitar un singleton compartido entre peticiones SSR. Si se usa persistencia, la hidratación debe controlarse para evitar diferencias entre servidor y cliente.

### Actualización de datos

Después de una mutación se usará `revalidatePath` para actualizar las páginas afectadas. Para interacciones rápidas pueden usarse `useOptimistic` y estados pendientes, sin duplicar toda la base de datos dentro del navegador por puro entusiasmo frontend.

---

## Autenticación y autorización con Clerk

### Métodos de acceso

- Email y contraseña.
- Google Sign-In.
- Recuperación de contraseña.
- Verificación de email gestionada por Clerk.

### Perfil de negocio

Clerk será la fuente de verdad de la identidad, pero los datos funcionales se guardarán en Neon.

La tabla `profiles` tendrá un campo `clerk_user_id` único. El rol y el estado del onboarding se consultarán desde Neon.

No se confiará únicamente en datos enviados por el cliente ni en el estado de Zustand para autorizar acciones.

### Protección de rutas

- `proxy.ts` aplicará `clerkMiddleware()` a las rutas necesarias.
- Los layouts protegidos comprobarán la sesión con `auth()`.
- Cada Server Action volverá a comprobar usuario, rol y propiedad del recurso.
- Las consultas incluirán siempre los filtros de autorización correspondientes.

### Alta de usuario

1. Clerk crea la identidad.
2. El usuario entra en `/onboarding`.
3. Selecciona su rol una única vez.
4. Completa nombre, apellidos y avatar.
5. Una Server Action crea o actualiza `profiles` en Neon.
6. Se redirige al dashboard correspondiente.

### Webhook de Clerk

Se añadirá `/api/webhooks/clerk` para sincronizar eventos importantes:

- Creación de usuario.
- Actualización de usuario.
- Eliminación de usuario.

El endpoint debe verificar la firma del webhook y procesar los eventos de forma idempotente.

---

## Tipos de usuario

| Rol | Valor | Descripción |
|---|---|---|
| Paciente | `patient` | Crea y edita sus registros emocionales, se vincula a un psicólogo y configura recordatorios. |
| Psicólogo/a | `psychologist` | Gestiona pacientes vinculados, genera invitaciones y consulta registros en modo lectura. |
| Admin | `admin` | Reservado para una futura interfaz administrativa. |

El rol se elige durante el onboarding y se guarda en `profiles.user_type`.

### Relación entre usuarios

```text
Psicólogo ──genera──▶ Invitation
                            │
Paciente ──usa código──────▶ psychologist_patient
                            │
Paciente ──crea────────────▶ patient_records
                            │
Psicólogo ──consulta───────▶ registros de pacientes vinculados
```

Aunque se mantiene una tabla puente, cada paciente tendrá como máximo un psicólogo activo mediante una restricción única sobre `psychologist_patient.patient_id`.

---

## Estructura de rutas

```text
/
├── sign-in
├── sign-up
├── onboarding
├── app/
│   ├── new-record                 → Solo paciente
│   ├── records                    → Solo paciente
│   ├── records/[recordId]         → Paciente propietario o psicólogo vinculado
│   ├── patients                   → Solo psicólogo
│   ├── patients/[patientId]       → Solo psicólogo vinculado
│   ├── invitations                → Solo psicólogo
│   ├── account                    → Ambos
│   └── settings                   → Ambos
├── offline                        → Pantalla sin conexión
└── api/
    ├── webhooks/clerk
    ├── push/subscribe
    ├── push/unsubscribe
    └── cron/reminders
```

Se usarán route groups para separar layouts públicos, autenticación y aplicación:

```text
src/app/
├── (public)/
├── (auth)/
├── (app)/
└── api/
```

### Destino inicial

La ruta `/` será un Server Component y redirigirá antes de renderizar contenido:

- Sin sesión → `/sign-in`.
- Sesión sin perfil completo → `/onboarding`.
- Paciente → `/app/new-record`.
- Psicólogo → `/app/patients`.

Esto sustituye el splash que esperaba a un provider de cliente.

---

## Navegación por rol

| Sección | Paciente | Psicólogo |
|---|---:|---:|
| Nuevo registro | Sí | No |
| Mis registros | Sí | No |
| Pacientes | No | Sí |
| Invitaciones | No | Sí |
| Perfil | Sí | Sí |
| Ajustes | Sí | Sí |

La interfaz ocultará las opciones no disponibles, pero la seguridad real estará en el servidor.

---

## Pantallas

### 1. Inicio y redirección

No habrá splash dependiente de hidratación. La sesión de Clerk y el perfil de Neon se resolverán en servidor y se ejecutará una redirección por rol.

Se usarán `loading.tsx` y skeletons de shadcn/ui cuando una navegación necesite mostrar estado de carga.

### 2. Login

- Componentes de Clerk personalizados visualmente para integrarse con shadcn/ui.
- Email y contraseña.
- Google Sign-In.
- Enlace de recuperación.
- Enlace de creación de cuenta.
- Redirección a onboarding cuando el perfil funcional no esté completo.

### 3. Registro y onboarding

El registro de identidad se delega en Clerk. Después se mostrará un wizard propio:

1. Nombre y apellidos.
2. Tipo de usuario.
3. Avatar opcional.
4. Resumen y confirmación.

Los avatares iniciales serán recursos estáticos incluidos en `public/avatars`. Esto evita incorporar almacenamiento externo solo para guardar seis dibujos circulares. Si posteriormente se permiten imágenes subidas por usuarios, se añadirá almacenamiento de objetos independiente.

### 4. Nuevo registro

Wizard TCC de cinco pasos:

| Paso | Pregunta | Campo | Validación |
|---|---|---|---|
| 0 | ¿Cuándo ocurrió? | Fecha y hora | Siempre válido |
| 1 | ¿Qué ha pasado? | Situación | Obligatoria |
| 2 | ¿Qué pensamientos tuviste? | Pensamientos | Obligatorios |
| 3 | ¿Cómo reaccionaste? | Conductas | Obligatorias |
| 4 | ¿Qué emociones sentiste? | Emociones e intensidad | Al menos una emoción |

Emociones base:

- Alegría.
- Tristeza.
- Miedo.
- Rabia.
- Asco.
- Ansiedad.

La intensidad de cada emoción será de 0 a 10. La intensidad global se calculará en servidor al guardar:

- `LOW`: media menor que 3.
- `MEDIUM`: media menor que 6.
- `HIGH`: media igual o superior a 6.

El estado temporal del wizard puede vivir en Zustand. La validación final y el cálculo se repetirán en la Server Action.

Por privacidad, el borrador no se persistirá en `localStorage` de forma predeterminada.

### 5. Mis registros

- Renderizado inicial en servidor.
- Paginación por cursor o botón “Cargar más”.
- Filtros opcionales por fecha e intensidad mediante search params.
- Cada elemento muestra situación, emoción dominante y fecha.
- Navegación al detalle.

No se necesita pull-to-refresh. El navegador ya posee botones, navegación y otros descubrimientos de siglos de interfaz web.

### 6. Pacientes

- Solo psicólogo.
- Lista de pacientes vinculados.
- Contador de registros no vistos.
- Acción para generar invitación.
- Empty state.
- Búsqueda y paginación cuando el volumen lo requiera.

### 7. Perfil

Contenido común:

- Avatar.
- Nombre completo.
- Rol.
- Fecha de alta.
- Email obtenido de Clerk.
- Acceso a ajustes.

Solo paciente:

- Número total de registros.
- Estado del vínculo con su psicólogo.
- Introducción de código de invitación.
- Desvinculación con confirmación.

### 8. Invitaciones

- Solo psicólogo.
- Código de ocho caracteres.
- Copiar al portapapeles.
- Compartir mediante Web Share API cuando esté disponible.
- Regenerar e invalidar el anterior.
- Fecha de caducidad configurable.
- Explicación del proceso.

### 9. Registros de un paciente

- Solo para el psicólogo vinculado.
- Cabecera con datos mínimos del paciente.
- Lista paginada de registros.
- Contador de nuevos.
- Al abrir un registro, se marca como visto.

### 10. Detalle del registro

Muestra:

- Situación.
- Pensamientos.
- Conductas.
- Emociones con intensidad.
- Fecha y hora.

| Acción | Paciente | Psicólogo |
|---|---:|---:|
| Ver campos | Sí | Sí |
| Editar situación | Sí | No |
| Editar pensamientos | Sí | No |
| Editar conductas | Sí | No |
| Editar emociones | No inicialmente | No |
| Marcar como visto | No | Sí |

La autorización se comprobará en la consulta del servidor, no después de enviar el registro completo al navegador.

### 11. Ajustes

- Editar nombre y apellidos.
- Configurar recordatorios para pacientes.
- Gestionar permisos de notificaciones.
- Cerrar sesión con Clerk.
- Eliminar cuenta y datos.

La eliminación debe requerir confirmación explícita y ejecutarse desde servidor. Se eliminarán los datos de Neon y la identidad de Clerk de forma coordinada.

### 12. Offline

La PWA tendrá una pantalla `/offline` para cuando no haya conexión.

No se cachearán páginas autenticadas ni registros clínicos. El modo offline inicial permitirá abrir la aplicación y mostrar una explicación, pero no consultar datos sensibles previamente visitados.

---

## Flujos principales

### Autenticación

```text
Petición inicial
  → Clerk: ¿hay sesión?
      No → /sign-in
      Sí → Neon: ¿hay perfil completo?
          No → /onboarding
          Sí → redirección por rol
```

### Vinculación paciente y psicólogo

1. El psicólogo abre Invitaciones.
2. Se genera un código aleatorio, único y con caducidad.
3. El paciente introduce el código desde su perfil.
4. Una Server Action valida:
   - Sesión activa.
   - Rol de paciente.
   - Código existente y no caducado.
   - Invitación no utilizada.
   - Paciente sin vínculo activo.
5. En una transacción se crea `psychologist_patient` y se marca la invitación como utilizada.

### Creación de un registro

```text
Paciente completa el wizard
  → validación cliente
  → Server Action
  → validación de sesión y rol
  → validación Zod
  → inserción en patient_records
  → revalidatePath('/app/records')
  → confirmación y reset del wizard
```

### Lectura por el psicólogo

```text
Psicólogo abre un paciente
  → servidor comprueba vínculo
  → obtiene registros autorizados
  → abre detalle
  → Server Action marca seen_at
  → se actualiza el contador
```

---

## Modelo de datos en Neon

### `profiles`

| Campo | Tipo orientativo | Uso |
|---|---|---|
| `id` | UUID | Identificador interno |
| `clerk_user_id` | Text unique | Identidad de Clerk |
| `first_name` | Text | Nombre |
| `last_name` | Text | Apellidos |
| `full_name` | Text | Nombre mostrado |
| `avatar_url` | Text nullable | Avatar |
| `user_type` | Enum | `patient`, `psychologist`, `admin` |
| `is_profile_completed` | Boolean | Control de onboarding |
| `created_at` | Timestamptz | Alta |
| `updated_at` | Timestamptz | Última actualización |

### `patient_records`

| Campo | Tipo orientativo | Uso |
|---|---|---|
| `id` | UUID | Identificador |
| `patient_id` | UUID FK | Paciente propietario |
| `occurred_at` | Timestamptz | Fecha y hora del evento |
| `situation` | Text | Situación |
| `thoughts` | Text | Pensamientos |
| `behaviours` | Text | Conductas |
| `emotions` | JSONB | `[{ name, intensity }]` |
| `emotion_intensity` | Enum | `LOW`, `MEDIUM`, `HIGH` |
| `is_seen_by_psychologist` | Boolean | Compatibilidad y consultas rápidas |
| `seen_at` | Timestamptz nullable | Momento de lectura |
| `created_at` | Timestamptz | Creación |
| `updated_at` | Timestamptz | Edición |

Se consolida `date` y `time` en `occurred_at` para evitar inconsistencias. La aplicación formateará el valor usando `Europe/Madrid`.

### `psychologist_patient`

| Campo | Uso |
|---|---|
| `id` | Identificador |
| `psychologist_id` | FK a `profiles` |
| `patient_id` | FK a `profiles` |
| `created_at` | Fecha de vínculo |

Restricciones:

- Unique en `patient_id` para limitar un psicólogo activo por paciente.
- Unique compuesto en `psychologist_id`, `patient_id`.

### `invitations`

| Campo | Uso |
|---|---|
| `id` | Identificador |
| `code` | Código único de ocho caracteres |
| `psychologist_id` | Creador |
| `patient_id` | Paciente que lo utilizó, nullable |
| `used_at` | Momento de uso, nullable |
| `expires_at` | Caducidad |
| `created_at` | Creación |

### `custom_emotions`

| Campo | Uso |
|---|---|
| `id` | Identificador |
| `user_id` | Paciente propietario |
| `name` | Nombre de emoción |
| `created_at` | Creación |

Unique compuesto en `user_id`, `name`.

### `user_reminders`

| Campo | Uso |
|---|---|
| `user_id` | Paciente |
| `enabled` | Activado |
| `frequency` | `daily` o `weekly` |
| `time` | Hora local `HH:mm` |
| `days` | Días seleccionados |
| `timezone` | Por defecto `Europe/Madrid` |
| `updated_at` | Actualización |

### `push_subscriptions`

| Campo | Uso |
|---|---|
| `id` | Identificador |
| `user_id` | Propietario |
| `endpoint` | Endpoint push único |
| `p256dh` | Clave pública |
| `auth` | Secreto de autenticación |
| `user_agent` | Diagnóstico |
| `created_at` | Alta |
| `last_used_at` | Último envío correcto |

### Diagrama

```text
profiles (psychologist) ──< invitations
profiles (psychologist) ──< psychologist_patient >── profiles (patient)
profiles (patient)      ──< patient_records
profiles                ──< custom_emotions
profiles                ──1 user_reminders
profiles                ──< push_subscriptions
```

---

## PWA

### Manifest

Se creará `src/app/manifest.ts` con:

- Nombre y nombre corto.
- `display: standalone`.
- Color de fondo y tema.
- Ruta inicial.
- Iconos de 192 y 512 píxeles.
- Iconos maskable.

### Service Worker

Se añadirá un Service Worker propio en `public/sw.js` y un componente cliente para registrarlo.

Estrategia de caché:

- Cache-first para iconos, fuentes y assets versionados.
- Stale-while-revalidate para recursos públicos no sensibles.
- Network-only para rutas autenticadas, Server Actions, endpoints y datos clínicos.
- Fallback a `/offline` cuando no haya conexión.

### Instalación

- Botón de instalación cuando el navegador exponga `beforeinstallprompt`.
- Instrucciones específicas para Safari/iOS cuando no exista prompt automático.
- Diseño responsive para móvil, tablet y escritorio.

### Actualizaciones

Cuando haya una nueva versión del Service Worker, se mostrará una notificación dentro de la interfaz para recargar la aplicación de forma controlada.

---

## Recordatorios y notificaciones web push

Las notificaciones locales de Expo no tienen una equivalencia directa y fiable en una web cerrada. Se sustituirán por web push.

### Flujo

1. El paciente activa recordatorios.
2. La aplicación solicita permiso de notificaciones.
3. El navegador crea una `PushSubscription`.
4. La suscripción se guarda en Neon.
5. Una tarea programada ejecuta `/api/cron/reminders`.
6. El servidor consulta recordatorios vencidos según zona horaria.
7. Envía una notificación usando VAPID.
8. Al pulsarla, el Service Worker abre `/app/new-record`.

### Mensaje inicial

- Título: “¿Deseas crear algún registro?”
- Cuerpo: “Es hora de registrar tu estado emocional del día.”

### Consideraciones

- El usuario debe conceder permiso explícito.
- Las suscripciones expiradas se eliminarán cuando el proveedor push devuelva un error permanente.
- Los recordatorios no deben incluir datos clínicos ni contenido sensible en el texto visible.

---

## Organización del código

```text
src/
├── app/
│   ├── (public)/
│   ├── (auth)/
│   ├── (app)/
│   │   └── app/
│   │       ├── new-record/
│   │       ├── records/
│   │       ├── patients/
│   │       ├── invitations/
│   │       ├── account/
│   │       └── settings/
│   ├── api/
│   │   ├── webhooks/clerk/
│   │   ├── push/
│   │   └── cron/reminders/
│   ├── manifest.ts
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                      → shadcn/ui
│   ├── layout/
│   ├── records/
│   ├── patients/
│   ├── invitations/
│   └── pwa/
├── features/
│   ├── auth/
│   ├── onboarding/
│   ├── records/
│   ├── patients/
│   ├── invitations/
│   ├── reminders/
│   └── profile/
├── db/
│   ├── index.ts
│   ├── schema/
│   ├── queries/
│   └── migrations/
├── lib/
│   ├── auth/
│   ├── validation/
│   ├── push/
│   ├── dates/
│   └── utils.ts
├── stores/
│   ├── new-record-store.ts
│   └── ui-store.ts
└── types/
```

### Organización por feature

Cada feature puede contener:

```text
records/
├── actions.ts
├── queries.ts
├── schemas.ts
├── types.ts
└── components/
```

Las consultas de Neon y las Server Actions permanecerán en módulos marcados como solo servidor para evitar que código sensible termine en el bundle cliente.

---

## Seguridad y privacidad

DiariaMente maneja información de salud potencialmente sensible. La arquitectura debe incluir:

- Autorización en cada consulta y mutación.
- Validación Zod en servidor.
- Protección CSRF proporcionada por el flujo de Server Actions y configuración segura de Clerk.
- HTTPS obligatorio.
- Secretos exclusivamente en variables de entorno del servidor.
- No incluir datos clínicos en logs, analytics o mensajes push.
- No cachear HTML personalizado ni respuestas de API con datos privados.
- Eliminación coordinada de datos.
- Backups y política de retención definida.
- Auditoría de accesos como mejora recomendada antes de producción real.
- Revisión contractual y legal de los proveedores y sus regiones de tratamiento.

### TODO

- Verificación en dos pasos obligatoria para psicólogos (Clerk la soporta: comprobar `twoFactorEnabled` y redirigir a una pantalla de activación).

Usar Clerk, Neon y Vercel no convierte automáticamente el producto en conforme con RGPD ni con requisitos sanitarios. Eso sería demasiado cómodo para ser cierto.

---

## Variables de entorno

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

DATABASE_URL=

NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=mailto:contacto@dominio.com

CRON_SECRET=
NEXT_PUBLIC_APP_URL=
```

`DATABASE_URL` debe utilizar la cadena recomendada para entornos serverless y pooling.

---

## Estrategia de despliegue

### Vercel

- Aplicación Next.js.
- Server Actions y Route Handlers.
- Tarea programada para recordatorios.
- Variables de entorno separadas por entorno.
- Protección del endpoint cron mediante secreto.

### Neon

- Rama de producción.
- Rama por preview o entorno cuando resulte útil.
- Migraciones de Drizzle ejecutadas desde CI.
- Conexión con pooling.

### Clerk

- Instancia de desarrollo y producción.
- URLs autorizadas para cada entorno.
- Google OAuth configurado.
- Webhook apuntando al entorno correspondiente.

---

## Estrategia de migración desde Expo y Supabase

### Fase 1. Base del proyecto

- Crear Next.js con App Router y TypeScript.
- Configurar Tailwind y shadcn/ui.
- Definir layouts responsive.
- Añadir manifest e iconos PWA.

### Fase 2. Clerk

- Configurar login, registro y Google.
- Crear onboarding.
- Proteger rutas.
- Implementar sincronización mediante webhook.

### Fase 3. Neon y Drizzle

- Crear esquema.
- Añadir migraciones.
- Implementar consultas y autorización.
- Crear datos de prueba.

### Fase 4. Funcionalidad principal

1. Nuevo registro.
2. Mis registros.
3. Detalle.
4. Invitaciones.
5. Vínculo paciente-psicólogo.
6. Lista y detalle de pacientes.
7. Perfil y ajustes.

### Fase 5. PWA

- Service Worker.
- Pantalla offline.
- Instalación.
- Gestión de actualizaciones.
- Auditoría de caché para evitar datos privados.

### Fase 6. Recordatorios

- Suscripciones push.
- Preferencias en Neon.
- Cron.
- Envío VAPID.
- Limpieza de suscripciones inválidas.

### Fase 7. Migración de datos

Si deben conservarse usuarios existentes:

- Exportar perfiles y datos desde Supabase.
- Crear identidades equivalentes en Clerk mediante un proceso controlado.
- Mapear `auth.users.id` antiguo a `clerk_user_id` nuevo.
- Importar datos en Neon conservando relaciones.
- Validar conteos y muestras.
- Planificar restablecimiento de contraseña cuando no sea posible migrar credenciales.

La interfaz de React Native no se reutilizará directamente. Sí pueden reutilizarse reglas de negocio, schemas, enums, textos y casos de prueba adaptados.

---

## Testing

### Unitarios

- Cálculo de intensidad global.
- Validación de registros.
- Generación y caducidad de invitaciones.
- Reglas de recordatorios.
- Transformaciones de fecha y zona horaria.

### Integración

- Server Actions contra una base de datos de test.
- Autorización por rol.
- Vínculo mediante invitación.
- Lectura de registros por psicólogo.
- Eliminación de cuenta.

### E2E

- Registro y onboarding de paciente.
- Registro y onboarding de psicólogo.
- Creación de registro.
- Invitación y vinculación.
- Visualización y marcado como visto.
- Instalación y navegación básica PWA.

---

## Resumen por rol

### Paciente puede

- Registrarse e iniciar sesión con Clerk.
- Completar onboarding.
- Crear registros emocionales.
- Consultar y editar sus registros permitidos.
- Crear emociones personalizadas.
- Vincularse o desvincularse de un psicólogo.
- Configurar recordatorios push.
- Editar perfil.
- Cerrar sesión.
- Eliminar su cuenta.

### Psicólogo puede

- Registrarse e iniciar sesión.
- Generar y regenerar invitaciones.
- Ver pacientes vinculados.
- Consultar registros de sus pacientes.
- Marcar registros como vistos al abrirlos.
- Editar perfil.
- Cerrar sesión.
- Eliminar su cuenta.

### Psicólogo no puede

- Crear registros emocionales.
- Editar registros de pacientes.
- Configurar recordatorios de paciente.

---

## Decisiones principales

1. **Next.js App Router** sustituye Expo Router.
2. **Clerk** sustituye Supabase Auth.
3. **Neon + Drizzle** sustituyen Supabase Database.
4. Los avatares predefinidos pasan a recursos estáticos.
5. **Server Components y Server Actions** sustituyen la mayoría de providers y llamadas cliente.
6. **Zustand** queda limitado a estado interactivo y temporal.
7. Las notificaciones locales se sustituyen por **web push + cron**.
8. La PWA cachea únicamente recursos seguros y públicos.
9. Los permisos se comprueban en servidor en cada operación.
10. La aplicación se diseña primero como web responsive, no como una app móvil disfrazada con una barra lateral.
