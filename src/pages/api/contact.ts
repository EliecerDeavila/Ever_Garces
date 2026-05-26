import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { name, email, service, message } = data;

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Nombre, email y mensaje son obligatorios" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (name.length < 3) {
      return new Response(
        JSON.stringify({ error: "El nombre debe tener al menos 3 caracteres" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ error: "Correo electrónico inválido" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (message.length < 10) {
      return new Response(
        JSON.stringify({ error: "El mensaje debe tener al menos 10 caracteres" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Log the form data to console (in server environment)
    console.log("Formulario de contacto recibido:", {
      name,
      email,
      service,
      message,
      timestamp: new Date().toISOString()
    });

    // Return success response without attempting to send email
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Mensaje recibido correctamente. Gracias por contactarnos." 
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing contact form:", error);
    return new Response(
      JSON.stringify({ error: "Error al procesar el mensaje. Intenta de nuevo." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
