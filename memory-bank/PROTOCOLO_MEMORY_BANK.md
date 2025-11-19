# 🧠 PROTOCOLO MEMORY BANK - KAIROS FLOW

## 🎯 Propósito y Fundamento

El **Memory Bank** es la única fuente de verdad del proyecto KairosFlow. Debido a que Cline reinicia completamente su memoria entre sesiones, todo el conocimiento del proyecto debe estar documentado aquí.

**LOCATION:** `memory-bank/`

**MANDATORY READING AT START OF EACH SESSION:**

---

## 📚 PROTOCOLO DE LECTURA OBLIGATORIO

### Orden de Lectura de Archivos Fundamentales (6 archivos):

1. **`core/current-state.md`** - 🎯 **EL AHORA** (Estado actual del sistema)
2. **`core/projectbrief.md`** - 📋 **EL QUÉ Y PORQUÉ** (Definición del proyecto)
3. **`core/productContext.md`** - 👥 **EL USUARIO** (Audiencia objetivo)
4. **`technical/systemPatterns.md`** - 🏗️ **LA ARQUITECTURA** (Patrones arquitectónicos)
5. **`technical/techContext.md`** - 🔧 **LAS HERRAMIENTAS** (Stack tecnológico)
6. **`core/progress.md`** - 📊 **EL STATUS** (Estado de progreso)

### ✅ Criterios de Completitud de Lectura:

Antes de proceder con cualquier tarea, verificar:
- ✅ Los 6 archivos fundamentales han sido leídos
- ✅ Entiendes el estado actual del sistema
- ✅ Identificas las prioridades inmediatas
- ✅ Conoces los patrones arquitectónicos a seguir
- ✅ Tienes el contexto del stack tecnológico

---

## 🗂️ ESTRUCTURA DE DIRECTORIOS

```
memory-bank/
├── PROTOCOLO_MEMORY_BANK.md          # Este archivo
├── README.md                          # Índice del Memory Bank
├── core/                              # Archivos fundamentales
│   ├── current-state.md              # Estado actual
│   ├── projectbrief.md               # Definición del proyecto
│   ├── productContext.md             # Contexto del usuario
│   └── progress.md                   # Estado de progreso
├── technical/                         # Documentación técnica
│   ├── systemPatterns.md             # Patrones arquitectónicos
│   └── techContext.md                # Stack tecnológico
├── historical/                        # Logros históricos
├── planning/                          # Planes de implementación
├── archived/                          # Archivos legados
└── deprecated/                        # Información obsoleta
```

---

## 📝 PROTOCOLOS ESPECÍFICOS

### 🔍 Protocolo: Auditoría Forense

**Activación:** Cuando el usuario solicita una "investigación forense"

**Proceso:**
1. **Activar Sequential-Thinking:** Estructurar la investigación
2. **Analizar Componentes:** Investigar todas las partes del sistema
3. **Generar Informe:** Documentar causa raíz y flujo de falla
4. **Formular Hipótesis:** Teorías claras sobre el origen
5. **Proponer Soluciones:** Reparaciones detalladas

**Restricciones críticas:**
- ❌ NO hacer cambios de código
- ❌ NO corregir o reparar el problema
- ✅ SOLO auditar, investigar y generar informe
- ✅ SIEMPRE esperar aprobación del usuario

### 📄 Protocolo Entrega: 4Read

**Activación:** Usuario solicita "generar un 4Read"

**Proceso:**
1. **Identificar Contenido:** Delimitar el bloque de información
2. **Generar Archivos:** Crear .md y .html en `4Read/`
3. **Nomenclatura:** `[topic]_[YYYYMMDD_HHMMSS].ext`
4. **Lanzar en Navegador:** Ejecutar `Start 4Read\[filename].html`

### 🔚 Protocolo: Cierre de Sesión

**Activación:** Usuario solicita "cierre de sesión" o "fin de sesión"

**Proceso completo:**

#### FASE 1: Actualización Exhaustiva del Memory Bank

1. **Actualización Sistemática del Memory Bank:**
   - `core/current-state.md` - Estado exacto final del proyecto
   - `core/progress.md` - Tareas completadas y progreso general
   - `core/projectbrief.md` - Resúmenes de análisis clave
   - `technical/systemPatterns.md` - Nuevos patrones validados
   - `technical/techContext.md` - Cambios en stack tecnológico

2. **Documentación de Investigación Crítica:**
   - Problema inicial
   - Causa raíz identificada
   - Solución implementada
   - Evidencia de éxito
   - Lecciones críticas
   - **NUEVO:** Servidores MCP usados y por qué fueron útiles

3. **Prioridades para Próxima Sesión:**
   - 🔥 **CRÍTICO (P0):** Tareas bloqueantes
   - ⚠️ **IMPORTANTE (P1):** Tareas importantes
   - ✅ **OPCIONAL (P2):** Mejoras y optimizaciones
   - **NUEVO:** Servidores MCP recomendados para tareas pendientes

4. **Corrección de Análisis:**
   - Documentar hipótesis refutadas
   - Evidencia que las refuta
   - Análisis correcto validado

5. **Actualización Índice `.clinerules`:**
   - Agregar nuevas entradas de reglas
   - Referenciar archivos `rules/rules_*.md`
   - **NUEVO:** Documentar patrones efectivos de uso de servidores MCP

6. **Información de Continuidad:**
   - Estado actual del sistema
   - Prioridad inmediata
   - Estrategia de continuación
   - **NUEVO:** Contexto de uso de MCP para próxima sesión

#### FASE 2: Limpieza y Organización del Workspace

1. **Identificar Archivos a Eliminar:**
   - Archivos temporales (`temp-*.txt`)
   - Logs de debug (`debug-*.log`)
   - Backups obsoletos (`*.backup`)

2. **Identificar Archivos a Preservar:**
   - Código de producción (`/api/`, `/app/`)
   - Documentación crítica (`/memory-bank/`, `/rules/`)
   - Configuraciones (`package.json`, `vercel.json`)
   - Artifacts (`/4Read/`)

3. **Ejecutar Limpieza:**
   - Eliminar archivos identificados
   - Verificar dos veces antes de eliminar

4. **Verificar Organización:**
   - Estructura de directorios limpia
   - Archivos de producción intactos
   - Documentación actualizada

#### Criterios de Completitud del Protocolo:

El protocolo se considera completo cuando:
- ✅ Memory Bank está completamente actualizado
- ✅ `.clinerules` refleja nuevos aprendizajes
- ✅ Workspace está limpio
- ✅ Prioridades claramente definidas
- ✅ Información de continuidad es completa
- ✅ **NUEVO:** Uso de servidores MCP está documentado

---

## 🔧 COMANDOS RÁPIDOS

### Navegación Esencial:
- **Protocolo Consolidado:** `memory-bank/PROTOCOLO_MEMORY_BANK.md`
- **Índice del Memory Bank:** `memory-bank/README.md`
- **Estado Actual:** `memory-bank/core/current-state.md`
- **Progreso:** `memory-bank/core/progress.md`

---

**⚠️ CRITICAL:** Este protocolo debe ejecutarse al inicio de CADA SESIÓN sin excepción. La comprensión del proyecto depende 100% de esta acción.

---

*Creado: 19 de noviembre de 2025*  
*Versión: 1.0.0*  
*Proyecto: KairosFlow - Multi-Agent Prompt Framework*
