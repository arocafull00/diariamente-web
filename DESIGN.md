# DESIGN.md — Lenguaje visual de DiariaMente

Léelo **antes** de crear o modificar cualquier pantalla, sheet, diálogo o componente visual. Los tokens viven en `app/globals.css`; aquí está cómo se combinan.

## Regla principal: nada en blanco y negro

`--primary` es un gris carbón (`#25282c`): da estructura (texto, iconos de cabecera, botón por defecto), **no es el color de marca**. La marca son los **cuatro cuadrantes de ánimo** y las **caras ilustradas**. Una pantalla o sheet que solo use `primary`, `muted-foreground` y blanco está mal, aunque compile.

Toda vista nueva debe tener al menos:

1. Un **acento de cuadrante** (`bg-mood-*-soft` + `text-mood-*-strong`) en chips de icono, pills o highlights.
2. Un **titular con personalidad**: `font-display` (Fraunces) con una palabra destacada en `text-mood-*-strong italic`, o un `SheetTitle` `text-2xl font-bold tracking-tight`.
3. Superficies redondeadas con anillo suave sobre `bg-background` (ver Superficies).
4. Si es un estado vacío, hero o bienvenida: **caras** (`FaceRow`, `FaceCluster` o `Face`).

Antes de dar un componente por terminado, compáralo con su pantalla hermana (misma sección/rol) y con las referencias de abajo. Si no se distinguiría de un shadcn por defecto, no está terminado.

## Color

| Cuadrante | Uso semántico | Soft (fondo) | Strong (texto/icono) |
| --- | --- | --- | --- |
| `lp` (verde) | Acción positiva, prueba, clínica, éxito, "empezar" | `bg-mood-lp-soft` | `text-mood-lp-strong` |
| `lu` (azul) | Información, compartir, privacidad | `bg-mood-lu-soft` | `text-mood-lu-strong` |
| `hp` (amarillo) | Recordatorios, rachas, feedback, aviso amable | `bg-mood-hp-soft` | `text-mood-hp-strong` |
| `hu` (rojo/coral) | Alerta suave, cobros | `bg-mood-hu-soft` | `text-mood-hu-strong` |

- Para datos de un cuadrante concreto usa `getMoodStyles(quadrant)` de `@/lib/emotions`.
- En listas de filas, alterna tonos (verde → azul → amarillo) en los chips de icono, como en Ajustes y en la oferta de prueba.
- Sólidos (`bg-mood-*-2`, `bg-mood-*-3`) solo para badges pequeños o decoración (ej. sticker "14 días gratis" `bg-mood-lp-3 rotate-3`); su texto es `text-mood-foreground`.
- `destructive` solo para borrar/peligro.
- **Estados seleccionados/activos** (radios, checks, switches, sliders, progreso, calendario, `Badge`): `bg-mood-lp-3 text-mood-foreground`, nunca `bg-primary`. Si la opción tiene tono propio (cuadrante, objetivo), usa el `-3` de ese tono; el slider de intensidad usa el color del cuadrante del registro. Contadores de "sin ver": `bg-mood-hu-3 text-mood-foreground`.

## Tipografía

- **Quicksand** (`font-sans`, `font-heading`): cuerpo y UI.
- **Fraunces** (`font-display`): titulares de héroe, estados vacíos, cifras grandes. Patrón: `font-display text-2xl|3xl leading-tight font-medium text-balance` + `<span className="text-mood-lp-strong italic">palabra</span>`.
- Títulos de sheet: `text-2xl font-bold tracking-tight`.
- Etiquetas de grupo: `px-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase`.
- Eyebrow: pill `rounded-full bg-mood-lp-soft px-3 py-0.5 text-sm font-bold text-mood-lp-strong`.

## Superficies

- **Hero card**: `rounded-[2rem] bg-card/80 px-5 py-6 shadow-sm ring-1 ring-border/50 backdrop-blur` (inicio, clínica, invitar al equipo).
- **Grupo de filas**: `divide-y divide-border/70 overflow-hidden rounded-3xl border border-border/60 bg-card shadow-xs` (`SettingsGroup`).
- **Fila**: `flex items-center gap-3 px-4 py-3.5`, chip de icono `size-10 rounded-2xl` con par soft/strong, título `text-[0.95rem] font-semibold`, descripción `text-sm text-muted-foreground` (`SettingsRowContent`).
- **Tarjeta de estadística**: `rounded-3xl p-4` con fondo soft del cuadrante y `MoodBubble` decorativa en la esquina (`ClinicStatCard`).
- **Caja destacada** (enlace, valor copiado): `rounded-2xl bg-mood-lp-soft p-3` con chip blanco `bg-card text-mood-*-strong`.

## Sheets y diálogos

- `SheetContent` con `className="flex flex-col gap-0 bg-background sm:max-w-md"`.
- `SheetHeader className="px-5 pt-6 pb-4"`, cuerpo `px-5 pb-6 gap-6 overflow-y-auto`.
- El contenido no flota sobre blanco plano: va en hero cards o grupos de filas.
- Diálogos de confirmación: `confirmDialogContentClassName` / `confirmDialogFooterClassName` (`src/components/profile/settings-dialog-styles.ts`) y `SettingsConfirmHeader` (cara + titular Fraunces con palabra destacada). Botones `size="lg" w-full`, acción arriba y Cancelar debajo. Referencias: `settings-sign-out-dialog.tsx`, `settings-delete-account-dialog.tsx`.
- Si queda mucho espacio vacío, añade contexto útil (pasos "Cómo funciona", consejos) en un grupo de filas, no relleno.

## Botones

- Todos `rounded-full` (variante del `Button`).
- **Nada de botones negros/carbón.** El `variant="default"` del `Button` ya es verde con relieve (`btn-raised-joy text-mood-foreground`). Los botones hechos a mano (`Link`, `button` nativo) usan las mismas clases. `btn-raised` (carbón) no se usa para acciones.
- **Destructivo confirmado** (eliminar cuenta, borrar): `btn-raised-danger text-primary-foreground`. `variant="destructive"` (rojo suave) solo para triggers secundarios.
- Secundarios: `variant="outline"`; terciarios/regenerar: `variant="ghost" size="sm" text-muted-foreground`.
- CTA a pantalla completa: `size="lg"` (h-14).
- Trigger de icono en cabecera: `inline-flex size-10 items-center justify-center rounded-full text-primary transition-colors hover:bg-accent active:scale-95`.

## Ilustración y movimiento

- Caras en `public/caras/` vía `Face`, `FaceRow` (fila solapada que flota) y `FaceCluster` (composición grande para estados vacíos). Decorativas: `aria-hidden`.
- Animaciones de marca: `motion-safe:animate-mood-float`, `animate-mood-wobble`, `bg-mood-spectrum`. Listas con `StaggerList`/`StaggerItem`.
- Iconos siempre Lucide; nunca emojis.

## Referencias en el código

- Hero + caras + titular: `src/components/home/home-check-in.tsx`, `src/components/clinics/clinic-empty-state.tsx`, `src/components/clinics/clinic-overview.tsx`
- Sheet bien resuelto: `src/components/profile/settings-sheet.tsx`, `src/components/clinics/clinic-invite-sheet.tsx`
- Filas con chips de color: `src/components/profile/settings-row-content.tsx`, `src/components/billing/subscription-trial-offer.tsx`
- Estado vacío: `src/components/records/my-records-empty-state.tsx`
