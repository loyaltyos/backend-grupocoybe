# Mapeo de productos Hostinger → Conekta

Catálogo sincronizado con `productos-coybe-marmolmx-hostinger.csv`. Los identificadores son
estables y deben usarse sin modificaciones en Hostinger. Los precios están expresados en
centavos MXN y Conekta siempre los obtiene desde `lib/products.ts`, nunca desde el navegador.

| Producto en Hostinger | `productId` del backend | Precio server-side | URL final |
|---|---|---:|---|
| Compra mínima de prueba | `compra-minima-prueba` | 10000 ($100.00 MXN) | https://grupocoybe.com/pago?product=compra-minima-prueba |
| Mármol Carrara Premium | `marmol-carrara-premium` | 299000 ($2,990.00 MXN) | https://grupocoybe.com/pago?product=marmol-carrara-premium |
| Mármol Travertino Beige | `marmol-travertino-beige` | 269000 ($2,690.00 MXN) | https://grupocoybe.com/pago?product=marmol-travertino-beige |
| Cubierta de Cocina Premium | `cubierta-de-cocina-premium` | 899000 ($8,990.00 MXN) | https://grupocoybe.com/pago?product=cubierta-de-cocina-premium |
| Piso de Mármol Pulido | `piso-de-marmol-pulido` | 149000 ($1,490.00 MXN) | https://grupocoybe.com/pago?product=piso-de-marmol-pulido |
| Granito Negro San Gabriel | `granito-negro-san-gabriel` | 199000 ($1,990.00 MXN) | https://grupocoybe.com/pago?product=granito-negro-san-gabriel |
| Granito Gris Oxford | `granito-gris-oxford` | 179000 ($1,790.00 MXN) | https://grupocoybe.com/pago?product=granito-gris-oxford |
| Lavabo de Mármol Artesanal | `lavabo-de-marmol-artesanal` | 499000 ($4,990.00 MXN) | https://grupocoybe.com/pago?product=lavabo-de-marmol-artesanal |
| Escalón de Mármol a Medida | `escalon-de-marmol-a-medida` | 129000 ($1,290.00 MXN) | https://grupocoybe.com/pago?product=escalon-de-marmol-a-medida |
| Piedra Natural para Fachada | `piedra-natural-para-fachada` | 139000 ($1,390.00 MXN) | https://grupocoybe.com/pago?product=piedra-natural-para-fachada |
| Cuarzo Blanco Premium | `cuarzo-blanco-premium` | 249000 ($2,490.00 MXN) | https://grupocoybe.com/pago?product=cuarzo-blanco-premium |
| Ónix Iluminado Premium | `onix-iluminado-premium` | 499000 ($4,990.00 MXN) | https://grupocoybe.com/pago?product=onix-iluminado-premium |
| Recubrimiento Decorativo Premium | `recubrimiento-decorativo-premium` | 179000 ($1,790.00 MXN) | https://grupocoybe.com/pago?product=recubrimiento-decorativo-premium |

## Regla para nuevos IDs

Usar el nombre en minúsculas, eliminar acentos, convertir espacios a guiones y omitir
caracteres especiales. Una vez publicado, un `productId` no debe renombrarse porque rompería
los enlaces existentes de Hostinger.
