/**
 * Textos visibles del sitio en español.
 * Centralizados aquí para poder traducirlos cuando BVA salga de Costa Rica.
 */

export const hero = {
  title: ['Tu negocio,', 'en', 'automático.'],
  lead: 'Páginas web, automatización e inteligencia artificial para pymes y empresarios de Costa Rica. Sistemas que siguen trabajando cuando tú no estás.',
  primaryCta: 'Ponlo en marcha',
  secondaryCta: 'Ver qué hacemos',
  sceneLabel: 'Logo de BVA en 3D: una B formada por una base y dos botones de play',
  videoLabel: 'Video de tecnología: interfaces y automatizaciones que avanzan con el scroll',
}

export const services = {
  eyebrow: 'Servicios',
  title: 'Qué hacemos',
  lead: 'Empezamos por la tarea que más tiempo te quita. Después, todo lo demás.',
  items: [
    {
      id: 'web',
      name: 'Páginas web',
      text: 'Tu negocio abierto las 24 horas: sitios rápidos que explican lo que vendes y reciben clientes.',
      examples: 'Sitios de presentación, catálogos, reservas en línea',
      details: [
        'Diseño a la medida de tu marca, pensado primero para celular.',
        'Formularios que llegan a tu WhatsApp o correo al instante.',
        'Optimizado para que Google te encuentre en Costa Rica.',
      ],
    },
    {
      id: 'automatizacion',
      name: 'Automatización',
      text: 'Las tareas que repites cada día, hechas solas: citas, recordatorios, cotizaciones y seguimiento.',
      examples: 'Flujos con WhatsApp, correo, hojas de cálculo y tus sistemas',
      details: [
        'Recordatorios de citas y cobros sin que nadie los escriba.',
        'Cotizaciones que se generan y envían en segundos.',
        'Conexión entre las herramientas que ya usas.',
      ],
    },
    {
      id: 'ia',
      name: 'Inteligencia artificial',
      text: 'Asistentes que responden a tus clientes con la información de tu negocio, a cualquier hora.',
      examples: 'Chat en tu web y WhatsApp, respuestas a preguntas frecuentes',
      details: [
        'Responde preguntas frecuentes con tus precios y horarios reales.',
        'Agenda citas y toma pedidos desde la conversación.',
        'Pasa la conversación a una persona cuando hace falta.',
      ],
    },
    {
      id: 'saas',
      name: 'SaaS y CRM',
      text: 'Un sistema propio para ver clientes, ventas y tareas en un solo lugar, hecho a la medida de cómo trabajas.',
      examples: 'Paneles de clientes, inventario, reportes',
      details: [
        'Historial de cada cliente y de cada venta.',
        'Inventario y órdenes de trabajo con avisos automáticos.',
        'Reportes semanales sin armar hojas de cálculo.',
      ],
    },
  ],
}

export const workProcess = {
  eyebrow: 'Proceso',
  title: 'Así lo ponemos en marcha',
  lead: 'Cuatro pasos, sin tecnicismos y con el costo claro desde el inicio.',
  sceneLabel:
    'Modelo 3D de una página web que se arma paso a paso: conversación, plano de diseño, construcción y lanzamiento',
  steps: [
    {
      name: 'Conversamos',
      text: 'Nos cuentas cómo funciona tu negocio y qué tarea te quita más tiempo.',
    },
    {
      name: 'Diseñamos la solución',
      text: 'Te proponemos qué automatizar primero, cómo se verá y cuánto cuesta, antes de empezar.',
    },
    {
      name: 'Lo construimos',
      text: 'Desarrollamos tu página, tus automatizaciones o tu sistema, y lo probamos contigo.',
    },
    {
      name: 'Lo ponemos en marcha',
      text: 'Lo dejamos funcionando, te enseñamos a usarlo y seguimos cerca para ajustarlo.',
    },
  ],
}

export const platform = {
  eyebrow: 'Plataforma',
  title: 'Tu negocio en una sola pantalla',
  lead: 'Además de proyectos a la medida, estamos construyendo nuestra propia plataforma: un CRM sencillo para pymes, con todo lo importante en un mismo lugar.',
  features: [
    { name: 'Clientes', text: 'Historial de cada cliente y sus conversaciones.' },
    { name: 'Ventas', text: 'Cotizaciones y oportunidades, de la consulta al pago.' },
    { name: 'Citas', text: 'Agenda con recordatorios automáticos por WhatsApp.' },
    { name: 'Reportes', text: 'Lo que pasó esta semana, sin armar hojas de cálculo.' },
  ],
  cta: 'Quiero conocerla',
  sceneLabel:
    'Demostración animada de la plataforma BVA: llega una consulta por WhatsApp, avanza hasta la venta y se actualizan los reportes',
  demo: {
    product: 'Plataforma BVA',
    search: 'Buscar clientes, ventas o citas',
    newButton: '+ Nuevo',
    menu: ['Inicio', 'Clientes', 'Ventas', 'Citas', 'Reportes'],
    stats: ['Clientes activos', 'Conversaciones', 'Ventas del mes'],
    columns: [
      { title: 'Nuevos', cards: ['Consulta por WhatsApp', 'Formulario de la web'] },
      { title: 'En conversación', cards: ['Cotización enviada'] },
      { title: 'Cerrados', cards: ['Servicio completado'] },
    ],
    liveCard: { name: 'Ana Rojas', detail: 'Reserva para 4 personas', done: 'Pagado' },
    chartTitle: 'Ventas de la semana',
    days: ['L', 'K', 'M', 'J', 'V', 'S', 'D'],
    toasts: [
      'Nueva consulta por WhatsApp de Ana Rojas',
      'Cotización enviada automáticamente',
      'Pago recibido: ₡45 000',
      'Recordatorio de cita enviado por WhatsApp',
    ],
  },
}

export const industries = {
  eyebrow: 'Para quién',
  title: 'Para negocios de todo tipo',
  lead: 'Si tu negocio repite tareas, se puede automatizar. Algunos ejemplos:',
  items: [
    { name: 'Restaurantes y sodas', text: 'Reservas y pedidos por WhatsApp, menú en línea.' },
    {
      name: 'Salud y bienestar',
      text: 'Citas, recordatorios y confirmaciones para clínicas y spas.',
    },
    { name: 'Tiendas y comercio', text: 'Catálogo, inventario y avisos de pago.' },
    { name: 'Servicios profesionales', text: 'Cotizaciones, contratos y seguimiento de clientes.' },
    { name: 'Turismo y hospedaje', text: 'Disponibilidad, reservas y mensajes a huéspedes.' },
    { name: 'Talleres y técnicos', text: 'Órdenes de trabajo y avisos cuando todo está listo.' },
  ],
}

export const contact = {
  eyebrow: 'Contacto',
  title: '¿Qué tarea quieres dejar de hacer a mano?',
  lead: 'Cuéntanos en dos minutos. Te respondemos con una propuesta clara: qué haríamos, en cuánto tiempo y cuánto cuesta.',
  sceneLabel: 'Botones de play en 3D flotando de fondo',
  directTitle: 'O escríbenos directo',
  form: {
    name: 'Nombre',
    email: 'Correo',
    whatsapp: 'WhatsApp (opcional)',
    business: 'Tipo de negocio (opcional)',
    message: '¿Qué te gustaría automatizar?',
    consent:
      'Acepto que BVA use estos datos solo para responder mi solicitud, según la política de privacidad.',
    privacyLink: 'Ver política de privacidad',
    submit: 'Enviar solicitud',
    sending: 'Enviando…',
    sent: 'Recibimos tu solicitud. Te escribimos al correo que dejaste.',
    simulated:
      'Envío de prueba: configura VITE_CONTACT_WEBHOOK_URL para recibir solicitudes reales.',
    error: 'No se pudo enviar. Revisa tu conexión e inténtalo de nuevo.',
    purpose:
      'Usamos tu nombre y correo para responderte. No los compartimos ni enviamos publicidad.',
  },
}

export const cta = {
  title: '¿Listo para dejar de hacerlo a mano?',
  lead: 'Cuéntanos qué tarea te quita más tiempo y te decimos cómo automatizarla.',
  button: 'Hablemos',
}

export const footer = {
  privacy: 'Política de privacidad',
  cookies: 'Este sitio no usa cookies de analítica ni de publicidad.',
  columns: { site: 'Sitio', contact: 'Contacto' },
}

export const pages = {
  home: {
    title: null,
    description:
      'Páginas web, automatización e inteligencia artificial para pymes y empresarios de Costa Rica.',
  },
  services: {
    title: 'Qué hacemos',
    description:
      'Páginas web, automatización, asistentes con inteligencia artificial y CRM a la medida para pymes de Costa Rica.',
    heroTitle: 'Servicios que trabajan por ti',
    heroLead:
      'Elige por dónde empezar. Cada servicio se diseña a la medida de tu negocio y se entrega funcionando.',
  },
  platform: {
    title: 'Plataforma',
    description:
      'Plataforma BVA: un CRM sencillo para pymes con clientes, ventas, citas y reportes.',
  },
  contact: {
    title: 'Contacto',
    description: 'Cuéntanos qué quieres automatizar y te respondemos con una propuesta clara.',
  },
  privacy: {
    title: 'Política de privacidad',
    description: 'Cómo BVA Business Solutions trata los datos del formulario de contacto.',
  },
  notFound: {
    title: 'Página no encontrada',
    heading: 'Esta página no existe',
    text: 'La dirección que buscas no existe o cambió de lugar. Vuelve al inicio o cuéntanos qué necesitas.',
    home: 'Volver al inicio',
    contact: 'Ir a contacto',
  },
}

export const privacy = {
  draftNotice:
    'Borrador para revisión. Este texto debe revisarlo un abogado antes de publicar el sitio. Reemplaza todos los datos entre corchetes.',
  updatedAt: 'Última actualización: [FECHA]',
  sections: [
    {
      title: 'Quién es responsable de tus datos',
      text: 'BVA Business Solutions, [RAZÓN SOCIAL], cédula [NÚMERO], con domicilio en [DIRECCIÓN], Costa Rica. Contacto: [CORREO].',
    },
    {
      title: 'Qué datos recogemos',
      text: 'Solo los que escribes en el formulario de contacto: nombre, correo y, si decides darlos, número de WhatsApp, tipo de negocio y el mensaje.',
    },
    {
      title: 'Para qué los usamos',
      text: 'Para responder tu solicitud y enviarte una propuesta. No los usamos para publicidad ni los vendemos.',
    },
    {
      title: 'Con quién se comparten',
      text: 'Los datos se procesan con [PROVEEDOR DE AUTOMATIZACIÓN, p. ej. n8n] y se guardan en [SISTEMA Y PAÍS DONDE SE ALOJAN]. [Indicar si hay transferencia fuera de Costa Rica.]',
    },
    {
      title: 'Cuánto tiempo los guardamos',
      text: '[PLAZO], después del cual se eliminan.',
    },
    {
      title: 'Tus derechos',
      text: 'Puedes pedir acceso, rectificación, cancelación u oposición al uso de tus datos, y retirar tu consentimiento, escribiendo a [CORREO]. Conforme a la Ley 8968 de Protección de la Persona frente al Tratamiento de sus Datos Personales y su reglamento.',
    },
    {
      title: 'Cookies',
      text: 'Este sitio no usa cookies de analítica ni de publicidad. Si en el futuro se agregan, se pedirá tu consentimiento antes de activarlas.',
    },
  ],
}
