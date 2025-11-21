# Guía de Seguridad - Boletas Ya

## Mejoras de Seguridad Implementadas

### 1. Headers de Seguridad HTTP

Se han agregado los siguientes headers de seguridad en `public/index.html`:

- **Content-Security-Policy (CSP)**: Previene ataques XSS limitando las fuentes de contenido permitidas
- **X-Content-Type-Options**: Previene MIME type sniffing
- **X-Frame-Options**: Previene clickjacking attacks
- **Strict-Transport-Security (HSTS)**: Fuerza conexiones HTTPS
- **Referrer-Policy**: Controla la información del referrer enviada

### 2. Gestión Segura de Cookies

Se creó `src/utils/securityHelpers.js` con funciones para:

- **Cookies con atributos de seguridad**:
  - `secure`: Solo se envían por HTTPS en producción
  - `sameSite: 'strict'`: Previene ataques CSRF
  - Expiración limitada (1 día)

### 3. Sanitización de Entradas

- Todas las entradas de usuario se sanitizan para prevenir XSS
- Función `sanitizeInput()` que escapa caracteres peligrosos

### 4. Validación de Tokens JWT

- Validación de formato antes de usar tokens
- Verificación de expiración
- Manejo seguro de errores

### 5. Protección contra CSRF

- Cookies con `sameSite: 'strict'`
- Validación de origen de solicitudes

## Recomendaciones Adicionales para el Backend

Para completar la seguridad, el backend debe implementar:

### 1. Configuración de CORS Estricta

```csharp
app.UseCors(options => options
    .WithOrigins("https://tu-dominio.com")
    .AllowCredentials()
    .AllowedHeaders("Content-Type", "Authorization")
    .AllowedMethods("GET", "POST", "PUT", "DELETE"));
```

### 2. Cookies HttpOnly en el Backend

Las cookies sensibles deben configurarse como HttpOnly desde el servidor:

```csharp
Response.Cookies.Append("token", token, new CookieOptions
{
    HttpOnly = true,
    Secure = true,
    SameSite = SameSiteMode.Strict,
    Expires = DateTimeOffset.UtcNow.AddDays(1)
});
```

### 3. Rate Limiting

Implementar límites de tasa para prevenir ataques de fuerza bruta:

```csharp
// Ejemplo con AspNetCoreRateLimit
services.AddMemoryCache();
services.Configure<IpRateLimitOptions>(Configuration.GetSection("IpRateLimiting"));
services.AddSingleton<IRateLimitConfiguration, RateLimitConfiguration>();
```

### 4. Validación de Entrada en el Backend

- Validar y sanitizar todas las entradas
- Usar Data Annotations o FluentValidation
- Prevenir SQL Injection con queries parametrizadas

### 5. Logging y Monitoreo

- Registrar intentos de acceso fallidos
- Monitorear actividad sospechosa
- Alertas de seguridad automáticas

### 6. HTTPS Obligatorio

```csharp
app.UseHttpsRedirection();
app.UseHsts();
```

### 7. Manejo Seguro de Contraseñas

- Hash con bcrypt, Argon2 o PBKDF2
- Salt único por usuario
- Nunca almacenar contraseñas en texto plano

## Checklist de Seguridad

### Frontend ✅
- [x] Content Security Policy configurada
- [x] Cookies con atributos de seguridad
- [x] Sanitización de entradas
- [x] Validación de tokens
- [x] Headers de seguridad HTTP
- [x] Manejo de errores sin exponer información sensible

### Backend (Pendiente)
- [ ] CORS configurado correctamente
- [ ] Cookies HttpOnly
- [ ] Rate Limiting
- [ ] Validación de entradas
- [ ] Logging de seguridad
- [ ] HTTPS en producción
- [ ] Hash de contraseñas

## Pruebas de Seguridad Recomendadas

1. **OWASP ZAP**: Escaneo automatizado de vulnerabilidades
2. **Burp Suite**: Análisis de tráfico HTTP
3. **npm audit**: Verificar dependencias vulnerables
4. **Lighthouse**: Auditoría de seguridad de Chrome

## Comandos Útiles

```bash
# Verificar vulnerabilidades en dependencias
npm audit

# Actualizar dependencias con parches de seguridad
npm audit fix

# Escaneo de seguridad detallado
npm audit --production
```

## Contacto de Seguridad

Para reportar vulnerabilidades de seguridad, contactar a: [tu-email@ejemplo.com]

## Actualizaciones

- **20/11/2025**: Implementación inicial de mejoras de seguridad
