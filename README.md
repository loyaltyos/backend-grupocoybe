# Micro-backend Conekta — Grupo Coybe

Backend Next.js para crear órdenes seguras de Conekta Checkout Component. El navegador solo envía el ID y la cantidad; el nombre y precio salen de `lib/products.ts`.

> Los precios incluidos son ejemplos y **no deben publicarse en producción** hasta sustituirlos con el CSV aprobado de MarmolMX.

## Configuración

1. Copia `.env.example` a `.env.local` y agrega las llaves de prueba.
2. En Vercel configura las mismas variables para Preview y Production.
3. `CONEKTA_PRIVATE_KEY` solo existe en Vercel/backend. Nunca se pega en Hostinger.
4. `CONEKTA_WEBHOOK_SECRET`, pese al nombre solicitado, debe contener la **llave pública RSA del webhook** que Conekta genera en su panel/API. En Vercel puede pegarse como PEM usando `\n` para los saltos de línea.

```dotenv
NEXT_PUBLIC_SITE_URL=https://grupocoybe.com
CONEKTA_PRIVATE_KEY=key_...
NEXT_PUBLIC_CONEKTA_PUBLIC_KEY=key_...
CONEKTA_WEBHOOK_SECRET=-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----
```

La llave `NEXT_PUBLIC_CONEKTA_PUBLIC_KEY` es pública por diseño y se usa al inicializar el componente. No concede acceso administrativo.

## Contrato para Hostinger

Después de desplegar, el bloque **Embed Code** debe llamar exactamente a:

```text
POST https://TU-PROYECTO.vercel.app/api/conekta/create-order
Content-Type: application/json
```

Body (sin precio):

```json
{
  "productId": "cemento-cpc-50kg",
  "quantity": 1,
  "customer": {
    "name": "Nombre Apellido",
    "email": "cliente@ejemplo.com",
    "phone": "+529981234567"
  }
}
```

Respuesta exitosa:

```json
{
  "orderId": "ord_...",
  "checkoutRequestId": "...",
  "checkoutUrl": null
}
```

Para el Checkout embebido se usa `checkoutRequestId`. Ejemplo orientativo para la siguiente fase en Hostinger:

```html
<div id="conekta-checkout"></div>
<script crossorigin src="https://pay.conekta.com/v1.0/js/conekta-checkout.min.js"></script>
<script type="module">
  // Tras validar el formulario del cliente:
  const response = await fetch("https://TU-PROYECTO.vercel.app/api/conekta/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, quantity, customer })
  });
  if (!response.ok) throw new Error("No se pudo iniciar el pago");
  const { checkoutRequestId } = await response.json();

  window.ConektaCheckoutComponents.Integration({
    config: {
      locale: "es",
      publicKey: "TU_LLAVE_PUBLICA_CONEKTA",
      targetIFrame: "#conekta-checkout",
      checkoutRequestId
    },
    callbacks: {
      onFinalizePayment: () => location.href = "https://TU-PROYECTO.vercel.app/checkout/success",
      onErrorPayment: () => location.href = "https://TU-PROYECTO.vercel.app/checkout/failure"
    },
    options: { backgroundMode: "lightMode", autoResize: true }
  });
</script>
```

Este fragmento es documentación; no se ha conectado ni modificado Hostinger.

El bloque completo y dinámico para la ruta `https://grupocoybe.com/pago?product=ID_DEL_PRODUCTO`
está en `hostinger-checkout.html`. Consulta el producto mediante `GET /api/products/:id` y
solo envía su ID al crear la orden; el precio del cobro siempre se recalcula en el backend.

## Webhook

Configura en Conekta:

```text
https://TU-PROYECTO.vercel.app/api/conekta/webhook
```

Suscribe al menos `order.paid`, `order.pending_payment` y `order.declined`. El endpoint verifica el header `DIGEST` sobre el body original y registra un log estructurado sin datos del cliente. Los reintentos no disparan efectos secundarios. Al incorporar una base de datos, `event.id` debe guardarse con restricción `UNIQUE` para idempotencia persistente antes de agregar inventario, correo o facturación.

## CORS y validación

- Producción: solo `https://grupocoybe.com`.
- Desarrollo: además `localhost` y `127.0.0.1`, con cualquier puerto.
- Cantidad: entero entre 1 y 100.
- El body es estricto; no se acepta `price`, `unitPrice` ni campos adicionales.
- Cualquier error de creación devuelve únicamente `No se pudo iniciar el pago`.

## Desarrollo

```bash
npm install
npm run dev
npm run lint
npm run build
```

El POST local debe incluir un header `Origin`, por ejemplo `http://localhost:3000`, para reproducir el comportamiento del navegador.

## Referencias oficiales

- [Checkout Component](https://developers.conekta.com/docs/componente-de-pago)
- [Crear orden](https://developers.conekta.com/reference/createorder)
- [Verificar firmas de webhook](https://developers.conekta.com/docs/autenticaci%C3%B3n-webhooks)
