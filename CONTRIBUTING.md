# Contribuir a Panaqua

Gracias por tu interés en contribuir a Panaqua!

## Guías para Contribuir

### Reportar Bugs

1. Verifica que el bug no haya sido reportado antes
2. Incluye:
   - Descripción clara del problema
   - Pasos para reproducirlo
   - Comportamiento esperado vs actual
   - Capturas de pantalla si es posible
   - Información del navegador y sistema operativo

### Sugerir Funcionalidades

1. Verifica que la funcionalidad no exista
2. Incluye:
   - Descripción de la funcionalidad
   - Caso de uso
   - Beneficio para los usuarios

### Pull Requests

1. Haz fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Haz commit de tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

### Estilo de Código

- Usa Prettier para formatear el código
- Sigue las guías de ESLint
- Escribe código limpio y mantenible
- Agrega comentarios cuando sea necesario

### Estructura de Commits

```
tipo(alcance): descripción

Ejemplos:
feat(auth): agregar login de usuario
fix(cart): corregir cálculo de total
docs(readme): actualizar instrucciones
style(css): formatear estilos
```

### Tipos de Commit

- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Documentación
- `style`: Estilos (CSS, formateo)
- `refactor`: Refactorización de código
- `test`: Agregar o actualizar tests
- `chore`: Tareas de mantenimiento

## Desarrollo Local

### Requisitos

- Node.js 18+
- npm 8+

### Instalación

```bash
git clone https://github.com/tu-usuario/panaqua.git
cd panaqua
npm install
```

### Desarrollo

```bash
npm run dev
```

### Build de Producción

```bash
npm run build
```

## Preguntas

Si tenés preguntas, abrí un issue en el repositorio.
