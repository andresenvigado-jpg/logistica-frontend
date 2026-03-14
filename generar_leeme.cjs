const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  LevelFormat, PageNumber, Header, Footer
} = require('docx');
const fs = require('fs');

// ─── Helpers ────────────────────────────────────────────────────────────────
const border  = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const cellPad = { top: 100, bottom: 100, left: 140, right: 140 };

function h1(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text, bold: true, size: 32, font: "Arial" })] });
}
function h2(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text, bold: true, size: 26, font: "Arial" })] });
}
function h3(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun({ text, bold: true, size: 24, font: "Arial" })] });
}
function p(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 160 },
    children: [new TextRun({ text, size: 22, font: "Arial", ...opts })]
  });
}
function bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: 80 },
    children: [new TextRun({ text, size: 22, font: "Arial" })]
  });
}
function code(text) {
  return new Paragraph({
    spacing: { after: 100 },
    shading: { type: ShadingType.CLEAR, fill: "F3F3F3" },
    indent: { left: 400 },
    children: [new TextRun({ text, size: 20, font: "Courier New", color: "333333" })]
  });
}
function space() {
  return new Paragraph({ spacing: { after: 100 }, children: [] });
}
function twoColRow(col1, col2, isHeader = false) {
  const fill = isHeader ? "DDDDDD" : "FFFFFF";
  return new TableRow({
    children: [
      new TableCell({ borders, margins: cellPad, width: { size: 4200, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, fill },
        children: [new Paragraph({ children: [new TextRun({ text: col1, size: 20, font: "Arial", bold: isHeader })] })] }),
      new TableCell({ borders, margins: cellPad, width: { size: 5160, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, fill },
        children: [new Paragraph({ children: [new TextRun({ text: col2, size: 20, font: "Arial", bold: isHeader })] })] }),
    ]
  });
}
function table2(rows) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [4200, 5160],
    rows: rows.map((r, i) => twoColRow(r[0], r[1], i === 0))
  });
}

// ─── Documento ───────────────────────────────────────────────────────────────
const doc = new Document({
  numbering: {
    config: [{
      reference: "bullets",
      levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }]
    }]
  },
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: "222222" },
        paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0,
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA", space: 1 } } } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Arial", color: "333333" },
        paragraph: { spacing: { before: 300, after: 160 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: "444444" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 } },
    ]
  },
  sections: [{
    properties: {
      page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
    },
    headers: {
      default: new Header({ children: [new Paragraph({
        alignment: AlignmentType.RIGHT,
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC", space: 1 } },
        children: [new TextRun({ text: "Documentaci\u00F3n Frontend \u2014 Sistema de Gesti\u00F3n Log\u00EDstica", size: 18, font: "Arial", color: "888888" })]
      })] })
    },
    footers: {
      default: new Footer({ children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        border: { top: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC", space: 1 } },
        children: [
          new TextRun({ text: "P\u00E1gina ", size: 18, font: "Arial", color: "888888" }),
          new TextRun({ children: [PageNumber.CURRENT], size: 18, font: "Arial", color: "888888" }),
          new TextRun({ text: " de ", size: 18, font: "Arial", color: "888888" }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, font: "Arial", color: "888888" }),
        ]
      })] })
    },
    children: [

      // ── PORTADA ────────────────────────────────────────────────────────────
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 1200, after: 400 },
        children: [new TextRun({ text: "DOCUMENTACI\u00D3N FRONTEND", bold: true, size: 52, font: "Arial" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 },
        children: [new TextRun({ text: "Sistema de Gesti\u00F3n Log\u00EDstica", size: 36, font: "Arial", color: "444444" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 },
        children: [new TextRun({ text: "Gu\u00EDa para Desarrolladores Junior", size: 28, font: "Arial", color: "666666", italics: true })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 1200 },
        children: [new TextRun({ text: "Marzo 2026", size: 24, font: "Arial", color: "888888" })] }),
      new Paragraph({ children: [new TextRun({ text: "", size: 22 })] }),

      // ── 1. QUE ES ESTE PROYECTO ────────────────────────────────────────────
      h1("1. \u00BFQu\u00E9 es este proyecto?"),
      p("Este es el Frontend del Sistema de Gesti\u00F3n Log\u00EDstica. Es una aplicaci\u00F3n web que le permite a los usuarios gestionar clientes, bodegas, puertos y env\u00EDos terrestres y mar\u00EDtimos a trav\u00E9s de una interfaz visual."),
      p("La aplicaci\u00F3n se comunica con el Backend (API REST en FastAPI) para guardar y consultar datos en la base de datos PostgreSQL."),
      space(),

      // ── TECNOLOGIAS ─────────────────────────────────────────────────────────
      h2("1.1 Tecnolog\u00EDas utilizadas"),
      table2([
        ["Tecnolog\u00EDa", "Para qu\u00E9 se usa"],
        ["React 18", "Librer\u00EDa principal para construir la interfaz"],
        ["Vite", "Herramienta que compila y sirve el proyecto rapidamente"],
        ["React Router DOM", "Maneja la navegaci\u00F3n entre p\u00E1ginas (SPA)"],
        ["Axios", "Realiza las peticiones HTTP al Backend"],
        ["CSS plano", "Estilos visuales simples sin librerias externas"],
      ]),
      space(),

      // ── 2. ESTRUCTURA DE CARPETAS ───────────────────────────────────────────
      h1("2. Estructura de carpetas"),
      p("Dentro de la carpeta src/ encontrar\u00E1s todo el c\u00F3digo fuente organizado as\u00ED:"),
      space(),
      code("logistica_frontend/"),
      code("  src/"),
      code("    services/       <- Funciones que llaman al Backend"),
      code("    pages/          <- Pantallas de la aplicacion"),
      code("    components/     <- Piezas reutilizables (Navbar, Modal)"),
      code("    App.jsx         <- Define las rutas de la aplicacion"),
      code("    App.css         <- Todos los estilos visuales"),
      code("    main.jsx        <- Punto de entrada de React"),
      space(),

      // ── SERVICIOS ──────────────────────────────────────────────────────────
      h1("3. Capa de Servicios"),
      p("Los servicios son funciones que se comunican con el Backend. Est\u00E1n en la carpeta services/ y cada uno agrupa las operaciones de un m\u00F3dulo."),
      space(),
      h2("3.1 api.js \u2014 Configuraci\u00F3n base"),
      p("Este archivo configura Axios para que todas las peticiones vayan al Backend autom\u00E1ticamente con el token de autenticaci\u00F3n:"),
      space(),
      code("const api = axios.create({"),
      code("  baseURL: 'http://localhost:8001/api/v1'"),
      code("});"),
      code(""),
      code("// Adjunta el token en cada peticion"),
      code("api.interceptors.request.use((config) => {"),
      code("  const token = localStorage.getItem('token');"),
      code("  if (token) config.headers.Authorization = `Bearer ${token}`;"),
      code("  return config;"),
      code("});"),
      space(),
      p("El interceptor funciona como un middleware: antes de enviar cualquier petici\u00F3n, revisa si hay un token guardado y lo adjunta en el encabezado. As\u00ED no tienes que hacerlo manualmente en cada llamada."),
      space(),
      h2("3.2 Servicios disponibles"),
      table2([
        ["Archivo", "Funciones que expone"],
        ["authService.js", "login(data), register(data)"],
        ["clientesService.js", "getAll(), create(data), update(id,data), remove(id)"],
        ["bodegasService.js", "getAll(), create(data), update(id,data), remove(id)"],
        ["puertosService.js", "getAll(), create(data), update(id,data), remove(id)"],
        ["enviosService.js", "getTerrestres(), createTerrestre(data), getMaritimos(), createMaritimo(data)"],
      ]),
      space(),

      // ── 4. PAGINAS ─────────────────────────────────────────────────────────
      h1("4. P\u00E1ginas (Pages)"),
      p("Cada archivo en pages/ representa una pantalla completa de la aplicaci\u00F3n."),
      space(),
      h2("4.1 LoginPage.jsx \u2014 Inicio de sesi\u00F3n"),
      p("Muestra un formulario para que el usuario ingrese su email y contrase\u00F1a. Al hacer clic en Ingresar:"),
      bullet("Llama a authService.login() con los datos del formulario"),
      bullet("Si el Backend responde con \u00E9xito, guarda el token en localStorage"),
      bullet("Redirige al usuario a la pantalla principal (/)"),
      bullet("Si falla, muestra un mensaje de error"),
      space(),
      h2("4.2 RegisterPage.jsx \u2014 Registro"),
      p("Permite crear un nuevo usuario con username, email y contrase\u00F1a. El proceso es igual al login pero llama a authService.register()."),
      space(),
      h2("4.3 HomePage.jsx \u2014 Men\u00FA principal"),
      p("Muestra tarjetas de navegaci\u00F3n para acceder a cada m\u00F3dulo: Clientes, Bodegas, Puertos, Env\u00EDos Terrestres y Env\u00EDos Mar\u00EDtimos."),
      space(),
      h2("4.4 P\u00E1ginas de CRUD (Clientes, Bodegas, Puertos, Env\u00EDos)"),
      p("Todas siguen el mismo patr\u00F3n:"),
      bullet("Al cargar la p\u00E1gina, llaman al Backend para traer todos los registros"),
      bullet("Los muestran en una tabla con columnas y filas"),
      bullet("Bot\u00F3n Nuevo abre un modal con formulario para crear"),
      bullet("Bot\u00F3n Editar carga los datos en el mismo modal para modificar"),
      bullet("Bot\u00F3n Eliminar pregunta confirmaci\u00F3n y luego borra el registro"),
      space(),

      // ── 5. COMPONENTES ─────────────────────────────────────────────────────
      h1("5. Componentes reutilizables"),
      space(),
      h2("5.1 Navbar.jsx"),
      p("La barra de navegaci\u00F3n que aparece en la parte superior de todas las p\u00E1ginas. Contiene:"),
      bullet("El nombre del sistema a la izquierda (clic vuelve al inicio)"),
      bullet("Los enlaces a cada m\u00F3dulo en el centro"),
      bullet("El bot\u00F3n Cerrar sesi\u00F3n a la derecha"),
      space(),
      p("Cuando el usuario hace clic en Cerrar sesi\u00F3n, el componente:"),
      code("localStorage.removeItem('token');  // Borra el token"),
      code("navigate('/login');                 // Redirige al login"),
      space(),
      h2("5.2 BackButton.jsx"),
      p("Un bot\u00F3n simple que al hacer clic regresa a la p\u00E1gina anterior usando navigate(-1) de React Router."),
      space(),
      h2("5.3 Modal.jsx"),
      p("Ventana emergente que se usa para los formularios de crear y editar. Recibe por props:"),
      bullet("title: T\u00EDtulo que aparece en la cabecera del modal"),
      bullet("onClose: Funci\u00F3n que se ejecuta al cerrar"),
      bullet("children: El contenido del formulario (cada p\u00E1gina pone su propio formulario)"),
      space(),

      // ── 6. ENRUTAMIENTO ────────────────────────────────────────────────────
      h1("6. Enrutamiento (navegaci\u00F3n SPA)"),
      p("React Router DOM permite navegar entre pantallas sin recargar el navegador. Toda la configuraci\u00F3n est\u00E1 en App.jsx:"),
      space(),
      code("function PrivateRoute({ children }) {"),
      code("  const token = localStorage.getItem('token');"),
      code("  return token ? children : <Navigate to='/login' />;"),
      code("}"),
      space(),
      p("El componente PrivateRoute protege las rutas privadas. Si el usuario no tiene token (no inici\u00F3 sesi\u00F3n), lo redirige autom\u00E1ticamente al login."),
      space(),
      table2([
        ["Ruta URL", "Pantalla que muestra"],
        ["/login", "Inicio de sesi\u00F3n (p\u00FAblica)"],
        ["/register", "Registro de usuario (p\u00FAblica)"],
        ["/", "P\u00E1gina principal con men\u00FA (privada)"],
        ["/clientes", "Gesti\u00F3n de clientes (privada)"],
        ["/bodegas", "Gesti\u00F3n de bodegas (privada)"],
        ["/puertos", "Gesti\u00F3n de puertos (privada)"],
        ["/envios/terrestres", "Env\u00EDos terrestres (privada)"],
        ["/envios/maritimos", "Env\u00EDos mar\u00EDtimos (privada)"],
      ]),
      space(),

      // ── 7. AUTENTICACION ───────────────────────────────────────────────────
      h1("7. Autenticaci\u00F3n con Token"),
      p("El sistema usa tokens JWT de tipo Bearer. El flujo completo es:"),
      space(),
      p("Paso 1 \u2014 El usuario ingresa email y contrase\u00F1a en el login"),
      p("Paso 2 \u2014 El Frontend env\u00EDa esos datos al Backend (POST /auth/login)"),
      p("Paso 3 \u2014 El Backend verifica las credenciales y responde con un token"),
      p("Paso 4 \u2014 El Frontend guarda el token en localStorage del navegador"),
      p("Paso 5 \u2014 En cada petici\u00F3n siguiente, el interceptor de Axios adjunta el token"),
      p("Paso 6 \u2014 Si el Backend responde 401 (no autorizado), se limpia el token y se redirige al login"),
      space(),
      p("El token se guarda as\u00ED:", { bold: true }),
      code("localStorage.setItem('token', data.access_token);"),
      space(),
      p("Y se lee as\u00ED:", { bold: true }),
      code("const token = localStorage.getItem('token');"),
      space(),

      // ── 8. FLUJO DE UNA PAGINA ─────────────────────────────────────────────
      h1("8. \u00BFC\u00F3mo funciona una p\u00E1gina de CRUD?"),
      p("Tomemos ClientesPage.jsx como ejemplo para entender el patr\u00F3n que siguen todas las p\u00E1ginas:"),
      space(),
      h2("8.1 Estado del componente"),
      code("const [clientes, setClientes] = useState([]);   // Lista de clientes"),
      code("const [loading, setLoading]   = useState(true); // Cargando datos"),
      code("const [error, setError]       = useState('');   // Mensaje de error"),
      code("const [showModal, setShowModal] = useState(false); // Abrir/cerrar modal"),
      code("const [form, setForm]         = useState({...}); // Datos del formulario"),
      space(),
      h2("8.2 Cargar datos al iniciar"),
      code("useEffect(() => {"),
      code("  clientesService.getAll()"),
      code("    .then(res => setClientes(res.data))"),
      code("    .catch(() => setError('Error al cargar'))"),
      code("    .finally(() => setLoading(false));"),
      code("}, []); // [] = solo se ejecuta una vez al cargar"),
      space(),
      h2("8.3 Crear o editar"),
      code("const handleSubmit = async (e) => {"),
      code("  e.preventDefault();"),
      code("  if (editId) {"),
      code("    await clientesService.update(editId, form); // Editar"),
      code("  } else {"),
      code("    await clientesService.create(form);         // Crear"),
      code("  }"),
      code("  setShowModal(false); // Cerrar modal"),
      code("  cargarClientes();    // Recargar la tabla"),
      code("};"),
      space(),
      h2("8.4 Eliminar"),
      code("const handleDelete = async (id) => {"),
      code("  if (!confirm('Seguro?')) return;"),
      code("  await clientesService.remove(id);"),
      code("  cargarClientes();"),
      code("};"),
      space(),

      // ── 9. COMO EJECUTAR ───────────────────────────────────────────────────
      h1("9. C\u00F3mo ejecutar el proyecto"),
      space(),
      h2("Requisitos previos"),
      bullet("Node.js 18 o superior instalado"),
      bullet("El Backend debe estar corriendo en http://localhost:8001"),
      space(),
      h2("Comandos"),
      p("Ir a la carpeta del proyecto:", { bold: true }),
      code("cd C:\\claude\\logistica_frontend"),
      space(),
      p("Instalar dependencias (solo la primera vez):", { bold: true }),
      code("npm install"),
      space(),
      p("Iniciar el servidor de desarrollo:", { bold: true }),
      code("npm run dev"),
      space(),
      p("Abrir en el navegador:", { bold: true }),
      code("http://localhost:5173"),
      space(),

      // ── 10. ERRORES COMUNES ────────────────────────────────────────────────
      h1("10. Errores comunes y soluciones"),
      table2([
        ["Error", "Soluci\u00F3n"],
        ["Network Error al hacer login", "Verificar que el Backend est\u00E9 corriendo en puerto 8001"],
        ["CORS error en consola", "Reiniciar el Backend (ya tiene CORS configurado)"],
        ["Pantalla en blanco al entrar", "Revisar consola F12 por errores de JavaScript"],
        ["Token expirado / 401", "Cerrar sesi\u00F3n y volver a iniciar"],
        ["Puerto 5173 ocupado", "Cambiar puerto en vite.config.js o liberar el proceso"],
      ]),
      space(),

      // ── 11. GLOSARIO ───────────────────────────────────────────────────────
      h1("11. Glosario para Junior"),
      table2([
        ["T\u00E9rmino", "Significado sencillo"],
        ["SPA", "Single Page Application: la p\u00E1gina no se recarga, solo cambia el contenido"],
        ["Estado (state)", "Variables que cuando cambian, React actualiza la pantalla autom\u00E1ticamente"],
        ["Hook (useState, useEffect)", "Funciones especiales de React para manejar estado y efectos"],
        ["Props", "Datos que un componente padre le pasa a un componente hijo"],
        ["Token JWT", "Cadena de texto que identifica al usuario autenticado"],
        ["localStorage", "Almacenamiento del navegador que persiste aunque cierres la pesta\u00F1a"],
        ["Axios", "Librer\u00EDa para hacer peticiones HTTP (GET, POST, PUT, DELETE)"],
        ["Interceptor", "Funci\u00F3n que se ejecuta autom\u00E1ticamente antes o despu\u00E9s de cada petici\u00F3n"],
        ["CORS", "Pol\u00EDtica de seguridad que controla qu\u00E9 or\u00EDgenes pueden llamar al Backend"],
      ]),
      space(),

    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('LEEME_FRONTEND.docx', buffer);
  console.log('Archivo LEEME_FRONTEND.docx generado correctamente.');
});
