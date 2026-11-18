// Biblioteca de mensajes de primer contacto y seguimiento (segmento × canal × toque × variante)
// Variables: {marca} {giro} {resp} {gancho}. Las cifras de apps son un EJEMPLO (se dice en el texto).
const LIB = {
  wa: {
    indep: {
      1: ['Hola, buen día. Le escribe {resp} de DeliPROPIO. Vi {marca} y me gustó {gancho}. Ayudamos a negocios como el suyo a recibir pedidos directos con su propia marca, sin depender solo de las apps. ¿Le puedo mandar un video de 1 minuto?',
          'Hola, buen día. Soy {resp} de DeliPROPIO. Estuve viendo {marca} y me llamó la atención {gancho}. Ayudamos a restaurantes de León a tener su propio canal de pedidos, sin quitar las apps. ¿Le comparto un video corto para que lo vea con calma?'],
      2: ['Gracias por la confianza. Este es el video pensado para {giro}: en 1 minuto verá cómo se vería {marca} con su propio pedido en línea. Le pregunto algo: ¿hoy qué porcentaje de sus ventas llega por apps de reparto?',
          'Con gusto. Aquí le dejo el video: es un minuto y está hecho para negocios de {giro}. Una pregunta rápida para ver si le sirve: ¿hoy la mayoría de sus pedidos a domicilio entran por apps o por su propio número?'],
      3: ['Hola, {resp} de DeliPROPIO. Un dato rápido, como ejemplo: en un pedido de $500, por app de reparto a un restaurante le llegan cerca de $250; por su propio canal, cerca de $456. ¿Le gustaría ver cómo se vería en {marca}?',
          'Buen día. Le dejo una cuenta sencilla (las cifras de las apps son un ejemplo y varían por contrato): pedido de $500 → por app ≈ $250, por canal propio ≈ $456. Son unos $206 más por pedido y el cliente queda en su base. ¿Le muestro cómo quedaría {marca}?'],
      4: ['Hola, {resp} de DeliPROPIO otra vez. No quiero llenarle el chat. Si ahorita no es prioridad en {marca}, lo dejamos aquí y con gusto retomo el mes que entra. Si le interesa antes, me escribe y le agendo la demo de 2 minutos.',
          'Buen día. Cierro mi seguimiento para no ser insistente: si más adelante quiere ver cómo recibir pedidos directos en {marca}, aquí estoy. La demo dura 2 minutos. ¡Que le vaya muy bien con las ventas!']
    },
    cadena: {
      1: ['Buen día. Le escribe {resp} de DeliPROPIO. Trabajamos con marcas locales que ya tienen varias sucursales, como {marca}, para que cada pedido directo se quede con su marca y sus clientes. ¿Con quién puedo comentar esto, con administración o con dirección? Si prefiere, le mando un video de 1 minuto.',
          'Buen día. Soy {resp} de DeliPROPIO. Ayudamos a cadenas locales como {marca} a tener su propio canal de pedidos en línea, además de las apps, para quedarse con los datos de sus clientes. ¿A quién le puedo mandar un video de 1 minuto?'],
      2: ['Gracias. Este video muestra cómo funciona para una marca con varias sucursales. Lo que más piden es probar en una sola sucursal durante un mes, sin tocar lo demás. ¿Le parece si le enseño en una demo de 2 minutos cómo se vería {marca}?',
          'Con gusto. Aquí está el video. Para una marca con varias sucursales lo más sencillo es un piloto en una sola, para medir resultados antes de decidir. ¿Quién de su equipo vería la demo de 2 minutos?'],
      3: ['Buen día, {resp} de DeliPROPIO. Un ejemplo para {marca} (cifras de apps de ejemplo): en un pedido de $500, por app llegan ≈ $250 y por canal propio ≈ $456. Multiplicado por todas las sucursales, la diferencia se nota. ¿Le muestro una demo de 2 minutos?',
          'Hola. Le comparto una cuenta para marcas con varias sucursales (ejemplo): por cada pedido de $500, ≈ $206 más por canal propio que por app. ¿Con quién puedo agendar una demo de 2 minutos?'],
      4: ['Hola, {resp} de DeliPROPIO. Para no insistir, dejo aquí mi último mensaje: si en {marca} quieren evaluar un piloto de pedidos directos en una sucursal, con gusto les muestro la demo de 2 minutos. ¡Mucho éxito!',
          'Buen día. Cierro mi seguimiento. Si más adelante {marca} quiere probar su propio canal de pedidos en una sucursal, escríbame y lo vemos. ¡Saludos!']
    },
    fran: {
      1: ['Buen día. Soy {resp} de DeliPROPIO. Ofrecemos a franquicias un canal de pedidos directos como complemento de las apps, sin reemplazarlas. Quisiera saber a quién del área de franquicias o de marketing de {marca} le corresponde evaluar un piloto en León. ¿Me puede orientar?',
          'Buen día. Le escribe {resp} de DeliPROPIO. Trabajamos canales de pedido propio para marcas, como complemento de las apps de reparto. ¿Con quién del área de franquicias o marketing de {marca} puedo comentar un piloto en León?'],
      2: ['Gracias por la orientación. Le dejo un video de 1 minuto sobre cómo funciona. El piloto sería en una sucursal de León y sin tocar la operación del resto. ¿Con quién agendo una demo de 2 minutos?',
          'Muchas gracias. Aquí el video de 1 minuto. La propuesta es un piloto acotado en León, respetando la imagen de {marca}. ¿Quién podría ver una demo breve?'],
      3: ['Buen día. Un ejemplo para {marca} (cifras de apps de ejemplo): en un pedido de $500, por app ≈ $250 y por canal propio ≈ $456. Es un complemento, no reemplaza las apps. ¿Me ayuda a agendar una demo de 2 minutos con quien corresponda?',
          'Hola, {resp} de DeliPROPIO. Le comparto una cuenta de ejemplo: pedido de $500 → ≈ $206 más por canal propio que por app. ¿A quién puedo mostrarle la demo de 2 minutos?'],
      4: ['Buen día. Cierro mi seguimiento para no ser insistente. Si {marca} quiere evaluar más adelante un piloto de pedidos directos en León, con gusto presento la demo de 2 minutos. ¡Saludos!']
    }
  },
  dm: {
    _: {
      1: ['Hola 👋 Soy {resp} de DeliPROPIO. Me encantó {gancho} de {marca}. Ayudamos a restaurantes de León a recibir pedidos directos con su propia marca. ¿Le mando un video de 1 min?',
          'Hola, soy {resp} de DeliPROPIO 🙂 Vi {marca} y se ve muy bien {gancho}. Ayudamos a negocios de León a tener su propio canal de pedidos. ¿Le comparto un video de 1 minuto?'],
      2: ['Gracias 🙌 Aquí va el video de 1 min pensado para {giro}. Pregunta rápida: ¿hoy sus pedidos a domicilio entran más por apps o por su propio canal?'],
      3: ['{resp} de DeliPROPIO otra vez 🙂 Dato rápido (ejemplo): en un pedido de $500, por app a un restaurante le llegan cerca de $250; por su propio canal, cerca de $456. ¿Le gustaría ver cómo se vería en {marca}?'],
      4: ['Hola, {resp} de DeliPROPIO. No quiero ser insistente: si más adelante le interesa recibir pedidos directos en {marca}, aquí estoy 🙂 ¡Mucho éxito!']
    }
  },
  correo: {
    _: {
      1: ['Buen día:\n\nLe escribo de DeliPROPIO. Ayudamos a restaurantes de León a recibir pedidos directos con su propia marca, sin quitar las apps de reparto: son un canal más.\n\nPreparé un video de 1 minuto pensado para {giro}. ¿Se lo comparto?\n\nQuedo atento.\n{resp} · DeliPROPIO'],
      2: ['Buen día:\n\nGracias por su respuesta. Le comparto el video de 1 minuto pensado para {giro}. En él se ve cómo funcionaría un canal propio de pedidos para {marca}.\n\nSi le parece útil, puedo mostrárselo con sus propios platillos en una demo de 2 minutos. ¿Qué día le acomoda?\n\n{resp} · DeliPROPIO'],
      3: ['Buen día:\n\nLe comparto un ejemplo con un pedido de $500 (las cifras de las apps son un ejemplo y varían por contrato):\n\n• Por app de reparto, a un restaurante le llegan cerca de $250.\n• Por su propio canal con DeliPROPIO, cerca de $456.\n\nSon unos $206 más por pedido, y además el cliente queda en su base. Le puedo mostrar cómo se vería {marca} en una demo de 2 minutos. ¿Qué día le acomoda?\n\n{resp} · DeliPROPIO'],
      4: ['Buen día:\n\nCierro mi seguimiento para no ser insistente. Si más adelante {marca} quiere recibir pedidos directos con su propia marca, con gusto le muestro la demo de 2 minutos.\n\nMuchas gracias por su tiempo.\n{resp} · DeliPROPIO']
    }
  },
  form: {
    _: { 1: ['Hola, soy {resp} de DeliPROPIO. Quisiera comentar con quien corresponda una opción de pedidos directos con marca propia para {marca}, como complemento a las apps de reparto. Puedo mandar un video de 1 minuto o hacer una demo breve. Mi contacto: [teléfono / correo].'] }
  },
  llamada: {
    _: {
      1: ['"Buen día, le habla {resp} de DeliPROPIO. No le quito más de 20 segundos: ayudamos a restaurantes de León a recibir pedidos directos con su propia marca. ¿Con quién puedo hablar de eso, con el dueño o con administración? … Perfecto, ¿le mando un video de 1 minuto por WhatsApp para que lo vea con calma?"\n\nSi dicen "no me interesa": "Entiendo, gracias por el tiempo. ¿Le parece si le mando solo un video corto por si más adelante le sirve?"']
    }
  }
};
const ASUNTOS = {
  indep: ['Una idea para {marca} (1 minuto)', 'Pedidos directos para {marca}, con su propia marca'],
  cadena: ['Pedidos directos para las sucursales de {marca}', 'Canal propio de pedidos para {marca}'],
  fran: ['Canal propio de pedidos para {marca}: piloto en León'],
  t3: ['Lo que le llega de un pedido de $500']
};
const CANALES = { wa: 'WhatsApp', dm: 'Instagram / Facebook', correo: 'Correo', form: 'Formulario web', llamada: 'Llamada' };
const GANCHOS = [[/cafe|café|panader/i, 'su carta de bebidas y el ambiente del lugar'], [/pizza/i, 'sus pizzas'], [/taquer|tacos|birria/i, 'el sabor de sus tacos'], [/hamburg/i, 'sus hamburguesas'], [/postre|helad|crep|dulce|pastel/i, 'lo vistosos que se ven sus postres'], [/parrilla|carne|corte|asada/i, 'sus cortes'], [/antojit|quesadilla|mexicana|pozole|torta/i, 'su menú de antojitos'], [/pasta|italian/i, 'su carta de pastas'], [/sushi|japon/i, 'su carta de sushi'], [/alitas|sports/i, 'sus alitas'], [/comida corrida|almuerzo|desayun/i, 'su menú del día']];

const segDe = m => { const t = String(m['Franquicia / tipo'] || ''); return /franquicia/i.test(t) && /^s[ií]/i.test(t) ? 'fran' : /cadena/i.test(t) ? 'cadena' : 'indep'; };
const SEGN = { indep: 'Independiente', cadena: 'Cadena local', fran: 'Franquicia' };
const ganchoDe = m => { const g = GANCHOS.find(([r]) => r.test(m.Giro || '')); return g ? g[1] : (m.Giro && !/verificar/i.test(m.Giro) ? `su propuesta de ${m.Giro.toLowerCase()}` : 'su propuesta'); };
// Canales con dato disponible en la ficha, en orden de preferencia
function canalesDe(m) {
  const c = [];
  if (telDe(m) || String(m.WhatsApp ?? '').trim()) c.push('wa');
  if (m.Instagram || m.Facebook) c.push('dm');
  if (mailDe(m)) c.push('correo');
  if (m['Formulario / contacto web']) c.push('form');
  if (phones(m['Teléfono'])[0]) c.push('llamada');
  return c.length ? c : ['wa'];
}
// Toque sugerido: contactos ya registrados + 1 (máx. 4). Canal sugerido: el toque 3 prefiere otro canal (correo/DM)
function sugiere(m) {
  const toque = Math.min(4, m.Estado === 'Sin contactar' ? 1 : D.bitacora.filter(x => x.Marca === m.Marca).length + 1);
  const cs = canalesDe(m);
  const canal = toque === 3 ? (cs.find(x => x === 'correo') || cs.find(x => x === 'dm') || cs[0]) : cs[0];
  return { toque, canal, cs };
}
function libVarN(canal, m, toque) { const b = LIB[canal]; if (!b) return 0; const s = b[segDe(m)] || b._ || b.indep; return ((s && s[toque]) || []).length; }
function libMsg(m, canal, toque, v) {
  const b = LIB[canal] || LIB.wa;
  const s = b[segDe(m)] || b._ || b.indep;
  const arr = (s && s[toque]) || (s && s[1]) || [];
  let t = arr[(v || 0) % (arr.length || 1)] || '';
  const yo = (typeof CFG !== 'undefined' && CFG.yo) || m.Responsable || '[tu nombre]';
  const asArr = toque === 3 && canal === 'correo' ? ASUNTOS.t3 : (ASUNTOS[segDe(m)] || ASUNTOS.indep);
  const rep = x => x.replace(/\{marca\}/g, m.Marca).replace(/\{giro\}/g, m.Giro && !/verificar/i.test(m.Giro) ? m.Giro : 'su giro').replace(/\{resp\}/g, yo).replace(/\{gancho\}/g, ganchoDe(m));
  return { txt: rep(t), asunto: rep(asArr[(v || 0) % asArr.length]) };
}
