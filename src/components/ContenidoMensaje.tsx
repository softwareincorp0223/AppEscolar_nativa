import React from "react";
import { WebView } from "react-native-webview";

const ContenidoMensaje = ({ mensaje }) => {
  const html = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            background: transparent;
          }
          .mensaje {
            height: 200px; /* altura fija */
            overflow-y: auto; /* scroll vertical */
            font-size: 16px;
            line-height: 22px;
            word-wrap: break-word;
          }
        </style>
      </head>
      <body>
        <div class="mensaje">
          ${mensaje}  <!-- Aquí va tu HTML -->
        </div>
      </body>
    </html>
  `;

  return (
    <WebView
      originWhitelist={["*"]}
      source={{ html }}
      style={{ height: 200, backgroundColor: "transparent" }}
      scrollEnabled={true}
      nestedScrollEnabled={true} // 🔹 permite scroll dentro de un contenedor scroll
    />
  );
};

export default ContenidoMensaje;
