# 🔧 REGLAS TÉCNICAS - KAIROS FLOW

## 🎯 **REGLAS ESPECÍFICAS DE IMPLEMENTACIÓN TÉCNICA**

---

## **[R001] Regla de Separación de Responsabilidades (Henry Ford Principle)**

### **Contexto:**
Problema común en sistemas multi-agente donde un solo agente intenta manejar múltiples responsabilidades, resultando en prompts de 3,000+ tokens que son difíciles de controlar, debuggear y mantener.

**Señales de Alerta:**
- Prompts > 1,000 tokens consistentemente
- Un agente maneja: requirements + design + implementation + testing + documentation
- Dificultad para identificar dónde fallan las cosas
- Outputs inconsistentes en calidad

### **Solución Implementada:**
Aplicar el **Henry Ford Principle**: "Un agente, un trabajo, hecho perfectamente."

**Implementación Correcta:**
```
ANTES (Problemático):
Single Agent: "Build a contact form plugin with validation, styling, database integration, and documentation"
Tokens: 3,500+
Resultado: Chaos, debugging nightmares

DESPUÉS (Correcto):
Agent 001: Requirements Analysis → Specification (400 tokens)
Agent 002: System Architecture → Design Document (400 tokens) 
Agent 003: Backend Development → PHP Code (400 tokens)
Agent 004: Frontend Development → JavaScript/CSS (400 tokens)
Agent 005: Quality Assurance → Test Results (400 tokens)
Total: 2,000 tokens (43% reduction)
```

### **Ejemplo de Código:**
```typescript
// ❌ INCORRECTO: Monolithic agent
interface MonolithicAgent {
  responsibility: "everything"; // DON'T DO THIS
  prompt: "You are an expert developer. Build a complete WordPress plugin with requirements analysis, architecture design, backend code, frontend code, testing, and documentation...";
  tokens: 3500;
}

// ✅ CORRECTO: Specialized agents
interface SpecializedAgent {
  agent_id: "AG001";
  agent_name: "Product Manager";
  responsibility: "Requirements Analysis"; // Single, focused responsibility
  prompt: "You are a requirements analyst. Your ONLY job is to analyze user requirements and create a clear specification document. Focus on understanding what needs to be built, not how to build it.";
  expected_output: "Requirements Specification";
  tokens: 400; // Target range
}
```

### **Reglas de Aplicación:**
1. **Responsabilidad Única:** Cada agente debe tener una responsabilidad específica y atomic
2. **Límite de Tokens:** 200-600 tokens por agente (objetivo: 400)
3. **Métricas de Éxito:** Cada agente debe tener criterios claros de éxito/fracaso
4. **Reutilización:** Agentes deben ser reutilizables en diferentes contextos

### **Lecciones Aprendidas:**
- **Especialización > Generalización:** Agentes especializados producen mejores resultados
- **Límites de Contexto:** Menor contexto por agente = mejor foco
- **Debugging:** Más fácil identificar problemas en flujos granulares
- **Mantenimiento:** Cambios son aislados, no tienen efectos colaterales

---

## **[R002] Regla de GranularArtifactStandard**

### **Contexto:**
La comunicación entre agentes requiere un formato estandarizado para garantizar consistencia, trazabilidad y validación automática. Sin estándar, cada agente podría usar formatos diferentes, causando errores y dificultando el debugging.

**Problemas sin Estándar:**
- Agentes no pueden comunicarse efectivamente
- Imposible validar outputs automáticamente
- Falta de trazabilidad en las decisiones
- Debugging extremadamente difícil

### **Solución Implementada:**
**GranularArtifactStandard v1.0.0** - Protocolo JSON unificado para toda comunicación entre agentes.

### **Ejemplo de Código:**
```typescript
// ✅ IMPLEMENTACIÓN CORRECTA
export const GranularArtifactSchema = z.object({
  agent_id: z.string().describe("Unique identifier (AG001, AG002, etc.)"),
  agent_name: z.string().describe("Human-readable agent name"),
  responsibility: z.string().describe("Single specific responsibility"),
  input: z.record(z.any()).describe("Context and data provided"),
  output: z.union([
    z.record(z.any()), 
    z.string(), 
    z.array(z.any())
  ]).describe("The work produced by agent"),
  metadata: z.object({
    timestamp: z.string().datetime(),
    tokens_used: z.number().optional(),
    execution_time_ms: z.number().optional(),
    status: z.enum(['success', 'error', 'pending']),
    model: z.string().optional()
  }),
  validation: z.object({
    is_valid: z.boolean(),
    checks_passed: z.array(z.string()),
    errors: z.array(z.string()).optional()
  })
});

// ✅ EJEMPLO DE USO CORRECTO
const agentOutput: GranularArtifact = {
  agent_id: "AG001",
  agent_name: "Product Manager", 
  responsibility: "Requirements Analysis",
  input: {
    user_request: "Build a contact form plugin",
    constraints: ["WordPress 6.0+", "GDPR compliant"]
  },
  output: {
    specification: "Detailed requirements document...",
    acceptance_criteria: ["Form validation", "Email sending", "Data storage"]
  },
  metadata: {
    timestamp: "2025-11-19T10:00:00Z",
    tokens_used: 380,
    execution_time_ms: 1200,
    status: "success"
  },
  validation: {
    is_valid: true,
    checks_passed: ["format", "completeness", "requirements_clarity"]
  }
};
```

### **Reglas de Aplicación:**
1. **Formato Obligatorio:** TODOS los agentes deben usar GranularArtifactStandard
2. **Validación Automática:** Cada output debe ser validado contra el schema
3. **Trazabilidad Completa:** Cada artifact debe permitir rastrear la decisión
4. **Metadata Requerido:** Timestamp y status son obligatorios, otros campos opcionales

### **Beneficios Comprobados:**
- **Consistencia:** 100% de outputs siguen el mismo formato
- **Debugging:** Identificación precisa de problemas en < 30 minutos
- **Validación:** Errores detectados automáticamente antes de continuar
- **Analytics:** Tracking de performance por agente

### **Lecciones Aprendidas:**
- **Schema First:** Definir el schema antes de implementar agentes
- **Validation Gates:** Nunca permitir artifacts inválidos en el pipeline
- **Metadata Value:** Tracking de tokens y tiempo es invaluable para optimization
- **Extensibility:** El schema debe permitir evolución sin breaking changes

---

## **[R003] Límites de Responsabilidad por Agente**

### **Contexto:**
Es tentador crear agentes que manejen múltiples tareas relacionadas, pero esto viola el principio de separación de responsabilidades y lleva de vuelta a los problemas del monolítico.

### **Reglas de Responsabilidad:**
1. **Una Función Principal:** Cada agente debe tener UNA función principal
2. **Atomicidad:** La responsabilidad no debe ser divisible
3. **Métricas Claras:** Debe ser posible medir el éxito del agente
4. **Reutilización:** Debe poder usarse en diferentes contextos

### **Ejemplos de Responsabilidades Válidas:**
- "Análisis de requirements" (no "análisis + diseño")
- "Generación de código backend" (no "código + testing")
- "Validación de contenido" (no "validación + mejora")
- "Documentación técnica" (no "documentación + training")

### **Señales de Alerta:**
- "Y" en la responsabilidad: "Requirements Analysis and System Design"
- Responsabilidades que requieren diferentes skillsets
- Imposibilidad de medir éxito claramente
- Agent que depende de múltiples tipos de contexto

---

## **[R004] Stack Tecnológico Estándar**

### **Contexto:**
Para mantener consistencia y facilidad de desarrollo, KairosFlow usa un stack específico que ha sido probado en producción.

### **Stack Obligatorio:**
```json
{
  "runtime": "Node.js 18+",
  "language": "TypeScript 5.3.2", 
  "cli_framework": "Commander 11.1.0",
  "validation": "Zod 3.22.4",
  "styling": "Chalk 4.1.2",
  "prompts": "Inquirer 8.2.6",
  "spinners": "ORA 5.4.1",
  "filesystem": "fs-extra 11.2.0"
}
```

### **Justificación de Elecciones:**
- **TypeScript:** Type safety, mejor DX, compile-time errors
- **Commander:** Standard de facto para CLI tools
- **Zod:** Runtime validation + TypeScript inference
- **Model-Agnostic:** Funciona con cualquier LLM provider

### **Reglas de Dependencias:**
1. **No Hard Dependencies:** Usar environment variables para API keys
2. **Minimal Dependencies:** Solo lo esencial para funcionamiento
3. **Version Pinning:** Especificar versiones exactas en package.json
4. **Peer Dependencies:** Evitar conflictos con proyectos que usen el framework

---

## 🚨 **ANTI-PATRONES TÉCNICOS**

### **❌ Agente Monolítico**
```typescript
// NUNCA HACER ESTO
const badAgent = {
  responsibility: "do everything",
  prompt: "You are an expert that handles requirements, design, coding, testing, and documentation...",
  tokens: 3500
};
```

### **❌ Communication Ad-Hoc**
```typescript
// NUNCA HACER ESTO
const badCommunication = {
  // Sin formato estándar
  agent1_output: "Build a form with validation",
  agent2_output: "Here's the PHP code...",
  // Imposible de validar o trackear
};
```

### **❌ Hard-coded Dependencies**
```typescript
// NUNCA HACER ESTO  
const hardCoded = {
  context: "Always include the full user request plus all documentation",
  // Esto viola el Context Orchestrator pattern
};
```

---

## 📊 **MÉTRICAS DE ADHERENCIA**

### **Técnicas de Verificación:**
1. **Token Counting:** Promedio < 500 tokens por agente
2. **Responsibility Review:** Una responsabilidad principal por agente
3. **Artifact Validation:** 100% de outputs siguen GranularArtifactStandard
4. **Traceability:** Cada decisión es rastreable via artifact ID

### **KPIs Técnicos:**
- **Token Reduction:** >50% vs approach monolítico
- **Debug Time:** <30 minutos para identificar problemas
- **Validation Success:** >95% de artifacts pasan validación
- **Agent Reusability:** >70% de agentes reutilizables entre proyectos

---

*📅 Creado: 19/11/2025 10:17:00*  
*🔄 Última Actualización: 19/11/2025 10:17:00*  
*📊 Estado: Fundación establecida*
