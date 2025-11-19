# 🔄 REGLAS DE PROCESO Y METODOLOGÍA - KAIROS FLOW

## 🎯 **WORKFLOWS Y PROTOCOLOS DE DESARROLLO**

---

## **[R005] Regla de Memory Bank**

### **Contexto:**
Cline reinicia completamente su memoria entre sesiones, por lo que todo el conocimiento crítico del proyecto debe estar documentado para garantizar continuidad perfecta.

**Problema sin Memory Bank:**
```
Sesión 1: Desarrollador trabaja en Feature X
Sesión 2: Nuevo desarrollador no tiene contexto de Feature X
Sesión 3: Original developer lost context
Resultado: Información perdida, decisiones inconsistentes, rework
```

### **Solución Implementada:**
**Memory Bank Protocol** - Sistema de documentación obligatorio para toda información crítica.

### **Protocolo Obligatorio:**
```markdown
# ORDEN DE LECTURA OBLIGATORIO (6 archivos fundamentales):

1. memory-bank/core/current-state.md     # EL AHORA - Estado actual
2. memory-bank/core/projectbrief.md      # EL QUÉ Y PORQUÉ - Definición
3. memory-bank/core/productContext.md    # EL USUARIO - Audiencia objetivo  
4. memory-bank/technical/systemPatterns.md # LA ARQUITECTURA - Patrones
5. memory-bank/technical/techContext.md  # LAS HERRAMIENTAS - Stack
6. memory-bank/core/progress.md          # EL STATUS - Estado progreso
```

### **Reglas de Aplicación:**
1. **Lectura Obligatoria:** Los 6 archivos DEBEN leerse al inicio de cada sesión
2. **Orden Específico:** Seguir el orden establecido, no es opcional
3. **Verificación de Comprensión:** Confirmar entendimiento antes de proceder
4. **Actualización Continua:** Mantener información actualizada en cada sesión
5. **Navegación Clara:** Usar README del Memory Bank para orientación

### **Estructura Obligatoria del Memory Bank:**
```
memory-bank/
├── README.md                    # Índice principal
├── PROTOCOLO_MEMORY_BANK.md     # Protocolo consolidado
├── core/                        # Archivos fundamentales (6)
│   ├── current-state.md
│   ├── projectbrief.md
│   ├── productContext.md
│   └── progress.md
├── technical/                   # Documentación técnica
│   ├── systemPatterns.md
│   └── techContextContext.md
├── historical/                  # Logros históricos
├── planning/                    # Planes implementación
├── archived/                    # Archivos legados
└── deprecated/                  # Información obsoleta
```

### **Beneficios Comprobados:**
- **Continuidad:** 100% de contexto preservado entre sesiones
- **Onboarding:** Nuevos desarrolladores comprenden proyecto en < 1 hora
- **Decisiones:** Consistencia en decisiones técnicas
- **Progreso:** Tracking claro de avances y prioridades

### **Lecciones Aprendidas:**
- **Critical Information Only:** Documentar solo información crítica
- **Structure Matters:** Organización clara facilita navegación
- **Update Frequency:** Actualizar al final de cada sesión relevante
- **Protocol Discipline:** Protocolo debe seguirse sin excepción

---

## **[R006] Regla de Documentación**

### **Contexto:**
Decisiones técnicas sin documentación lead a pérdida de contexto y decisiones inconsistentes. En sistemas complejos como KairosFlow, documentar el "por qué" es tan importante como el "qué".

**Problemas sin Documentación:**
```
Developer A: "Why did we choose Zod over Joi?"
Developer B: "No idea, it was before my time"
Developer C: "Let's switch to Joi because it's better"
Result: Inconsistent decisions, wasted effort
```

### **Solución Implementada:**
**Documentación Sistemática** - Documentar TODAS las decisiones técnicas significativas.

### **Qué Documentar:**
```markdown
# Obligatorio Documentar:

✅ Decisiones de Arquitectura
✅ Elecciones de Stack Tecnológico  
✅ Patterns y Anti-patterns establecidos
✅ Casos de Uso validados
✅ Problemas encontrados y soluciones
✅ Lecciones Aprendidas
✅ Configuraciones críticas
✅ APIs y interfaces importantes

❌ NO Documentar:
- Decisiones obvias o triviaes
- Experimentos descartados sin valor
- Personal preferences sin justificación
```

### **Formato de Documentación:**
```markdown
# FORMATO ESTÁNDAR PARA DECISIONES TÉCNICAS

## Contexto
[Situación que requirió la decisión]

## Problema
[Descripción del problema específico]

## Opciones Consideradas
1. [Opción 1] - Pros/Cons
2. [Opción 2] - Pros/Cons  
3. [Opción 3] - Pros/Cons

## Decisión Tomada
[Qué se eligió y por qué]

## Justificación
[Razones técnicas específicas]

## Impacto
[Cómo afecta el proyecto]

## Lecciones Aprendidas
[Insights para el futuro]

## Referencias
[Enlaces a documentación adicional]
```

### **Reglas de Documentación:**
1. **Timing:** Documentar inmediatamente después de la decisión
2. **Completitud:** Incluir contexto completo, no solo la decisión
3. **Actualización:** Mantener documentación actualizada
4. **Accesibilidad:** Ubicar en lugares lógicos y buscables
5. **Revisión:** Revisar documentación periódicamente

### **Beneficios Comprobados:**
- **Knowledge Transfer:** Información preservada entre sesiones
- **Consistency:** Decisiones consistentes a través del tiempo
- **Onboarding:** Nuevos miembros entienden decisiones históricas
- **Debugging:** Historial de decisiones ayuda a resolver problemas

### **Lecciones Aprendidas:**
- **Just in Time:** Documentar decisiones mientras están frescas
- **Context is King:** El contexto es más importante que la decisión
- **Future-Proof:** Documentar pensando en futuro, no solo presente
- **Review Cycles:** Documentación debe revisarse y actualizarse

---

## **[R007] Workflow de Desarrollo**

### **Fases de Desarrollo Establecidas:**

#### **Fase 1: Analysis & Understanding**
```
Objetivo: Comprender completamente el problema antes de implementar

Pasos:
1. ✅ Leer Memory Bank completo
2. ✅ Analizar requisitos y casos de uso
3. ✅ Identificar patrones aplicables
4. ✅ Evaluar constraints técnicos
5. ✅ Definir métricas de éxito

Entregables:
- Understanding documentado en Memory Bank
- Technical approach definido
- Success criteria claras
```

#### **Fase 2: Design & Planning**
```
Objetivo: Diseñar solución antes de implementar

Pasos:
1. ✅ Aplicar patterns arquitectónicos
2. ✅ Definir agent responsibilities
3. ✅ Diseñar data flow
4. ✅ Plan validation strategy
5. ✅ Estimar token usage

Entregables:
- Architecture design document
- Agent definitions
- Validation plan
- Resource estimates
```

#### **Fase 3: Implementation**
```
Objetivo: Implementar siguiendo patterns establecidos

Pasos:
1. ✅ Implementar GranularArtifactStandard
2. ✅ Crear specialized agents
3. ✅ Implementar Context Orchestrator
4. ✅ Add validation gates
5. ✅ Test individual components

Entregables:
- Working implementation
- Unit tests
- Integration tests
- Documentation updates
```

#### **Fase 4: Validation & Testing**
```
Objetivo: Validar que la solución cumple requirements

Pasos:
1. ✅ Validate against success criteria
2. ✅ Performance testing
3. ✅ Token usage validation
4. ✅ End-to-end testing
5. ✅ Documentation review

Entregables:
- Test results
- Performance metrics
- Updated documentation
- Deployment readiness
```

### **Reglas del Workflow:**
1. **No Skipping:** No saltar fases, cada una es crucial
2. **Validation Gates:** Cada fase debe validar antes de continuar
3. **Documentation:** Documentar en cada fase
4. **Metrics:** Medir progreso con métricas específicas
5. **Review:** Review de cada fase antes de la siguiente

---

## **[R008] Code Review Standards**

### **Checklist de Code Review:**

#### **Technical Standards:**
```markdown
# Checklist Técnico

✅ Arquitectura
- [ ] Sigue Henry Ford Principle (un agent, un trabajo)
- [ ] Usa GranularArtifactStandard
- [ ] Implementa Context Orchestrator pattern
- [ ] Tiene validation gates apropiados

✅ Código Quality  
- [ ] TypeScript con tipos apropiados
- [ ] Error handling robusto
- [ ] No hard-coded values
- [ ] Appropriate abstractions

✅ Performance
- [ ] Token usage dentro de límites
- [ ] No unnecessary context injection
- [ ] Efficient validation logic
- [ ] Appropriate caching strategy
```

#### **Process Standards:**
```markdown
# Checklist de Proceso

✅ Documentación
- [ ] Memory Bank actualizado
- [ ] Decisiones técnicas documentadas
- [ ] Code comments apropiados
- [ ] Examples actualizados

✅ Testing
- [ ] Unit tests para lógica crítica
- [ ] Integration tests para agents
- [ ] End-to-end tests para workflows
- [ ] Performance tests incluidos

✅ Deployment
- [ ] Build process validado
- [ ] Environment variables documentadas
- [ ] Deployment checklist completada
- [ ] Rollback plan definido
```

### **Review Process:**
1. **Self Review:** Developer revisa su propio código primero
2. **Peer Review:** Al menos un peer revisa
3. **Architecture Review:** Review de decisiones arquitectónicas
4. **Documentation Review:** Verificación de documentación
5. **Final Approval:** Approval solo después de address todos los comments

---

## **[R009] Testing Standards**

### **Testing Pyramid para KairosFlow:**

#### **Unit Tests (70%)**
```typescript
// Tests para lógica individual de agentes
describe("Agent 001 - Product Manager", () => {
  test("should generate valid requirements spec", () => {
    const result = await agent001.execute(testInput);
    expect(result).toMatchSchema(GranularArtifactSchema);
    expect(result.validation.is_valid).toBe(true);
  });
  
  test("should handle invalid input gracefully", () => {
    expect(async () => {
      await agent001.execute(invalidInput);
    }).not.toThrow();
  });
});
```

#### **Integration Tests (20%)**
```typescript
// Tests para interaction entre agentes
describe("Pipeline Integration", () => {
  test("should execute full pipeline successfully", async () => {
    const pipeline = new AgentPipeline(agents);
    const result = await pipeline.execute(userRequest);
    
    expect(result.status).toBe("success");
    expect(result.artifacts).toHaveLength(5);
    expect(result.totalTokens).toBeLessThan(5000);
  });
});
```

#### **E2E Tests (10%)**
```typescript
// Tests para CLI completo
describe("CLI E2E", () => {
  test("should init and run pipeline", async () => {
    execSync("npm run build");
    execSync("node dist/cli.js init test-project");
    execSync("cd test-project && node ../dist/cli.js run");
    
    // Verify output
    expect(fs.existsSync("test-project/output.json")).toBe(true);
  });
});
```

### **Testing Rules:**
1. **Coverage Target:** >90% de code coverage
2. **Token Testing:** Test con token limits
3. **Performance Testing:** Benchmarks de performance
4. **Error Testing:** Test error conditions y recovery
5. **Documentation Tests:** Tests para examples y documentation

---

## **[R010] Deployment Standards**

### **Deployment Checklist:**

#### **Pre-Deployment:**
```markdown
✅ Code Quality
- [ ] All tests passing
- [ ] Code review completed
- [ ] Documentation updated
- [ ] Security scan completed

✅ Performance
- [ ] Token usage optimized
- [ ] Memory usage within limits
- [ ] Response times acceptable
- [ ] Scalability tested

✅ Monitoring
- [ ] Logging configured
- [ ] Metrics collection setup
- [ ] Alerting rules defined
- [ ] Dashboard updated
```

#### **Deployment Process:**
1. **Build Validation:** Verify build process works
2. **Staging Deployment:** Deploy to staging first
3. **Smoke Tests:** Run basic functionality tests
4. **Production Deployment:** Deploy to production
5. **Monitoring:** Monitor metrics post-deployment

#### **Post-Deployment:**
1. **Health Checks:** Verify system health
2. **Performance Monitoring:** Watch performance metrics
3. **User Feedback:** Monitor user feedback
4. **Rollback Plan:** Keep rollback ready if needed

---

## 🚨 **ANTI-PROCESOS**

### **❌ Jumping to Implementation**
```markdown
// NUNCA HACER ESTO
1. "We need Feature X"
2. "Let's code it"
3. *starts coding immediately*
// Sin análisis, sin design, sin documentación
```

### **❌ Skipping Documentation**
```markdown
// NUNCA HACER ESTO  
1. "I know how this works"
2. "No need to document"
3. "I'll remember"
// Resultado: Knowledge lost next session
```

### **❌ Ignoring Memory Bank**
```markdown
// NUNCA HACER ESTO
1. New session starts
2. "I don't need to read Memory Bank"
3. "I remember everything"
// Resultado: Inconsistent decisions
```

---

## 📊 **MÉTRICAS DE PROCESO**

### **KPIs de Proceso:**
- **Memory Bank Update Rate:** 100% de sesiones relevantes
- **Documentation Completeness:** >95% de decisiones documentadas
- **Code Review Coverage:** 100% de code reviewed
- **Test Coverage:** >90% line coverage
- **Deployment Success Rate:** >95% successful deployments

### **Quality Gates:**
- Cada fase debe completar antes de la siguiente
- Zero critical bugs en producción
- < 5 minutos para identificar problemas
- > 90% user satisfaction
- Documentación always up-to-date

---

*📅 Creado: 19/11/2025 10:19:00*  
*🔄 Última Actualización: 19/11/2025 10:19:00*  
*📊 Estado: Fundación establecida*
