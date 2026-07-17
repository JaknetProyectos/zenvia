// app/api/contacto/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getTranslations } from "next-intl/server";

const resend = new Resend(process.env.RESEND_API_KEY);

// Logo principal con letras para el pie del correo
const LOGO_TEXT_URL = "https://zenvia.com.mx/title.png";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { locale, nombre, email, mensaje } = body;

    if (!nombre || !email || !mensaje) {
      return NextResponse.json(
        { error: "Faltan campos requeridos (nombre, email, mensaje)" },
        { status: 400 }
      );
    }

    // Cargar traducciones con el locale recibido
    const t = await getTranslations({ locale, namespace: 'Emails' });

    const safeNombre = escapeHtml(String(nombre));
    const safeEmail = escapeHtml(String(email));
    const safeMensaje = escapeHtml(String(mensaje)).replace(/\n/g, "<br>");

    const card = `
      <table
        width="100%"
        border="0"
        cellspacing="0"
        cellpadding="0"
        style="
          max-width: 640px;
          margin: 0 auto;
          background: #ffffff;
          border: 1px solid #e5e5e5;
        "
      >
        <tr>
          <td style="height: 4px; background: #e11d48; font-size: 0; line-height: 0;">&nbsp;</td>
        </tr>

        <tr>
          <td style="padding: 40px 40px 0 40px;">
            <table
              width="100%"
              border="0"
              cellspacing="0"
              cellpadding="0"
              style="
                background: #f0f7ff;
                border: 1px solid #d0e3ff;
              "
            >
              <tr>
                <td style="padding: 32px 32px 32px 32px; text-align: left;">
                  <div
                    style="
                      display: inline-block;
                      padding: 4px 0;
                      color: #e11d48;
                      font-size: 10px;
                      font-weight: 700;
                      letter-spacing: 0.2em;
                      text-transform: uppercase;
                      margin-bottom: 12px;
                    "
                  >
                    ${t('contact.companyName')}
                  </div>

                  <h1
                    style="
                      margin: 0;
                      font-size: 22px;
                      line-height: 1.3;
                      color: #0056b3;
                      font-weight: 700;
                      letter-spacing: -0.01em;
                      text-transform: uppercase;
                    "
                  >
                    ${t('contact.businessTitle')}
                  </h1>

                  <p
                    style="
                      margin: 8px 0 0 0;
                      font-size: 13px;
                      line-height: 1.6;
                      color: #404040;
                    "
                  >
                    ${t('contact.businessDescription')}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
    `;

    const footer = `
        <tr>
          <td style="padding: 0 40px 40px 40px;">
            <table
              width="100%"
              border="0"
              cellspacing="0"
              cellpadding="0"
              style="
                margin-top: 24px;
                background: #ffffff;
                border-top: 1px solid #e5e5e5;
              "
            >
              <tr>
                <td style="padding: 24px 0 0 0; text-align: center;">
                  <img
                    src="${LOGO_TEXT_URL}"
                    alt="Zenvia"
                    style="
                      width: 140px;
                      max-width: 100%;
                      height: auto;
                      display: block;
                      margin: 0 auto 16px auto;
                    "
                  />

                  <p
                    style="
                      margin: 0;
                      font-size: 11px;
                      line-height: 1.6;
                      color: #737373;
                      letter-spacing: 0.02em;
                    "
                  >
                    ${t('contact.footerCopyright')}<br>
                    ${t('contact.footerSupport')}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `;

    const htmlNegocio = `
      <!DOCTYPE html>
      <html>
        <body
          style="
            margin: 0;
            padding: 0;
            background: #fafafa;
            font-family: Arial, Helvetica, sans-serif;
          "
        >
          <table
            width="100%"
            border="0"
            cellspacing="0"
            cellpadding="0"
            style="background: #fafafa; padding: 40px 16px;"
          >
            <tr>
              <td align="center">
                ${card}

                <table
                  width="100%"
                  border="0"
                  cellspacing="0"
                  cellpadding="0"
                  style="
                    max-width: 640px;
                    margin: 0 auto;
                    background: #ffffff;
                    border-left: 1px solid #e5e5e5;
                    border-right: 1px solid #e5e5e5;
                  "
                >
                  <tr>
                    <td style="padding: 24px 40px 0 40px;">
                      <div
                        style="
                          background: #ffffff;
                          border: 1px solid #e5e5e5;
                          overflow: hidden;
                        "
                      >
                        <div
                          style="
                            padding: 12px 16px;
                            background: #fff1f2;
                            border-bottom: 1px solid #e5e5e5;
                          "
                        >
                          <p
                            style="
                              margin: 0;
                              font-size: 11px;
                              font-weight: 700;
                              letter-spacing: 0.15em;
                              text-transform: uppercase;
                              color: #e11d48;
                            "
                          >
                            ${t('contact.applicantData')}
                          </p>
                        </div>

                        <div style="padding: 16px;">
                          <table
                            width="100%"
                            border="0"
                            cellspacing="0"
                            cellpadding="0"
                          >
                            <tr>
                              <td
                                style="
                                  padding: 8px 0;
                                  width: 26%;
                                  font-size: 11px;
                                  font-weight: 700;
                                  color: #737373;
                                  text-transform: uppercase;
                                  letter-spacing: 0.05em;
                                "
                              >
                                ${t('contact.nameLabel')}
                              </td>
                              <td
                                style="
                                  padding: 8px 0;
                                  font-size: 13px;
                                  color: #171717;
                                  font-weight: 400;
                                "
                              >
                                ${safeNombre}
                              </td>
                            </tr>
                            <tr>
                              <td
                                style="
                                  padding: 8px 0;
                                  width: 26%;
                                  font-size: 11px;
                                  font-weight: 700;
                                  color: #737373;
                                  border-top: 1px solid #e5e5e5;
                                  text-transform: uppercase;
                                  letter-spacing: 0.05em;
                                "
                              >
                                ${t('contact.emailLabel')}
                              </td>
                              <td
                                style="
                                  padding: 8px 0;
                                  font-size: 13px;
                                  color: #0056b3;
                                  font-weight: 400;
                                  border-top: 1px solid #e5e5e5;
                                "
                              >
                                <a
                                  href="mailto:${safeEmail}"
                                  style="color: #0056b3; text-decoration: underline;"
                                >
                                  ${safeEmail}
                                </a>
                              </td>
                            </tr>
                          </table>
                        </div>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 24px 40px 24px 40px;">
                      <div
                        style="
                          background: #ffffff;
                          border: 1px solid #e5e5e5;
                          overflow: hidden;
                        "
                      >
                        <div
                          style="
                            padding: 12px 16px;
                            background: #f0f7ff;
                            border-bottom: 1px solid #e5e5e5;
                          "
                        >
                          <p
                            style="
                              margin: 0;
                              font-size: 11px;
                              font-weight: 700;
                              letter-spacing: 0.15em;
                              text-transform: uppercase;
                              color: #0056b3;
                            "
                          >
                            ${t('contact.messageSectionTitle')}
                          </p>
                        </div>

                        <div style="padding: 16px;">
                          <p
                            style="
                              margin: 0;
                              font-size: 13px;
                              line-height: 1.6;
                              color: #404040;
                              white-space: normal;
                            "
                          >
                            ${safeMensaje}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                </table>

                ${footer}
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    const htmlUsuario = `
      <!DOCTYPE html>
      <html>
        <body
          style="
            margin: 0;
            padding: 0;
            background: #fafafa;
            font-family: Arial, Helvetica, sans-serif;
          "
        >
          <table
            width="100%"
            border="0"
            cellspacing="0"
            cellpadding="0"
            style="background: #fafafa; padding: 40px 16px;"
          >
            <tr>
              <td align="center">
                ${card}

                <table
                  width="100%"
                  border="0"
                  cellspacing="0"
                  cellpadding="0"
                  style="
                    max-width: 640px;
                    margin: 0 auto;
                    background: #ffffff;
                    border-left: 1px solid #e5e5e5;
                    border-right: 1px solid #e5e5e5;
                  "
                >
                  <tr>
                    <td style="padding: 24px 40px 0 40px;">
                      <div
                        style="
                          background: #ffffff;
                          border: 1px solid #e5e5e5;
                          padding: 32px 24px;
                          text-align: left;
                        "
                      >
                        <h2
                          style="
                            margin: 0 0 12px 0;
                            font-size: 18px;
                            line-height: 1.3;
                            color: #171717;
                            font-weight: 700;
                            letter-spacing: -0.01em;
                          "
                        >
                          ${t('contact.userGreeting', { name: safeNombre })}
                        </h2>

                        <p
                          style="
                            margin: 0 auto;
                            font-size: 13px;
                            line-height: 1.65;
                            color: #404040;
                          "
                        >
                          ${t('contact.userConfirmation')}
                        </p>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 24px 40px 24px 40px;">
                      <div
                        style="
                          background: #ffffff;
                          border: 1px solid #e5e5e5;
                          overflow: hidden;
                        "
                      >
                        <div
                          style="
                            padding: 12px 16px;
                            background: #f0f7ff;
                            border-bottom: 1px solid #e5e5e5;
                          "
                        >
                          <p
                            style="
                              margin: 0;
                              font-size: 11px;
                              font-weight: 700;
                              letter-spacing: 0.15em;
                              text-transform: uppercase;
                              color: #0056b3;
                            "
                          >
                            ${t('contact.userMessageCopy')}
                          </p>
                        </div>

                        <div style="padding: 16px;">
                          <p
                            style="
                              margin: 0;
                              font-size: 13px;
                              line-height: 1.6;
                              color: #525252;
                              font-style: italic;
                              white-space: normal;
                            "
                          >
                            ${safeMensaje}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                </table>

                ${footer}
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    await Promise.all([
      resend.emails.send({
        from: "Zenvia <hello@zenvia.com.mx>",
        to: ["hello@zenvia.com.mx",email],
        replyTo: email,
        subject: t('contact.businessSubject', { name: nombre }),
        html: htmlNegocio,
      }),
      resend.emails.send({
        from: "Zenvia <hello@zenvia.com.mx>",
        to: [email],
        subject: t('contact.userSubject'),
        html: htmlUsuario,
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ Error enviando los correos:", error);

    return NextResponse.json(
      { error: error?.message || "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}