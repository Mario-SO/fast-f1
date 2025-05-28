import { html } from "hono/html";

// Props for the layout, including a title and children to render
interface LayoutProps {
  title: string;
  children?: any; // Hono/JSX can accept various types for children
}

export const MainLayout = (props: LayoutProps) => {
  return html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${props.title} - Fast F1</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <script>
        tailwind.config = {
          theme: {
            extend: {
              fontFamily: {
                'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
              },
              colors: {
                'f1-red': '#E10600',
                'f1-dark': '#15151E',
              }
            }
          }
        }
        </script>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        >
        <script
          src="https://unpkg.com/htmx.org@1.9.12"
          integrity="sha384-ujb1lZYygJmzgSwoxRggbCHcjc0rB2XoQrxeTUQyRjrOnlCoYta87iKBWq3EsdM2"
          crossorigin="anonymous"
        ></script>
        <script
          src="https://unpkg.com/alpinejs@3.14.1/dist/cdn.min.js"
          defer
        ></script>
      </head>
      <body class="bg-gray-50 font-sans antialiased">
        <!-- Main Content -->
        <main class="min-h-screen">
          ${props.children}
        </main>
      </body>
    </html>
  `;
};
