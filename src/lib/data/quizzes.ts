import type { CategoryId, QuizQuestion } from "@/lib/types";

type Q = [
  prompt: [string, string],
  options: [string, string][],
  answer: number,
  explanation: [string, string],
];

function build(prefix: string, items: Q[]): QuizQuestion[] {
  return items.map(([prompt, options, answer, explanation], index) => ({
    id: `${prefix}-q${index + 1}`,
    prompt: { en: prompt[0], es: prompt[1] },
    options: options.map(([en, es]) => ({ en, es })),
    answer,
    explanation: { en: explanation[0], es: explanation[1] },
  }));
}

export const quizBanks: Record<CategoryId, QuizQuestion[]> = {
  design: build("design", [
    [
      [
        "What is the main purpose of a visual hierarchy?",
        "¿Cuál es el propósito principal de la jerarquía visual?",
      ],
      [
        ["Make every element equally visible", "Hacer que todo sea igual de visible"],
        ["Guide attention in order of importance", "Guiar la atención por orden de importancia"],
        ["Use as many colors as possible", "Usar tantos colores como sea posible"],
        ["Reduce the number of pages", "Reducir el número de páginas"],
      ],
      1,
      [
        "Hierarchy uses size, weight, color and space to tell people what matters first.",
        "La jerarquía usa tamaño, peso, color y espacio para indicar qué importa primero.",
      ],
    ],
    [
      [
        "Which spacing approach keeps layouts consistent?",
        "¿Qué enfoque de espaciado mantiene los diseños coherentes?",
      ],
      [
        ["Random values per screen", "Valores aleatorios por pantalla"],
        ["A shared spacing scale such as 4 or 8 points", "Una escala compartida, como 4 u 8 puntos"],
        ["Only margins, never padding", "Solo márgenes, nunca relleno"],
        ["Whatever looks right on the day", "Lo que parezca bien ese día"],
      ],
      1,
      [
        "A spacing scale removes guesswork and makes components fit together.",
        "Una escala de espaciado elimina las dudas y hace que los componentes encajen.",
      ],
    ],
    [
      [
        "What minimum contrast ratio does WCAG AA require for body text?",
        "¿Qué contraste mínimo exige WCAG AA para el texto normal?",
      ],
      [
        ["2:1", "2:1"],
        ["3:1", "3:1"],
        ["4.5:1", "4,5:1"],
        ["10:1", "10:1"],
      ],
      2,
      [
        "Normal-size text needs at least 4.5:1 for AA.",
        "El texto de tamaño normal necesita al menos 4,5:1 para AA.",
      ],
    ],
    [
      ["What is a design token?", "¿Qué es un design token?"],
      [
        ["A paid Figma plugin", "Un plugin de pago de Figma"],
        [
          "A named, reusable design decision like a color or spacing value",
          "Una decisión de diseño con nombre y reutilizable, como un color o un espaciado",
        ],
        ["A login credential for designers", "Una credencial de acceso para diseñadores"],
        ["A type of user persona", "Un tipo de persona de usuario"],
      ],
      1,
      [
        "Tokens store decisions once so design and code stay in sync.",
        "Los tokens guardan decisiones una sola vez para que diseño y código estén sincronizados.",
      ],
    ],
    [
      ["When is usability testing most valuable?", "¿Cuándo es más valioso un test de usabilidad?"],
      [
        ["Only after launch", "Solo después del lanzamiento"],
        ["Early and often, even with rough prototypes", "Pronto y a menudo, incluso con prototipos simples"],
        ["Never, analytics is enough", "Nunca, la analítica basta"],
        ["Only when stakeholders ask", "Solo cuando lo piden los responsables"],
      ],
      1,
      [
        "Testing early catches costly problems while they are still cheap to fix.",
        "Probar pronto detecta problemas costosos cuando aún son baratos de corregir.",
      ],
    ],
  ]),
  development: build("dev", [
    [
      [
        "In React, what triggers a component to re-render?",
        "En React, ¿qué provoca que un componente se vuelva a renderizar?",
      ],
      [
        ["A change in its state or props", "Un cambio en su estado o props"],
        ["Scrolling the page", "Desplazar la página"],
        ["Opening DevTools", "Abrir DevTools"],
        ["Adding a CSS class manually", "Añadir una clase CSS manualmente"],
      ],
      0,
      [
        "React re-renders when state, props or consumed context change.",
        "React vuelve a renderizar cuando cambian el estado, las props o el contexto consumido.",
      ],
    ],
    [
      ["What does TypeScript add to JavaScript?", "¿Qué añade TypeScript a JavaScript?"],
      [
        ["A new runtime", "Un nuevo entorno de ejecución"],
        [
          "Static types checked before your code runs",
          "Tipos estáticos comprobados antes de ejecutar el código",
        ],
        ["Automatic database access", "Acceso automático a bases de datos"],
        ["Faster network requests", "Peticiones de red más rápidas"],
      ],
      1,
      [
        "TypeScript checks types at build time and compiles to plain JavaScript.",
        "TypeScript comprueba los tipos al compilar y genera JavaScript normal.",
      ],
    ],
    [
      ["What is a React Server Component?", "¿Qué es un React Server Component?"],
      [
        [
          "A component that renders on the server and sends no JavaScript for itself",
          "Un componente que se renderiza en el servidor y no envía su propio JavaScript",
        ],
        ["A component that only works in Node scripts", "Un componente que solo funciona en scripts de Node"],
        ["A database model", "Un modelo de base de datos"],
        ["A CSS framework", "Un framework de CSS"],
      ],
      0,
      [
        "Server Components render on the server, keeping client bundles small.",
        "Los Server Components se renderizan en el servidor y mantienen pequeño el bundle del cliente.",
      ],
    ],
    [
      [
        "Which Python structure stores key and value pairs?",
        "¿Qué estructura de Python guarda pares clave y valor?",
      ],
      [
        ["list", "list"],
        ["tuple", "tuple"],
        ["dict", "dict"],
        ["set", "set"],
      ],
      2,
      ["A dict maps keys to values.", "Un dict asocia claves con valores."],
    ],
    [
      ["Why write automated tests?", "¿Por qué escribir pruebas automatizadas?"],
      [
        ["To slow down releases", "Para ralentizar los lanzamientos"],
        ["To change code with confidence", "Para cambiar el código con confianza"],
        ["Because linters require it", "Porque lo exigen los linters"],
        ["To replace code review", "Para sustituir la revisión de código"],
      ],
      1,
      [
        "Tests catch regressions so you can refactor and ship safely.",
        "Las pruebas detectan regresiones para refactorizar y publicar con seguridad.",
      ],
    ],
  ]),
  data: build("data", [
    [
      ["Which SQL clause filters rows before grouping?", "¿Qué cláusula SQL filtra filas antes de agrupar?"],
      [
        ["HAVING", "HAVING"],
        ["WHERE", "WHERE"],
        ["ORDER BY", "ORDER BY"],
        ["LIMIT", "LIMIT"],
      ],
      1,
      ["WHERE filters rows; HAVING filters groups.", "WHERE filtra filas; HAVING filtra grupos."],
    ],
    [
      ["What does a LEFT JOIN return?", "¿Qué devuelve un LEFT JOIN?"],
      [
        ["Only matching rows", "Solo las filas coincidentes"],
        [
          "All rows from the left table plus matches from the right",
          "Todas las filas de la tabla izquierda más las coincidencias de la derecha",
        ],
        ["All rows from the right table only", "Solo las filas de la tabla derecha"],
        ["A random sample", "Una muestra aleatoria"],
      ],
      1,
      [
        "Unmatched right-side columns come back as NULL.",
        "Las columnas sin coincidencia del lado derecho aparecen como NULL.",
      ],
    ],
    [
      ["The median is more robust than the mean when...", "La mediana es más robusta que la media cuando..."],
      [
        ["The data has extreme outliers", "Los datos tienen valores atípicos extremos"],
        ["The data is perfectly symmetric", "Los datos son perfectamente simétricos"],
        ["There are fewer than 3 rows", "Hay menos de 3 filas"],
        ["Values are all equal", "Todos los valores son iguales"],
      ],
      0,
      [
        "Outliers pull the mean but barely move the median.",
        "Los atípicos desplazan la media pero apenas mueven la mediana.",
      ],
    ],
    [
      [
        "What makes a prompt for an AI model more reliable?",
        "¿Qué hace más fiable una instrucción para un modelo de IA?",
      ],
      [
        ["Being as short as possible", "Ser lo más corta posible"],
        [
          "Clear context, a goal, constraints and an example",
          "Contexto claro, un objetivo, restricciones y un ejemplo",
        ],
        ["Writing in all caps", "Escribir en mayúsculas"],
        ["Asking the same question ten times", "Hacer la misma pregunta diez veces"],
      ],
      1,
      [
        "Context, constraints and examples reduce ambiguity.",
        "El contexto, las restricciones y los ejemplos reducen la ambigüedad.",
      ],
    ],
    [
      ["Correlation between two metrics proves...", "La correlación entre dos métricas demuestra..."],
      [
        ["That one causes the other", "Que una causa la otra"],
        ["That they move together, not why", "Que se mueven juntas, no por qué"],
        ["That the data is wrong", "Que los datos son erróneos"],
        ["Nothing at all", "Nada en absoluto"],
      ],
      1,
      [
        "Causation needs experiments or stronger evidence.",
        "La causalidad necesita experimentos o pruebas más sólidas.",
      ],
    ],
  ]),
  business: build("biz", [
    [
      [
        "What is a product roadmap primarily for?",
        "¿Para qué sirve principalmente una hoja de ruta de producto?",
      ],
      [
        ["Promising exact ship dates", "Prometer fechas exactas de entrega"],
        ["Communicating priorities and direction", "Comunicar prioridades y dirección"],
        ["Tracking bugs", "Hacer seguimiento de errores"],
        ["Listing every feature request", "Listar todas las peticiones"],
      ],
      1,
      [
        "Good roadmaps explain what matters and why, not just dates.",
        "Una buena hoja de ruta explica qué importa y por qué, no solo fechas.",
      ],
    ],
    [
      ["What does CAC stand for?", "¿Qué significa CAC?"],
      [
        ["Customer acquisition cost", "Coste de adquisición de clientes"],
        ["Cash at close", "Efectivo al cierre"],
        ["Content and community", "Contenido y comunidad"],
        ["Cost after churn", "Coste tras la pérdida de clientes"],
      ],
      0,
      [
        "CAC is the total cost to win a new customer.",
        "El CAC es el coste total de conseguir un nuevo cliente.",
      ],
    ],
    [
      [
        "A healthy LTV to CAC ratio is often cited as about...",
        "Una relación LTV/CAC saludable suele citarse en torno a...",
      ],
      [
        ["1:1", "1:1"],
        ["3:1", "3:1"],
        ["1:3", "1:3"],
        ["100:1", "100:1"],
      ],
      1,
      [
        "Around 3:1 suggests you earn enough to grow sustainably.",
        "En torno a 3:1 sugiere que ganas lo suficiente para crecer de forma sostenible.",
      ],
    ],
    [
      ["What is runway?", "¿Qué es el runway?"],
      [
        [
          "Months a company can operate before cash runs out",
          "Los meses que una empresa puede operar antes de quedarse sin caja",
        ],
        ["The launch date of a product", "La fecha de lanzamiento de un producto"],
        ["A marketing channel", "Un canal de marketing"],
        ["The time to hire an employee", "El tiempo para contratar a alguien"],
      ],
      0,
      ["Runway equals cash divided by monthly burn.", "El runway es la caja dividida por el gasto mensual."],
    ],
    [
      [
        "Which is the best first step for a growth experiment?",
        "¿Cuál es el mejor primer paso para un experimento de crecimiento?",
      ],
      [
        ["Increase the ad budget", "Aumentar el presupuesto de anuncios"],
        [
          "Write a clear hypothesis and success metric",
          "Escribir una hipótesis clara y una métrica de éxito",
        ],
        ["Redesign the logo", "Rediseñar el logotipo"],
        ["Copy a competitor", "Copiar a un competidor"],
      ],
      1,
      [
        "A hypothesis and metric make the result interpretable.",
        "Una hipótesis y una métrica hacen que el resultado sea interpretable.",
      ],
    ],
  ]),
  languages: build("lang", [
    [
      [
        "Which is the most formal way to address a client in Spanish?",
        "¿Cuál es la forma más formal de dirigirse a un cliente en español?",
      ],
      [
        ["tú", "tú"],
        ["usted", "usted"],
        ["vos", "vos"],
        ["ustedes", "ustedes"],
      ],
      1,
      ["Usted is the formal singular 'you'.", "Usted es la forma formal en singular."],
    ],
    [
      [
        "'I look forward to hearing from you' is best used...",
        "'I look forward to hearing from you' se usa mejor...",
      ],
      [
        ["At the end of a professional email", "Al final de un correo profesional"],
        ["As a greeting", "Como saludo"],
        ["In a text to a friend", "En un mensaje a un amigo"],
        ["In a job title", "En un cargo"],
      ],
      0,
      [
        "It is a polite closing line in business English.",
        "Es una frase de cierre cortés en inglés de negocios.",
      ],
    ],
    [
      [
        "What helps most when presenting in a second language?",
        "¿Qué ayuda más al presentar en otro idioma?",
      ],
      [
        ["Memorizing every word", "Memorizar cada palabra"],
        ["Short sentences and clear signposting", "Frases cortas y transiciones claras"],
        ["Speaking as fast as possible", "Hablar lo más rápido posible"],
        ["Avoiding eye contact", "Evitar el contacto visual"],
      ],
      1,
      [
        "Signposts like 'first' and 'to sum up' help listeners follow.",
        "Conectores como 'primero' y 'en resumen' ayudan a seguir el hilo.",
      ],
    ],
    [
      ["'Reunión' in English means...", "'Reunión' en inglés significa..."],
      [
        ["Meeting", "Meeting"],
        ["Contract", "Contract"],
        ["Invoice", "Invoice"],
        ["Deadline", "Deadline"],
      ],
      0,
      ["Una reunión is a meeting.", "Una reunión es un meeting."],
    ],
    [
      [
        "The fastest way to build speaking confidence is to...",
        "La forma más rápida de ganar confianza al hablar es...",
      ],
      [
        ["Wait until grammar is perfect", "Esperar a dominar la gramática"],
        ["Practice short, real conversations often", "Practicar a menudo conversaciones breves y reales"],
        ["Only read textbooks", "Leer solo libros de texto"],
        ["Translate everything in your head", "Traducirlo todo mentalmente"],
      ],
      1,
      [
        "Frequent, low-stakes practice builds fluency fastest.",
        "La práctica frecuente y sin presión desarrolla la fluidez más rápido.",
      ],
    ],
  ]),
  photography: build("photo", [
    [
      [
        "Which three settings form the exposure triangle?",
        "¿Qué tres ajustes forman el triángulo de exposición?",
      ],
      [
        ["Aperture, shutter speed, ISO", "Apertura, velocidad de obturación, ISO"],
        ["Zoom, focus, flash", "Zoom, enfoque, flash"],
        ["White balance, contrast, saturation", "Balance de blancos, contraste, saturación"],
        ["Resolution, format, lens", "Resolución, formato, objetivo"],
      ],
      0,
      [
        "Aperture, shutter speed and ISO together control exposure.",
        "Apertura, velocidad e ISO controlan juntos la exposición.",
      ],
    ],
    [
      ["A wider aperture (like f/1.8) gives you...", "Una apertura más amplia (como f/1.8) te da..."],
      [
        ["More depth of field", "Más profundidad de campo"],
        ["Shallower depth of field and more light", "Menos profundidad de campo y más luz"],
        ["Less light", "Menos luz"],
        ["Slower shutter speeds", "Velocidades más lentas"],
      ],
      1,
      [
        "Wide apertures blur backgrounds and let in more light.",
        "Las aperturas amplias desenfocan el fondo y dejan entrar más luz.",
      ],
    ],
    [
      ["What is the 'golden hour'?", "¿Qué es la 'hora dorada'?"],
      [
        ["Midday sun", "El sol del mediodía"],
        [
          "The soft light shortly after sunrise and before sunset",
          "La luz suave poco después del amanecer y antes del atardecer",
        ],
        ["Any time indoors", "Cualquier momento en interiores"],
        ["The hour after midnight", "La hora después de medianoche"],
      ],
      1,
      ["Low sun gives warm, flattering light.", "El sol bajo da una luz cálida y favorecedora."],
    ],
    [
      ["Why shoot in RAW?", "¿Por qué disparar en RAW?"],
      [
        ["Smaller files", "Archivos más pequeños"],
        ["More data for flexible editing", "Más datos para editar con flexibilidad"],
        ["It looks better without editing", "Se ve mejor sin editar"],
        ["Faster sharing", "Compartir más rápido"],
      ],
      1,
      [
        "RAW keeps highlight and shadow detail for editing.",
        "RAW conserva el detalle de luces y sombras para la edición.",
      ],
    ],
    [
      [
        "The rule of thirds suggests placing subjects...",
        "La regla de los tercios sugiere colocar el sujeto...",
      ],
      [
        ["Always dead center", "Siempre en el centro"],
        [
          "Along the lines or intersections of a 3x3 grid",
          "Sobre las líneas o intersecciones de una cuadrícula 3x3",
        ],
        ["At the very edge", "En el borde"],
        ["Out of frame", "Fuera del encuadre"],
      ],
      1,
      [
        "Off-center placement often feels more dynamic.",
        "Colocar el sujeto fuera del centro suele resultar más dinámico.",
      ],
    ],
  ]),
};
