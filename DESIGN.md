# DESIGN.md — Lenguaje visual de Diariamente

Léelo **antes** de crear o modificar cualquier pantalla, sheet, diálogo o componente visual. Los tokens viven en `app/globals.css`; aquí está cómo se combinan.

## Principio: marca expresiva, interfaz serena

La marca son los **cuatro cuadrantes de ánimo**, las **caras ilustradas** y las tipografías **Quicksand** y **Fraunces**. `--primary` es un gris carbón (`#25282c`) que da estructura (texto, iconos de cabecera), no es el color de marca.

La personalidad sale de las caras, la escala tipográfica y unos pocos acentos bien colocados, no de llenar la pantalla de tarjetas, bordes, sombras y colores. Cada elemento decorativo debe tener un motivo: dirigir la atención, expresar una emoción o separar información que lo necesita.

Antes de dar un componente por terminado, compáralo con su pantalla hermana (misma sección/rol) y con las referencias del final, y pásale la lista de comprobación de su nivel de expresividad.

## Niveles de expresividad

Las dos modalidades comparten tipografías, tokens, componentes y caras. Cambia cuánto color, tarjetas, titulares de display y movimiento llevan.

| | Expresivo | Funcional |
| --- | --- | --- |
| Pantallas | Onboarding, inicio del paciente, nuevo registro y su finalización, estados vacíos, bienvenidas, ofertas y campañas | Mis registros, lectura de un registro, ajustes, perfil, pacientes y su historial, facturación |
| Caras | Grandes (`FaceCluster`, `Face` a tamaño héroe) o `FaceRow` | `FaceRow` y caras como están hoy; las caras de emoción acompañan a los registros |
| Color | Fondos soft de cuadrante, eyebrow, palabra destacada | Fondo `bg-background`, acentos solo en chips de fila, badges y datos |
| Titulares | Fraunces con palabra destacada | Quicksand `font-bold`; Fraunces solo en cifras grandes o en el estado vacío |
| Superficies | Composición directa sobre el fondo, hero card cuando agrupa | Grupos de filas y listas; densidad de información alta |
| Movimiento | Entradas, expresiones de personaje, un grupo ambiental | Feedback y entradas suaves |

**Lista de comprobación expresiva:** ¿hay un punto focal claro (cara o titular)? ¿El titular tiene escala de display? ¿Hay como mucho un acento de cuadrante dominante? ¿El espacio vacío ayuda a respirar en vez de parecer roto?

**Lista de comprobación funcional:** ¿se entiende la jerarquía solo con tipografía? ¿Las tarjetas que hay separan información que lo necesita? ¿Se lee bien en móvil con datos largos? ¿El color comunica algo (dato, estado, selección) o solo adorna?

## Composición y espacio

- **El espacio vacío es parte del diseño.** No hace falta rellenarlo con consejos, pasos o tarjetas. Añade contexto solo si responde a una duda real del usuario en esa pantalla.
- **Composiciones sin tarjetas** en el modo expresivo: titular, caras y CTA directamente sobre `bg-background` o sobre un fondo soft de cuadrante a sangre. Las caras pueden salirse del borde de la pantalla si no tapan texto.
- **Usa una tarjeta solo cuando agrupa** información que debe leerse junta y separada del resto (filas de ajustes, un registro en una lista, una estadística). No metas una sola frase o un solo botón en una tarjeta.
- **Escala antes que decoración:** para destacar algo, primero agrándalo o dale más peso; después, color; por último, contenedor.
- No anides tarjetas dentro de tarjetas.

### Superficies disponibles

- **Hero card**: `rounded-[2rem] bg-card/80 px-5 py-6 shadow-sm ring-1 ring-border/50 backdrop-blur`. Para un bloque principal que agrupa varias piezas (inicio, clínica, invitar al equipo).
- **Grupo de filas**: `divide-y divide-border/70 overflow-hidden rounded-3xl border border-border/60 bg-card shadow-xs` (`SettingsGroup`).
- **Fila**: `flex items-center gap-3 px-4 py-3.5`, chip de icono `size-10 rounded-2xl` con par soft/strong, título `text-[0.95rem] font-semibold`, descripción `text-sm text-muted-foreground` (`SettingsRowContent`).
- **Tarjeta de estadística**: `rounded-3xl p-4` con fondo soft del cuadrante y `MoodBubble` decorativa en la esquina (`ClinicStatCard`).
- **Caja destacada** (enlace, valor copiado): `rounded-2xl bg-mood-lp-soft p-3` con chip blanco `bg-card text-mood-*-strong`.

## Color

### Fondos

- `bg-background` es el fondo de la app: crema cálido (`#fff8f3`). `bg-card` (blanco) apenas contrasta con él (1,05:1), así que toda tarjeta necesita su `ring`/`border` para separarse.
- Para dar color a una composición expresiva, usa el `bg-mood-*-soft` de un cuadrante como fondo a sangre. No inventes fondos nuevos parecidos a los soft (menta, cielo, melocotón…): se confundirían con los cuadrantes.
- Como mucho **un fondo de color por pantalla**.

### Cuadrantes: emoción y acento

| Cuadrante | Emoción | Soft (fondo) | Strong (texto/icono) | Sólidos |
| --- | --- | --- | --- | --- |
| `lp` (verde) | Baja energía, agradable | `bg-mood-lp-soft` | `text-mood-lp-strong` | `bg-mood-lp-1..3` |
| `lu` (azul) | Baja energía, desagradable | `bg-mood-lu-soft` | `text-mood-lu-strong` | `bg-mood-lu-1..3` |
| `hp` (amarillo) | Alta energía, agradable | `bg-mood-hp-soft` | `text-mood-hp-strong` | `bg-mood-hp-1..3` |
| `hu` (rojo/coral) | Alta energía, desagradable | `bg-mood-hu-soft` | `text-mood-hu-strong` | `bg-mood-hu-1..3` |

- Cuando representan **datos** (un registro, una emoción, una gráfica), usa `getMoodStyles(quadrant)` de `@/lib/emotions`.
- Como **acento decorativo** se usan sin carga semántica: alternar tonos (verde → azul → amarillo) en los chips de icono de una lista, el fondo de una composición expresiva, el sticker "30 días gratis" (`bg-mood-lp-3 rotate-3`).
- **Nunca** uses un cuadrante para comunicar éxito, error, aviso o información. Para eso están los colores funcionales.
- Sólidos (`-2`, `-3`) solo en badges pequeños o decoración, con texto `text-mood-foreground`.

### Color de acción

El verde de `btn-raised-joy` (`mood-lp-2` → `mood-lp-3`) es el color de acción de la marca: botón principal y **estados seleccionados/activos** (radios, checks, switches, sliders, progreso, calendario, `Badge`) con `bg-mood-lp-3 text-mood-foreground`, nunca `bg-primary`. Si la opción tiene tono propio (cuadrante, objetivo), usa el `-3` de ese tono; el slider de intensidad usa el color del cuadrante del registro. Contadores de "sin ver": `bg-mood-hu-3 text-mood-foreground`.

### Colores funcionales

Estados del sistema, separados de las emociones:

| Estado | Texto/icono | Fondo |
| --- | --- | --- |
| Éxito | `text-success` | `bg-success-soft` |
| Información | `text-info` | `bg-info-soft` |
| Aviso | `text-warning` | `bg-warning-soft` |
| Error / peligro | `text-destructive` | `bg-destructive/10` |

- Un estado nunca se comunica solo con color: siempre icono Lucide + texto.
- `destructive` solo para borrar, peligro y errores.

### Contraste aprobado

Combinaciones verificadas (WCAG AA, ≥ 4,5:1) para texto de cualquier tamaño:

- `text-foreground` y `text-muted-foreground` sobre `bg-background`, `bg-card` y cualquier `bg-mood-*-soft`.
- `text-mood-*-strong` sobre `bg-card`, `bg-background` y su propio `bg-mood-*-soft` (≥ 5:1).
- `text-mood-foreground` sobre cualquier `bg-mood-*-2` o `bg-mood-*-3` (≥ 5,5:1).
- Funcionales sobre su `-soft` y sobre `bg-background` (≥ 5:1).

Fuera de esta lista (por ejemplo, `strong` de un cuadrante sobre el `soft` de otro), comprueba el contraste antes de usarlo. Los tonos `-1` y `-2` nunca llevan texto en su propio color.

## Tipografía

- **Quicksand** (`font-sans`, `font-heading`): cuerpo, UI y titulares del modo funcional.
- **Fraunces** (`font-display`): titulares del modo expresivo, estados vacíos y cifras grandes. Patrón: `font-display text-2xl|3xl leading-tight font-medium text-balance`.
- **Palabra destacada** (`<span className="text-mood-lp-strong italic">palabra</span>`): solo en momentos importantes (bienvenida, onboarding, fin de registro, estado vacío principal, diálogos de confirmación). Como mucho una por pantalla. No la uses en listados, ajustes ni pantallas de gestión.
- **Jerarquía por escala y peso**, con saltos claros entre niveles: un titular de display debe verse claramente mayor que el texto; si dos niveles se parecen, sobra uno.
- Títulos de sheet: `text-2xl font-bold tracking-tight`.
- Etiquetas de grupo: `px-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase`.
- Eyebrow (modo expresivo): pill `rounded-full bg-mood-lp-soft px-3 py-0.5 text-sm font-bold text-mood-lp-strong`.
- Fechas, horas, intensidades y contadores: `tabular-nums`.
- Mayúscula solo al inicio de frase en titulares y botones.

## Sistema de ilustración

### Caras

- Viven en `public/caras/` y se muestran con `Face`, `FaceRow` (fila solapada que flota) y `FaceCluster` (composición grande para estados vacíos). Decorativas: `aria-hidden`.
- **Caras de emoción** (`alegria`, `tristeza`, `rabia`, `ansiedad`): representan registros vía `getQuadrantFace` y `getEmotionGroupFace` de `@/lib/faces`.
- **Caras de marca** (`DECORATIVE_FACE_IDS`: `01_gradiente` … `05_rosa_verde`).
- **`alegria` es la cara protagonista** de la marca: ocupa el centro de los `FaceRow` y las composiciones principales.
- El uso actual de caras (incluidos los `FaceRow` en pantallas del psicólogo y estados vacíos) es el correcto: no lo reduzcas.
- No repitas la misma cara dentro de una misma composición.

### Escenas nuevas

- **Un protagonista** (una cara o un grupo de caras) y pocos elementos secundarios.
- **Formas orgánicas y planas**, sin contornos ni degradados nuevos (los degradados de las caras de marca son la excepción). La profundidad sale de la escala, el solapamiento y sombras planas, no de efectos.
- **Paleta limitada**: como mucho tres tonos de cuadrante por escena, más neutros.
- **Escala dinámica**: el protagonista domina; el contraste de tamaño dirige la mirada.
- **Metáforas, no literalidad**: para emociones difíciles (tristeza, rabia, ansiedad) usa imágenes que acompañan (una nube, un peso que se suelta), nunca escenas literales de sufrimiento.
- **Fondo**: liso (`bg-background` o un `bg-mood-*-soft`). Las ilustraciones pueden salirse del borde si no tapan texto.
- Accesorios solo si cuentan algo; nada de relleno decorativo.

## Movimiento

### Tipos

| Tipo | Para qué | Duración | Curva | Tokens existentes |
| --- | --- | --- | --- | --- |
| Feedback | Responder a un toque | 100–150 ms | `--ease-spring` | `pressable`, `pressable-sm`, `btn-raised*`, `active:scale-95` |
| Entrada / salida | Aparecer, expandir, cambiar de paso | 250–450 ms | `--ease-out-quart`, `--ease-emphasized` (entrada); `--ease-accelerate` (salida) | `animate-disclosure`, `animate-pop-in`, `StaggerList`/`StaggerItem` |
| Expresión | Personaje o elemento que reacciona a un evento (guardar, error, logro) | 350–600 ms | `--ease-spring` | `animate-face-enter`, `animate-face-exit`, `animate-wiggle`, `animate-shake`, `animate-nudge-x` |
| Ambiental | Vida de fondo, continua y discreta | 5–7 s, en bucle | Ya definida en el keyframe | `animate-mood-float`, `animate-mood-wobble`, `animate-mood-ghost`, `bg-mood-spectrum` |

### Reglas

- Las animaciones expresivas van **ligadas a un evento** (guardar un registro, completar el onboarding, un error), son rápidas y con energía; no se repiten en bucle.
- **Un solo grupo ambiental por pantalla** (por ejemplo, el `FaceRow` que flota). No añadas más elementos flotando a su alrededor.
- En animaciones nuevas no uses curvas por defecto (`ease`, `ease-in-out`, `linear`): usa los tokens `--ease-*`.
- Titulares de momentos expresivos pueden entrar palabra a palabra, y párrafos línea a línea, con un fundido que sube rápido.
- Antes de crear un keyframe nuevo, comprueba si alguno de la tabla sirve.
- **`prefers-reduced-motion`**: en CSS, envuelve las animaciones en `motion-safe:`; en `motion/react`, usa `useReducedMotion`. Con movimiento reducido desaparecen las ambientales, las expresivas y los desplazamientos; el feedback y los fundidos de opacidad pueden quedarse.
- La producción de vídeo y anuncios sigue su propia guía de motion design, no estas reglas.

## Sheets y diálogos

- `SheetContent` con `className="flex flex-col gap-0 bg-background sm:max-w-md"`.
- `SheetHeader className="px-5 pt-6 pb-4"`, cuerpo `px-5 pb-6 gap-6 overflow-y-auto`.
- Las listas de opciones o ajustes van en grupos de filas; un texto explicativo o un único bloque puede ir directamente sobre el fondo.
- Si el sheet queda corto, deja el espacio; no lo rellenes.
- Diálogos de confirmación: `confirmDialogContentClassName` / `confirmDialogFooterClassName` (`src/components/profile/settings-dialog-styles.ts`) y `SettingsConfirmHeader` (cara + titular Fraunces con palabra destacada). Botones `size="lg" w-full`, acción arriba y Cancelar debajo. Referencias: `settings-sign-out-dialog.tsx`, `settings-delete-account-dialog.tsx`.

## Botones

- Todos `rounded-full` (variante del `Button`).
- **Nada de botones negros/carbón.** El `variant="default"` del `Button` es verde con relieve (`btn-raised-joy text-mood-foreground`). Los botones hechos a mano (`Link`, `button` nativo) usan las mismas clases. `btn-raised` (carbón) no se usa para acciones.
- **Destructivo confirmado** (eliminar cuenta, borrar): `btn-raised-danger text-primary-foreground`. `variant="destructive"` (rojo suave) solo para triggers secundarios.
- Secundarios: `variant="outline"`; terciarios/regenerar: `variant="ghost" size="sm" text-muted-foreground`.
- CTA a pantalla completa: `size="lg"` (h-14).
- Trigger de icono en cabecera: `inline-flex size-10 items-center justify-center rounded-full text-primary transition-colors hover:bg-accent active:scale-95`.
- Iconos siempre Lucide; nunca emojis.

## Referencias en el código

- Hero + caras + titular: `src/components/home/home-check-in.tsx`, `src/components/clinics/clinic-empty-state.tsx`, `src/components/clinics/clinic-overview.tsx`
- Sheet bien resuelto: `src/components/profile/settings-sheet.tsx`, `src/components/clinics/clinic-invite-sheet.tsx`
- Filas con chips de color: `src/components/profile/settings-row-content.tsx`, `src/components/billing/subscription-trial-offer.tsx`
- Estado vacío: `src/components/records/my-records-empty-state.tsx`
- Caras: `src/components/faces/`, `src/lib/faces.ts`
- Movimiento: `app/globals.css` (`--ease-*`, `--animate-*`), `src/components/motion/stagger-list.tsx`
