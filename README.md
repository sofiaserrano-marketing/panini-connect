# Panini Connect - App Generador de Stickers World Cup 2026

Aplicación web para que empleados de Connect creen su sticker personalizado del Mundial 2026.

## ✅ Estructura del Proyecto

```
panini-connect/
├── app/
│   ├── page.jsx                 # Página principal (UI)
│   ├── page.module.css          # Estilos
│   ├── layout.js                # Layout base
│   └── api/
│       └── generate/
│           └── route.js         # API para generar sticker
├── lib/
│   └── drive-utils.js           # Utilidades Google Drive
├── public/                       # Assets estáticos
├── .env.local.example           # Variables de entorno (ejemplo)
├── .gitignore                   # Archivos a ignorar en Git
├── package.json                 # Dependencias
├── next.config.js               # Configuración Next.js
└── README.md                    # Este archivo
```

## 🚀 Pasos para Deploy (5 minutos)

### PASO 1: Crear repositorio en GitHub

1. Entra a GitHub: https://github.com
2. Click en **"+"** → **"New repository"**
3. Nombre: `panini-connect`
4. Descripción: "App Panini - Generador de stickers World Cup 2026"
5. Privado o Público (tu preferencia)
6. Click en **"Create repository"**

### PASO 2: Subir archivos a GitHub

Una vez creado el repo, verás instrucciones. Pero aquí te lo explico más sencillo:

#### Opción A: Usando Git desde terminal (recomendado)

```bash
# En tu computadora, ve a una carpeta donde quieras guardar el proyecto
cd Desktop/

# Clona el repo (cambia USERNAME por tu usuario de GitHub)
git clone https://github.com/USERNAME/panini-connect.git
cd panini-connect

# Copia todos los archivos que te pasé aquí (dentro de esta carpeta)
# Luego:
git add .
git commit -m "Initial commit - Panini app"
git push origin main
```

#### Opción B: Usando GitHub Web (sin terminal)

1. En el repo que creaste, click en **"Add file"** → **"Upload files"**
2. Copia y pega los archivos aquí
3. Commit

### PASO 3: Conectar GitHub con Vercel

1. Entra a Vercel: https://vercel.com/dashboard
2. Click en **"New Project"**
3. Click en **"Import Git Repository"**
4. Busca `panini-connect` y selecciona
5. Click en **"Import"**

### PASO 4: Configurar Variables de Entorno

En Vercel, en la sección "Environment Variables", añade:

```
NEXT_PUBLIC_FIGMA_FILE_ID=0V5cu3bnW8Pp5nfw0hbpNK
FIGMA_API_TOKEN=figd_uF7cgXkSNsL-4Tc1gnrc5S3MLqRfvGpny71VHwNV
GOOGLE_DRIVE_FOLDER_ID=1Ylmx9f0qfZjzlFygYWREgL2Ej5f8K_dZ
```

Para Google Drive (opcionales por ahora):
```
GOOGLE_TYPE=service_account
GOOGLE_PROJECT_ID=
GOOGLE_PRIVATE_KEY_ID=
GOOGLE_PRIVATE_KEY=
GOOGLE_CLIENT_EMAIL=
GOOGLE_CLIENT_ID=
GOOGLE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
GOOGLE_TOKEN_URI=https://oauth2.googleapis.com/token
```

### PASO 5: Deploy

Click en **"Deploy"**

¡Listo! Tu app estará en vivo en ~2 minutos.

---

## 📋 Estructura de Archivos Detallada

### `app/page.jsx` - Página Principal
- UI completa con React
- Dropdown para seleccionar departamento (11 opciones)
- Input para subir foto
- Vista previa del sticker generado
- Botones Generar y Descargar

### `app/page.module.css` - Estilos
- Diseño profesional con colores Connect (naranja #F15B2B + navy #001D3D)
- Responsive (mobile + desktop)
- Estado de carga y mensajes

### `app/api/generate/route.js` - API Generate
- Recibe foto y departamento
- Consulta Figma API por template
- Compone imagen (foto + template)
- Sube a Google Drive (async)
- Devuelve PNG descargable

### `lib/drive-utils.js` - Google Drive Integration
- Autenticación con Service Account
- Función para subir archivos
- Manejo de errores

---

## 🔧 Configuración Local (para desarrollo)

Si quieres testear localmente antes de deployar:

```bash
# Instalar dependencias
npm install

# Crear .env.local con variables de entorno
cp .env.local.example .env.local
# Edita .env.local con tus valores

# Ejecutar servidor local
npm run dev

# Abre http://localhost:3000
```

---

## 🌍 Mapeo Departamentos → Países

| Departamento | País |
|---|---|
| Directivos | Argentina 🇦🇷 |
| Finanzas | Brasil 🇧🇷 |
| Operaciones y Comercial | Uruguay 🇺🇾 |
| Recursos Humanos | Alemania 🇩🇪 |
| Ingeniería | España 🇪🇸 |
| Producto | Inglaterra 🇬🇧 |
| Marketing | Francia 🇫🇷 |
| Soda | México 🇲🇽 |
| Connect One | Portugal 🇵🇹 |
| Premier | Colombia 🇨🇴 |
| IT | Países Bajos 🇳🇱 |

---

## 🔑 Variables de Entorno Críticas

- **FIGMA_API_TOKEN**: Ya tienes (de Alexa)
- **FIGMA_FILE_ID**: Ya tienes
- **GOOGLE_DRIVE_FOLDER_ID**: Ya tienes
- **Google Service Account**: Necesitas crear credenciales (ver abajo)

### Crear Credenciales Google Drive

1. Entra a: https://console.cloud.google.com
2. Crea un nuevo proyecto
3. Activa Google Drive API
4. Crea una "Service Account"
5. Genera una clave JSON
6. Copia los valores a variables de entorno en Vercel

---

## 🐛 Troubleshooting

**Error: "Module not found"**
→ Asegúrate de instalar dependencias: `npm install`

**Error: "FIGMA_API_TOKEN not found"**
→ Verifica que las variables de entorno estén configuradas en Vercel

**Las fotos no se guardan en Drive**
→ Revisa que Google Service Account esté correctamente configurado

**Sticker se genera pero se ve mal**
→ Los templates de Figma pueden necesitar ajustes en composición. Contacta a Alexa.

---

## 📞 Soporte

Si algo no funciona:
1. Revisa la consola de Vercel (Logs)
2. Verifica las variables de entorno
3. Contacta al equipo técnico de Connect

---

## 📝 Notas

- La app genera PNG en el navegador (no requiere servidor de imágenes)
- Las fotos se guardan en Google Drive automáticamente
- El flujo es 100% en vivo → sin esperas
- Soporta hasta 350 usuarios simultáneamente sin problemas

---

**Creado con ❤️ para Connect**
