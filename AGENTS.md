# DiariaMente — Guía para agentes

PWA de apoyo a la terapia cognitivo-conductual (TCC) que conecta **pacientes** y **psicólogos/as**. El paciente registra situaciones emocionales; el profesional consulta los registros de sus pacientes vinculados.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Clerk · Neon PostgreSQL · Drizzle ORM · Tailwind CSS v4 · shadcn/ui · Zustand · Zod · React Hook Form · Sonner · Web Push.

Especificación completa del producto, rutas, modelo de datos y fases: `PROJECT.md`.

## Documentación

Next.js cambia entre versiones. Antes de escribir o modificar código de Next.js, consulta la documentación **exacta** de esta versión en `node_modules/next/dist/docs/`.

No asumas APIs de versiones anteriores ni de la documentación sin versionar.

## TypeScript

**Contrato de parámetros:** No marques parámetros como opcionales (`?`) si en la práctica son obligatorios (por ejemplo, si se lanza un error cuando faltan). La firma debe reflejar el comportamiento real (`param: string`) para que el contrato sea claro en compile time.

**Validaciones:** No dupliques comprobaciones (`null`/`undefined`, `Array.isArray`, etc.) en varias capas si ya están cubiertas en funciones internas. Centraliza la responsabilidad en un solo lugar.

**Nombres:** No renombres propiedades intermedias sin aportar valor. Eso dificulta seguir el flujo de datos.

**Tipos:** No exportes tipos desde un módulo solo para satisfacer dependencias de helpers. Mantén los tipos en su dominio (`@/db/schema`) o muévelos a un módulo compartido para evitar acoplamiento y dependencias circulares.

**Control de flujo:** Usa early returns en condicionales en lugar de anidar bloques `else`.

## React y Next.js

**Un componente por archivo:** Nunca declares más de un componente React en el mismo archivo. Extrae subcomponentes a archivos propios.

**Listas:** Si dentro de un `map` hay JSX con lógica o estructura propia, extrae ese elemento a un componente reutilizable en otro archivo.

**Barrel files:** No crees `index.ts` que reexporten módulos (excepto módulos de servidor ya existentes como `src/server/queries/index.ts`).

**UI:** No uses emojis. Usa iconos de Lucide React o shadcn/ui.

**Server Components por defecto:** Usa Server Components para páginas, layouts y lectura de datos. Añade `"use client"` solo cuando sea estrictamente necesario (eventos, hooks, estado local, APIs del navegador).

**Server Actions:** Usa Server Actions para mutaciones. Valida la entrada con Zod en el servidor. Tras mutaciones exitosas, usa `revalidatePath` en las rutas afectadas.

**Route Handlers:** Reserva los Route Handlers (`app/api/`) para webhooks, push, cron y otros endpoints externos. No uses fetch cliente a la API interna si una Server Action cubre el caso.

**Protección de rutas:** `proxy.ts` aplica `clerkMiddleware()`. Los layouts y acciones vuelven a comprobar sesión, rol y propiedad del recurso con helpers de `@/server/auth/`.

### Client Components limitados

Reserva `"use client"` para wizards, steppers, selectores de emociones, sliders, diálogos, configuración de recordatorios, registro del Service Worker y suscripción push.

### Datos de servidor frente a Zustand

Zustand **no** almacena sesión, perfil, listas canónicas de registros/pacientes ni permisos. Esos datos viven en Server Components o Server Actions.

Zustand sí puede almacenar estado interactivo temporal: paso del wizard, borradores antes de enviar, estado de diálogos o UI local no persistida.

Evita un singleton de Zustand compartido entre peticiones SSR. No persistas borradores clínicos en `localStorage` por defecto.

## Autenticación y roles

- **Clerk** gestiona identidad y sesión.
- **Neon** (`profiles`) almacena rol, onboarding y datos funcionales.
- Roles: `patient`, `psychologist`, `admin` (reservado).

Helpers de autorización en `src/server/auth/`:

- `getCurrentProfile`, `requireUser`, `requireProfile`, `requireRole`
- `requireRecordAccess`, `requirePatientRelationship`

Cada consulta y mutación debe incluir filtros de autorización en el servidor. No confíes en datos del cliente ni en Zustand para autorizar.

### Redirección inicial (`app/page.tsx`)

- Sin sesión → `/login`
- Sin perfil completo → `/onboarding`
- Paciente → `/inicio`
- Psicólogo → `/pacientes`

## Rutas principales

```text
/login, /registro, /recuperar-password
/onboarding
/inicio, /nuevo-registro, /mis-registros          → paciente
/pacientes, /pacientes/[patientId]   → psicólogo
/perfil, /ajustes, /registro/[recordId]           → según rol y vínculo
/offline
/api/webhooks/clerk, /api/push/subscribe, /api/cron/reminders
```

Organización en `app/`:

```text
app/
├── (auth)/
├── (app)/
│   ├── (patient)/
│   ├── (psychologist)/
│   └── (shared)/
├── api/
├── onboarding/
└── offline/
```

## Formularios

Formularios con 2 o más campos persistidos usan **react-hook-form** con **zodResolver** sobre schemas de `src/validation/schemas.ts`. No uses `useState` individual por campo salvo en wizards multi-paso donde el estado temporal vive en Zustand.

- Valida en cliente para UX y **revalida en servidor** con Zod en la Server Action.
- Los campos de formulario muestran errores inline; errores globales de submit usan también `toast.error(...)`.
- Inputs nativos → `{...register("campo")}`.
- Controles custom (switch, slider, date picker) → `Controller` de react-hook-form.
- Wizards como el de nuevo registro pueden usar Zustand para el estado temporal; la Server Action valida y calcula intensidad global al guardar.

Referencia de wizard con Zustand: `src/components/records/new-record-wizard.tsx` + `src/stores/new-record-store.ts`.

## Arquitectura de componentes

Separa lógica de presentación cuando un componente crece o mezcla responsabilidades:

**1. Custom hook** (`hooks/use-[feature].ts`) — estado, derivaciones, handlers.
**2. Subcomponentes** (`components/`) — JSX puro, solo props.
**3. Page** — Server Component que obtiene datos; Client Component contenedor solo si hace falta interactividad.

### Reglas concretas

- Si un componente supera ~80 líneas, valora extraer subcomponentes o un hook.
- Las derivaciones van como variables computadas, no como estado (`const x = a ?? b`, no `useState`).
- Copy/strings en objetos constantes tipados fuera del JSX cuando se repiten.
- Los subcomponentes reciben solo lo que necesitan por props.
- Redirects y side effects de navegación en `useEffect` del contenedor cliente, no como `if` en medio del render.

### Estructura de carpetas

```text
src/components/[dominio]/
├── [feature].tsx
└── ...

src/server/
├── actions/          → Server Actions por dominio
├── queries/          → lecturas Drizzle
└── auth/             → helpers de sesión y autorización

src/db/               → schema Drizzle y conexión
src/lib/              → utilidades de dominio (emotions, intensity, dates)
src/stores/           → Zustand (estado cliente temporal)
src/validation/       → schemas Zod
```

Coloca código nuevo en la carpeta del dominio correspondiente (`records`, `patients`, `invitations`, `pwa`, `auth`, `profile`), no en rutas genéricas.

## Notificaciones al usuario

Para mensajes de error o éxito usa **Sonner** (`toast` de `sonner`). No uses `alert`, `confirm` ni mecanismos nativos. El `<Toaster />` está en `src/components/ui/sonner.tsx`.

## Auditoría

Operaciones sensibles registran eventos con `logAuditEvent` de `@/server/audit`. No incluyas datos clínicos en logs, analytics ni mensajes push.

## Capa de acceso a datos

Todas las queries y mutaciones a Neon viven en `src/server/queries/` y `src/server/actions/`, nunca directamente en componentes cliente ni stores.

Flujo de datos:

**Server Component / Client Component → Server Action o query → Drizzle → Neon**

### Reglas

- Queries en `src/server/queries/` son funciones `async` puras: reciben IDs explícitos, sin acceder a React ni Zustand.
- Server Actions en `src/server/actions/` comienzan con `"use server"`, validan con Zod, comprueban autorización y devuelven `ActionResult` (`{ success?: true; error?: string }`).
- El schema Drizzle vive en `src/db/schema.ts`; la conexión en `src/db/index.ts`.
- Nunca importes `@/db` desde componentes cliente.
- Zona horaria funcional: `Europe/Madrid`.

### Tablas principales

`profiles`, `patient_records`, `psychologist_patient`, `invitations`, `custom_emotions`, `user_reminders`, `push_subscriptions`, `audit_events`.

## PWA

- Manifest en `app/manifest.ts`.
- Service Worker en `public/sw.js`; registro en `src/components/pwa/service-worker-register.tsx`.
- **Network-only** para rutas autenticadas, Server Actions y datos clínicos.
- Cache solo para assets públicos. Fallback offline en `/offline`.
- Push: suscripción en cliente, persistencia en Neon, envío vía `/api/cron/reminders` con VAPID.

## Seguridad y privacidad

DiariaMente maneja información de salud potencialmente sensible:

- Autorización en cada consulta y mutación.
- Validación Zod en servidor.
- Secretos solo en variables de entorno del servidor.
- No cachear HTML personalizado ni respuestas con datos privados.
- Notificaciones push sin contenido clínico.
- Eliminación coordinada de datos Neon + identidad Clerk.

## Alcance del trabajo

- Cambios mínimos y enfocados: no toques código no relacionado con la tarea.
- Sigue convenciones del código circundante (nombres, imports, estructura).
- No añadas comentarios al código.
- No crees tests, documentación nueva ni archivos de ejemplo salvo petición explícita.
- No ejecutes el proyecto (`next dev`, etc.) salvo petición explícita.
- No uses git salvo petición explícita del usuario.

## Nunca setState en useEffect con dependencia circular

Si el estado que seteas está en las `deps` del efecto, es un bug.

**❌**

```tsx
useEffect(() => {
  setFullName(user.name);
}, [user, fullName]);
```

**✅ Lazy initializer**

```tsx
const [fullName, setFullName] = useState(() => user?.name ?? "");
```

**✅ Valor derivado**

```tsx
const fullName = user?.name ?? "";
```

> Si un `useEffect` setea estado que está en sus propias `deps`, rediseña: el valor es derivado, no independiente.

Utiliza siempre pnpm.
Utiliza siempre Tailwind.
Utiliza siempre Lucide icons, nunca emojis.

## Colores y tema

Los colores viven en `app/globals.css` como variables CSS en `:root` y se exponen a Tailwind v4 vía `@theme inline`. Modo visual inicial: solo claro.

**Usa clases del tema semántico de shadcn:**

| Rol              | Clases Tailwind                                      |
| ---------------- | ---------------------------------------------------- |
| Fondo app        | `bg-background`                                      |
| Texto            | `text-foreground`, `text-muted-foreground`           |
| Paneles / cards  | `bg-card`, `text-card-foreground`                    |
| Acciones         | `bg-primary`, `text-primary-foreground`              |
| Secundario       | `bg-secondary`, `text-secondary-foreground`          |
| Bordes           | `border-border`                                      |
| Focus            | `ring-ring`                                          |
| Error / destructivo | `text-destructive`, `bg-destructive`              |
| Intensidad emocional | `bg-intensity-low`, `bg-intensity-medium`, `bg-intensity-high` |

**Prohibido en UI:** valores hex/rgb literales en componentes, paletas Tailwind no definidas en el tema (`zinc-*`, `red-500`, etc.) y `style` con colores fijos.

**Excepción:** colores dinámicos de datos de usuario. Usa `style` solo con el valor de datos; el fallback debe ser una clase del tema.

**Si falta un token:** añádelo primero en `:root` y `@theme inline` de `globals.css`, luego úsalo en el componente.

## Layout de la app

- `AppShell` (`src/components/app-shell/`) envuelve rutas autenticadas con header y navegación inferior.
- Diseño responsive web-first: móvil, tablet y escritorio.
- Usa Tailwind para layout responsivo. Para lógica runtime que dependa del viewport, extrae un hook dedicado en lugar de duplicar `window.matchMedia` en componentes.
