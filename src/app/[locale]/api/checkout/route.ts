import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const LOGO_TEXT_URL = "https://zenvia.com.mx/title.png";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(value);
}

function escapeHtml(value: string) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      orderId,
      amount,
      customer,
      items,
      metadata,
    } = body;

    if (
      !orderId ||
      !amount ||
      !customer ||
      !items ||
      !items.length
    ) {
      return NextResponse.json(
        {
          error:
            "Información de orden incompleta para facturación por email.",
        },
        { status: 400 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | TABLA DE PRODUCTOS
    |--------------------------------------------------------------------------
    | Se actualizó el diseño de las celdas con bordes más limpios, tipografía
    | moderna y espaciado optimizado.
    |--------------------------------------------------------------------------
    */
    let itemsTableRows = "";

    items.forEach((item: any) => {
      const productTotal = item.product.price * item.quantity;

      itemsTableRows += `
        <tr>
          <td
            style="
              padding: 16px 0;
              border-bottom: 1px solid #e4e4e7;
            "
          >
            <div
              style="
                font-size: 14px;
                font-weight: 600;
                color: #18181b;
                margin-bottom: 4px;
              "
            >
              ${escapeHtml(item.product.name)}
            </div>
            <div
              style="
                font-size: 13px;
                color: #71717a;
              "
            >
              ${formatCurrency(item.product.price)} c/u
            </div>
          </td>

          <td
            align="center"
            style="
              padding: 16px 0;
              border-bottom: 1px solid #e4e4e7;
              font-size: 14px;
              font-weight: 500;
              color: #3f3f46;
            "
          >
            ${item.quantity}
          </td>

          <td
            align="right"
            style="
              padding: 16px 0;
              border-bottom: 1px solid #e4e4e7;
              font-size: 14px;
              font-weight: 600;
              color: #18181b;
            "
          >
            ${formatCurrency(productTotal)}
          </td>
        </tr>
      `;
    });

    /*
    |--------------------------------------------------------------------------
    | HEADER BASE (REDISENADO)
    |--------------------------------------------------------------------------
    | Estructura limpia y minimalista, optimizando contrastes y legibilidad.
    |--------------------------------------------------------------------------
    */
    const emailHeader = `
      <table
        width="100%"
        border="0"
        cellspacing="0"
        cellpadding="0"
        style="
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          border: 1px solid #e4e4e7;
        "
      >
        <tr>
          <td style="padding: 40px 40px 0 40px; text-align: left;">
            <div style="margin-bottom: 32px;">
              <img
                src="${LOGO_TEXT_URL}"
                alt="Zenvia"
                style="
                  height: 32px;
                  width: auto;
                  display: block;
                "
              />
            </div>
            
            <div
              style="
                display: inline-block;
                padding: 6px 12px;
                border-radius: 6px;
                background: #f4f4f5;
                color: #18181b;
                font-size: 12px;
                font-weight: 600;
                letter-spacing: 0.05em;
                text-transform: uppercase;
                margin-bottom: 16px;
              "
            >
              Confirmación de Pedido
            </div>

            <h1
              style="
                margin: 0 0 12px 0;
                font-size: 28px;
                line-height: 1.2;
                font-weight: 700;
                color: #18181b;
                letter-spacing: -0.02em;
              "
            >
              ¡Gracias por tu compra!
            </h1>

            <p
              style="
                margin: 0;
                font-size: 15px;
                line-height: 1.6;
                color: #52525b;
              "
            >
              Tu orden ha sido procesada con éxito. A continuación encontrarás el resumen detallado de tu transacción.
            </p>
            
            <div style="margin-top: 32px; border-bottom: 1px solid #e4e4e7;"></div>
          </td>
        </tr>
    `;

    /*
    |--------------------------------------------------------------------------
    | FOOTER (REDISENADO)
    |--------------------------------------------------------------------------
    */
    const emailFooter = `
        <tr>
          <td style="padding: 0 40px 40px 40px;">
            <div style="margin-top: 16px; border-top: 1px solid #e4e4e7; padding-top: 32px; text-align: center;">
              <p
                style="
                  margin: 0;
                  font-size: 12px;
                  line-height: 1.6;
                  color: #a1a1aa;
                "
              >
                Zenvia &copy; 2026. Todos los derechos reservados.
              </p>
            </div>
          </td>
        </tr>
      </table>
    `;

    /*
    |--------------------------------------------------------------------------
    | EMAIL CLIENTE
    |--------------------------------------------------------------------------
    */
    const htmlCliente = `
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirmación de Compra</title>
        </head>
        <body
          style="
            margin: 0;
            padding: 0;
            background: #fafafa;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
          "
        >
          <table
            width="100%"
            border="0"
            cellspacing="0"
            cellpadding="0"
            style="
              background: #fafafa;
              padding: 40px 16px;
            "
          >
            <tr>
              <td align="center">

                ${emailHeader}

                <table
                  width="100%"
                  border="0"
                  cellspacing="0"
                  cellpadding="0"
                  style="max-width: 600px; margin: 0 auto; background: #ffffff;"
                >
                  <tr>
                    <td style="padding: 32px 40px 24px 40px;">
                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                          <td style="padding-bottom: 8px;">
                            <span style="font-size: 12px; font-weight: 600; text-transform: uppercase; color: #71717a; letter-spacing: 0.05em;">Cliente</span>
                            <div style="font-size: 16px; font-weight: 600; color: #18181b; margin-top: 4px;">${escapeHtml(customer.nombre)}</div>
                          </td>
                          <td align="right" style="padding-bottom: 8px; vertical-align: top;">
                            <span style="font-size: 12px; font-weight: 600; text-transform: uppercase; color: #71717a; letter-spacing: 0.05em;">No. de Orden</span>
                            <div style="font-size: 16px; font-weight: 700; color: #18181b; margin-top: 4px;">#${escapeHtml(orderId)}</div>
                          </td>
                        </tr>
                      </table>
                      <p style="margin: 20px 0 0 0; font-size: 14px; line-height: 1.6; color: #52525b;">
                        Tu compra ya fue validada y enviada al área de preparación y distribución.
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 0 40px 24px 40px;">
                      <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #18181b; letter-spacing: 0.05em; margin-bottom: 8px;">
                        Artículos Adquiridos
                      </div>
                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                        <thead>
                          <tr>
                            <th align="left" style="padding: 8px 0; font-size: 12px; font-weight: 500; color: #71717a; border-bottom: 1px solid #e4e4e7;">Producto</th>
                            <th align="center" style="padding: 8px 0; width: 60px; font-size: 12px; font-weight: 500; color: #71717a; border-bottom: 1px solid #e4e4e7;">Cant.</th>
                            <th align="right" style="padding: 8px 0; width: 100px; font-size: 12px; font-weight: 500; color: #71717a; border-bottom: 1px solid #e4e4e7;">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${itemsTableRows}
                        </tbody>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 0 40px 24px 40px;">
                      <table
                        width="100%"
                        border="0"
                        cellspacing="0"
                        cellpadding="0"
                        style="background: #f4f4f5; border-radius: 12px;"
                      >
                        <tr>
                          <td style="padding: 20px 24px;">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                              <tr>
                                <td>
                                  <div style="font-size: 12px; font-weight: 600; text-transform: uppercase; color: #71717a; letter-spacing: 0.05em; margin-bottom: 4px;">Total Liquidado</div>
                                  <div style="font-size: 28px; font-weight: 700; color: #18181b; letter-spacing: -0.02em;">${formatCurrency(amount)}</div>
                                </td>
                                <td align="right" style="vertical-align: middle;">
                                  <div style="display: inline-block; background: #e4e4e7; border-radius: 6px; padding: 6px 12px; font-size: 12px; font-weight: 600; color: #18181b;">
                                    Pago Confirmado
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 0 40px 32px 40px;">
                      <div style="background: #ffffff; border: 1px solid #e4e4e7; border-radius: 12px; padding: 20px 24px;">
                        <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #18181b; letter-spacing: 0.05em; margin-bottom: 8px;">
                          Dirección de Entrega
                        </div>
                        <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #52525b;">
                          ${escapeHtml(customer.direccion)}
                          ${customer.direccion2 ? `, ${escapeHtml(customer.direccion2)}` : ""}
                          <br>
                          ${escapeHtml(customer.ciudad)}, ${escapeHtml(customer.estado)}, C.P. ${escapeHtml(customer.cp)}
                        </p>
                      </div>
                    </td>
                  </tr>
                </table>

                ${emailFooter}

              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    /*
    |--------------------------------------------------------------------------
    | EMAIL NEGOCIO
    |--------------------------------------------------------------------------
    */
    const htmlNegocio = `
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Notificación de Venta</title>
        </head>
        <body
          style="
            margin: 0;
            padding: 0;
            background: #fafafa;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
          "
        >
          <table
            width="100%"
            border="0"
            cellspacing="0"
            cellpadding="0"
            style="
              background: #fafafa;
              padding: 40px 16px;
            "
          >
            <tr>
              <td align="center">

                ${emailHeader}

                <table
                  width="100%"
                  border="0"
                  cellspacing="0"
                  cellpadding="0"
                  style="max-width: 600px; margin: 0 auto; background: #ffffff;"
                >
                  <tr>
                    <td style="padding: 32px 40px 24px 40px;">
                      <div
                        style="
                          display: inline-block;
                          background: #18181b;
                          color: #ffffff;
                          padding: 6px 12px;
                          border-radius: 6px;
                          font-size: 11px;
                          font-weight: 600;
                          letter-spacing: 0.05em;
                          text-transform: uppercase;
                          margin-bottom: 16px;
                        "
                      >
                        Venta Ecommerce
                      </div>
                      <h2 style="margin: 0 0 12px 0; font-size: 24px; font-weight: 700; color: #18181b; letter-spacing: -0.02em;">
                        Nueva venta registrada
                      </h2>
                      <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #52525b;">
                        Se ha recibido y confirmado el pago de la orden <strong>#${escapeHtml(orderId)}</strong>. Por favor, procede con la preparación del envío correspondiente.
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 0 40px 24px 40px;">
                      <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #18181b; letter-spacing: 0.05em; margin-bottom: 8px;">
                        Detalle del Cliente y Entrega
                      </div>
                      <div style="background: #ffffff; border: 1px solid #e4e4e7; border-radius: 12px; padding: 20px 24px;">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 16px;">
                          <tr>
                            <td>
                              <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #71717a;">Nombre del Cliente</div>
                              <div style="font-size: 14px; font-weight: 600; color: #18181b; margin-top: 2px;">${escapeHtml(customer.nombre)}</div>
                            </td>
                            <td align="right">
                              <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #71717a;">Email de Contacto</div>
                              <div style="font-size: 14px; font-weight: 600; color: #18181b; margin-top: 2px;">${escapeHtml(customer.email || "No provisto")}</div>
                            </td>
                          </tr>
                        </table>
                        <div style="border-top: 1px solid #e4e4e7; padding-top: 16px;">
                          <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #71717a; margin-bottom: 4px;">Destino de Envío</div>
                          <div style="font-size: 14px; line-height: 1.5; color: #52525b;">
                            ${escapeHtml(customer.direccion)}
                            ${customer.direccion2 ? `, ${escapeHtml(customer.direccion2)}` : ""}
                            <br>
                            ${escapeHtml(customer.ciudad)}, ${escapeHtml(customer.estado)}, C.P. ${escapeHtml(customer.cp)}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 0 40px 24px 40px;">
                      <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #18181b; letter-spacing: 0.05em; margin-bottom: 8px;">
                        Resumen de Productos
                      </div>
                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                        <thead>
                          <tr>
                            <th align="left" style="padding: 8px 0; font-size: 12px; font-weight: 500; color: #71717a; border-bottom: 1px solid #e4e4e7;">Producto</th>
                            <th align="center" style="padding: 8px 0; width: 60px; font-size: 12px; font-weight: 500; color: #71717a; border-bottom: 1px solid #e4e4e7;">Cant.</th>
                            <th align="right" style="padding: 8px 0; width: 100px; font-size: 12px; font-weight: 500; color: #71717a; border-bottom: 1px solid #e4e4e7;">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${itemsTableRows}
                        </tbody>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 0 40px 32px 40px;">
                      <table
                        width="100%"
                        border="0"
                        cellspacing="0"
                        cellpadding="0"
                        style="background: #18181b; border-radius: 12px;"
                      >
                        <tr>
                          <td style="padding: 20px 24px;">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                              <tr>
                                <td>
                                  <div style="font-size: 12px; font-weight: 500; text-transform: uppercase; color: #a1a1aa; letter-spacing: 0.05em; margin-bottom: 4px;">Total Cobrado</div>
                                  <div style="font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: -0.02em;">${formatCurrency(amount)}</div>
                                </td>
                                <td align="right" style="vertical-align: middle;">
                                  <div style="display: inline-block; background: #27272a; border: 1px solid #3f3f46; border-radius: 6px; padding: 6px 12px; font-size: 12px; font-weight: 600; color: #ffffff;">
                                    Fondos Asegurados
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                ${emailFooter}

              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    /*
    |--------------------------------------------------------------------------
    | ENVÍOS DE EMAIL VIA RESEND
    |--------------------------------------------------------------------------
    */
    await resend.emails.send({
      from: "Zenvia <hello@zenvia.com.mx>",
      to: [customer.email],
      subject: `Confirmación de tu Orden #${orderId} - Zenvia`,
      html: htmlCliente,
    });

    await resend.emails.send({
      from: "Notificaciones Zenvia <hello@zenvia.com.mx>",
      to: ["hello@zenvia.com.mx", customer.email],
      subject: `🚨 NUEVA VENTA - Orden #${orderId}`,
      html: htmlNegocio,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error interno del servidor." },
      { status: 500 }
    );
  }
}